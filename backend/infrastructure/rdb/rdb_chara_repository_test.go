package db_test

import (
	"chat-role-play/domain/model"
	db "chat-role-play/infrastructure/rdb"
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
