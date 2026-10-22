package usecase

import (
	"chat-role-play/application/app_service"
	"chat-role-play/domain/dom_service"
	"chat-role-play/domain/model"
	"context"
	"errors"
	"testing"
	"time"
)

type fakeClock struct{ t time.Time }

func (c *fakeClock) now() time.Time          { return c.t }
func (c *fakeClock) advance(d time.Duration) { c.t = c.t.Add(d) }

func newTestLimiter() (*passwordAttemptLimiter, *fakeClock) {
	clock := &fakeClock{t: time.Date(2026, 10, 1, 0, 0, 0, 0, time.UTC)}
	l := newPasswordAttemptLimiter()
	l.now = clock.now
	return l, clock
}

func TestPasswordAttemptLimiterLocksAfterMaxFailures(t *testing.T) {
	l, clock := newTestLimiter()
	for i := 0; i < passwordAttemptMaxFailures-1; i++ {
		l.RecordFailure(1, 10)
		clock.advance(time.Minute)
	}
	if l.IsLocked(1, 10) {
		t.Fatalf("locked before reaching max failures")
	}
	l.RecordFailure(1, 10)
	if !l.IsLocked(1, 10) {
		t.Fatalf("not locked after max failures")
	}
	// 他のプレイヤー・他のゲームには影響しない
	if l.IsLocked(2, 10) || l.IsLocked(1, 11) {
		t.Errorf("lock leaked to another key")
	}
	// 最後の失敗からロック期間が過ぎるまでは解除されない
	clock.advance(passwordAttemptLockDuration - time.Second)
	if !l.IsLocked(1, 10) {
		t.Errorf("unlocked before lock duration")
	}
	clock.advance(time.Second)
	if l.IsLocked(1, 10) {
		t.Errorf("still locked after lock duration")
	}
}

func TestPasswordAttemptLimiterForgetsOldFailures(t *testing.T) {
	l, clock := newTestLimiter()
	for i := 0; i < passwordAttemptMaxFailures-1; i++ {
		l.RecordFailure(1, 10)
	}
	// 数え始めから時間が経った失敗は数えない
	clock.advance(passwordAttemptWindow)
	l.RecordFailure(1, 10)
	if l.IsLocked(1, 10) {
		t.Errorf("old failures were counted")
	}
}

func TestPasswordAttemptLimiterSweepsExpiredRecords(t *testing.T) {
	l, clock := newTestLimiter()
	for i := uint32(0); i <= passwordAttemptSweepThreshold; i++ {
		l.RecordFailure(i, 10)
	}
	clock.advance(passwordAttemptWindow)
	l.RecordFailure(9999, 10)
	if len(l.attempts) != 1 {
		t.Errorf("expired records were not swept: %d", len(l.attempts))
	}
}

type fakeTransaction struct{}

func (fakeTransaction) DoInTx(ctx context.Context, f func(context.Context) (interface{}, error)) (interface{}, error) {
	return f(ctx)
}

type fakeParticipateGameService struct {
	app_service.GameService
	game model.Game
}

func (f *fakeParticipateGameService) FindGame(_ context.Context, ID uint32) (*model.Game, error) {
	return &f.game, nil
}

func (f *fakeParticipateGameService) Participate(_ context.Context, _ uint32, participant model.GameParticipant) (*model.GameParticipant, error) {
	participant.ID = 100
	return &participant, nil
}

func TestParticipateLocksAfterWrongPasswords(t *testing.T) {
	correct := "secret"
	game := model.Game{ID: 10, Status: model.GameStatusRecruiting}
	game.Settings.Password = model.GamePasswordSettings{HasPassword: true, Password: &correct}
	gmService := dom_service.NewGameMasterDomainService()
	u := &gameUsecase{
		gameService: &fakeParticipateGameService{game: game},
		playerService: &fakePlayerService{
			players: map[string]model.Player{"player": {ID: 1}},
		},
		gameMasterDomainService:  gmService,
		participateDomainService: dom_service.NewParticipateDomainService(gmService),
		transaction:              fakeTransaction{},
		passwordAttemptLimiter:   newPasswordAttemptLimiter(),
	}
	ctx := context.Background()
	user := model.User{UserName: "player"}
	participate := func(password string) error {
		_, err := u.Participate(ctx, 10, user, model.GameParticipant{Name: "name"}, &password)
		return err
	}

	for i := 0; i < passwordAttemptMaxFailures; i++ {
		if err := participate("wrong"); !errors.Is(err, model.ErrWrongGamePassword) {
			t.Fatalf("attempt %d: want wrong password error, got %v", i+1, err)
		}
	}
	// 失敗が続いた後は、正しいパスワードでも参加できない
	err := participate(correct)
	var bize *model.ErrBusiness
	if err == nil || errors.Is(err, model.ErrWrongGamePassword) || !errors.As(err, &bize) {
		t.Fatalf("want lock error, got %v", err)
	}

	// 別のゲーム (パスワードなし) には影響しない
	u2 := *u
	noPasswordGame := model.Game{ID: 11, Status: model.GameStatusRecruiting}
	u2.gameService = &fakeParticipateGameService{game: noPasswordGame}
	if _, err := u2.Participate(ctx, 11, user, model.GameParticipant{Name: "name"}, nil); err != nil {
		t.Errorf("participate in another game: %v", err)
	}
}

func TestParticipateWithCorrectPassword(t *testing.T) {
	correct := "secret"
	game := model.Game{ID: 10, Status: model.GameStatusRecruiting}
	game.Settings.Password = model.GamePasswordSettings{HasPassword: true, Password: &correct}
	gmService := dom_service.NewGameMasterDomainService()
	u := &gameUsecase{
		gameService:              &fakeParticipateGameService{game: game},
		playerService:            &fakePlayerService{players: map[string]model.Player{"player": {ID: 1}}},
		participateDomainService: dom_service.NewParticipateDomainService(gmService),
		transaction:              fakeTransaction{},
		passwordAttemptLimiter:   newPasswordAttemptLimiter(),
	}
	if _, err := u.Participate(context.Background(), 10, model.User{UserName: "player"}, model.GameParticipant{Name: "name"}, &correct); err != nil {
		t.Errorf("unexpected error: %v", err)
	}
}
