package db_test

import (
	"chat-role-play/domain/model"
	db "chat-role-play/infrastructure/rdb"
	"context"
	"testing"
)

func newCharaRepository() model.CharaRepository {
	database := NewTestDB()
	return db.NewCharaRepository(&database)
}

func TestFindDesigners(t *testing.T) {
	repo := newCharaRepository()
	got, err := repo.FindDesigners(model.DesignerQuery{})
	if err != nil {
		t.Errorf("failed to find designers: %s", err)
	}
	wantSize := 1
	if len(got) != wantSize {
		t.Errorf("got %d designers, want %d", len(got), wantSize)
	}
}

func TestFindDesigner(t *testing.T) {
	repo := newCharaRepository()
	got, err := repo.FindDesigner(1)
	if err != nil {
		t.Errorf("failed to find designer: %s", err)
	}
	if got == nil {
		t.Errorf("got nil, want designer")
	}
}

func TestRegisterDesigner(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewCharaRepository(&database)
		designer := model.Designer{
			Name: "test designer",
		}
		got, err := repo.RegisterDesigner(ctx, designer)
		if err != nil {
			t.Errorf("failed to register designer: %s", err)
		}
		if got == nil {
			t.Errorf("got nil, want designer")
		}
		return got, nil
	})
}

func TestFindCharachips(t *testing.T) {
	repo := newCharaRepository()
	got, err := repo.FindCharachips(model.CharachipQuery{})
	if err != nil {
		t.Errorf("failed to find charachips: %s", err)
	}
	wantSize := 1
	if len(got) != wantSize {
		t.Errorf("got %d charachips, want %d", len(got), wantSize)
	}
}

func TestFindCharachip(t *testing.T) {
	repo := newCharaRepository()
	got, err := repo.FindCharachip(1)
	if err != nil {
		t.Errorf("failed to find charachip: %s", err)
	}
	if got == nil {
		t.Errorf("got nil, want charachip")
	}
}

func TestRegisterCharachip(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewCharaRepository(&database)
		charachip := model.Charachip{
			Name: "test charachip",
			Designer: model.Designer{
				ID: 1,
			},
			Charas: []model.Chara{},
		}
		got, err := repo.RegisterCharachip(ctx, charachip)
		if err != nil {
			t.Errorf("failed to register charachip: %s", err)
		}
		if got == nil {
			t.Errorf("got nil, want charachip")
		}
		return got, nil
	})
}

func TestFindCharas(t *testing.T) {
	repo := newCharaRepository()
	got, err := repo.FindCharas(model.CharaQuery{})
	if err != nil {
		t.Errorf("failed to find charas: %s", err)
	}
	wantSize := 2
	if len(got) != wantSize {
		t.Errorf("got %d charas, want %d", len(got), wantSize)
	}
}

func TestFindChara(t *testing.T) {
	repo := newCharaRepository()
	got, err := repo.FindChara(1)
	if err != nil {
		t.Errorf("failed to find chara: %s", err)
	}
	if got == nil {
		t.Errorf("got nil, want chara")
	}
}

func TestRegisterChara(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewCharaRepository(&database)
		chara := model.Chara{
			Name:   "test chara",
			Images: []model.CharaImage{},
		}
		var charachipID uint32 = 1
		got, err := repo.RegisterChara(ctx, chara, &charachipID, nil)
		if err != nil {
			t.Errorf("failed to register chara: %s", err)
		}
		if got == nil {
			t.Errorf("got nil, want chara")
		}
		return got, nil
	})
}

func TestFindCharaImages(t *testing.T) {
	repo := newCharaRepository()
	got, err := repo.FindCharaImages(model.CharaImageQuery{})
	if err != nil {
		t.Errorf("failed to find chara images: %s", err)
	}
	wantSize := 2
	if len(got) != wantSize {
		t.Errorf("got %d chara images, want %d", len(got), wantSize)
	}
}

func TestRegisterCharaImage(t *testing.T) {
	database := NewTestDB()
	transaction := NewTestTransaction(database.Connection)
	transaction.DoInTx(context.Background(), func(ctx context.Context) (interface{}, error) {
		repo := db.NewCharaRepository(&database)
		charaImage := model.CharaImage{
			Type: "test type",
			Size: model.CharaSize{
				Width:  100,
				Height: 100,
			},
			URL: "test url",
		}
		var charaID uint32 = 1
		got, err := repo.RegisterCharaImage(ctx, charaImage, charaID)
		if err != nil {
			t.Errorf("failed to register chara: %s", err)
		}
		if got == nil {
			t.Errorf("got nil, want chara")
		}
		return got, nil
	})
}
