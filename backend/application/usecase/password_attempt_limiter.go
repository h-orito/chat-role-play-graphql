package usecase

import (
	"sync"
	"time"
)

const (
	// passwordAttemptMaxFailures 回、passwordAttemptWindow の間にパスワードを間違えたら、
	// 最後の失敗から passwordAttemptLockDuration の間は参加できなくする
	passwordAttemptMaxFailures  = 5
	passwordAttemptWindow       = 15 * time.Minute
	passwordAttemptLockDuration = 15 * time.Minute
	// これを超えるプレイヤー×ゲームの記録があれば、古い記録を掃除する
	passwordAttemptSweepThreshold = 1000
)

type passwordAttemptKey struct {
	playerID uint32
	gameID   uint32
}

type passwordAttempt struct {
	failures    []time.Time
	lockedUntil time.Time
	// 結果がまだ出ていない試行の数
	inFlight int
}

// passwordAttemptLimiter はゲームの参加パスワードの失敗回数を、プレイヤー×ゲームごとにメモリで数える。
// (バックエンドは 1 台で動かしている。再起動すると回数はリセットされる)
type passwordAttemptLimiter struct {
	mu       sync.Mutex
	attempts map[passwordAttemptKey]*passwordAttempt
	now      func() time.Time
}

func newPasswordAttemptLimiter() *passwordAttemptLimiter {
	return &passwordAttemptLimiter{
		attempts: map[passwordAttemptKey]*passwordAttempt{},
		now:      time.Now,
	}
}

// Acquire は試行を 1 回分予約する。ロック中、または失敗回数と結果待ちの試行の合計が上限に達していれば false を返す。
// (確認と予約を 1 回のロックの中で行い、同時に送られたリクエストで上限を超えて試せないようにする)
func (l *passwordAttemptLimiter) Acquire(playerID, gameID uint32) bool {
	l.mu.Lock()
	defer l.mu.Unlock()
	now := l.now()
	if len(l.attempts) > passwordAttemptSweepThreshold {
		l.sweep(now)
	}
	key := passwordAttemptKey{playerID, gameID}
	a, ok := l.attempts[key]
	if !ok {
		a = &passwordAttempt{}
		l.attempts[key] = a
	}
	a.failures = recentFailures(a.failures, now)
	if now.Before(a.lockedUntil) || len(a.failures)+a.inFlight >= passwordAttemptMaxFailures {
		return false
	}
	a.inFlight++
	return true
}

// Release は Acquire で予約した試行を終える。failed ならパスワードの失敗として数える
func (l *passwordAttemptLimiter) Release(playerID, gameID uint32, failed bool) {
	l.mu.Lock()
	defer l.mu.Unlock()
	a, ok := l.attempts[passwordAttemptKey{playerID, gameID}]
	if !ok {
		return
	}
	a.inFlight--
	if !failed {
		return
	}
	now := l.now()
	a.failures = append(recentFailures(a.failures, now), now)
	if len(a.failures) >= passwordAttemptMaxFailures {
		a.lockedUntil = now.Add(passwordAttemptLockDuration)
	}
}

func (l *passwordAttemptLimiter) sweep(now time.Time) {
	for key, a := range l.attempts {
		if a.inFlight == 0 && len(recentFailures(a.failures, now)) == 0 && !now.Before(a.lockedUntil) {
			delete(l.attempts, key)
		}
	}
}

func recentFailures(failures []time.Time, now time.Time) []time.Time {
	recent := failures[:0]
	for _, f := range failures {
		if now.Sub(f) < passwordAttemptWindow {
			recent = append(recent, f)
		}
	}
	return recent
}
