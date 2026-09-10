package db_test

import (
	"chat-role-play/domain/model"
	db "chat-role-play/infrastructure/rdb"
	"context"
	"testing"
)

// chara 系は読み取り専用リポジトリのため、docker-compose の seed (04_init-data.sql) に含まれる
// designer 1 / charachip 1 / chara 1, 2 を ID 指定で引いて検証する (全件数には依存しない)。

func newCharaRepository(t *testing.T) (model.CharaRepository, func()) {
	t.Helper()
	database := NewTestDB()
	sqlDB, err := database.Connection.DB()
	if err != nil {
		t.Fatal(err)
	}
	return db.NewCharaRepository(&database), func() { sqlDB.Close() }
}

func TestFindDesigners(t *testing.T) {
	repo, closeDB := newCharaRepository(t)
	defer closeDB()
	ids := []uint32{1}
	got, err := repo.FindDesigners(context.Background(), model.DesignerQuery{IDs: &ids})
	if err != nil {
		t.Fatalf("failed to find designers: %s", err)
	}
	if len(got) != 1 {
		t.Fatalf("got %d designers, want 1", len(got))
	}
	if got[0].ID != 1 || got[0].Name != "いらすとや" {
		t.Errorf("got %+v, want designer 1 いらすとや", got[0])
	}
}

func TestFindDesigner(t *testing.T) {
	repo, closeDB := newCharaRepository(t)
	defer closeDB()
	got, err := repo.FindDesigner(context.Background(), 1)
	if err != nil {
		t.Fatalf("failed to find designer: %s", err)
	}
	if got == nil || got.Name != "いらすとや" {
		t.Errorf("got %+v, want designer いらすとや", got)
	}
}

func TestFindCharachips(t *testing.T) {
	repo, closeDB := newCharaRepository(t)
	defer closeDB()
	ids := []uint32{1}
	got, err := repo.FindCharachips(context.Background(), model.CharachipQuery{IDs: &ids})
	if err != nil {
		t.Fatalf("failed to find charachips: %s", err)
	}
	if len(got) != 1 {
		t.Fatalf("got %d charachips, want 1", len(got))
	}
	if got[0].Name != "人狼BBS" || got[0].Designer.ID != 1 {
		t.Errorf("got %+v, want charachip 人狼BBS (designer 1)", got[0])
	}
	if len(got[0].Charas) == 0 {
		t.Errorf("charachip 1 should have charas")
	}
}

func TestFindCharachip(t *testing.T) {
	repo, closeDB := newCharaRepository(t)
	defer closeDB()
	got, err := repo.FindCharachip(context.Background(), 1)
	if err != nil {
		t.Fatalf("failed to find charachip: %s", err)
	}
	if got == nil || got.Name != "人狼BBS" {
		t.Errorf("got %+v, want charachip 人狼BBS", got)
	}
}

func TestFindCharas(t *testing.T) {
	repo, closeDB := newCharaRepository(t)
	defer closeDB()
	ids := []uint32{1, 2}
	got, err := repo.FindCharas(context.Background(), model.CharaQuery{IDs: &ids})
	if err != nil {
		t.Fatalf("failed to find charas: %s", err)
	}
	if len(got) != 2 {
		t.Fatalf("got %d charas, want 2", len(got))
	}
	for _, c := range got {
		if c.CharachipID != 1 {
			t.Errorf("chara %d belongs to charachip %d, want 1", c.ID, c.CharachipID)
		}
	}
}

func TestFindChara(t *testing.T) {
	repo, closeDB := newCharaRepository(t)
	defer closeDB()
	got, err := repo.FindChara(context.Background(), 1)
	if err != nil {
		t.Fatalf("failed to find chara: %s", err)
	}
	if got == nil || got.Name != "楽天家 ゲルト" {
		t.Fatalf("got %+v, want chara 楽天家 ゲルト", got)
	}
	if len(got.Images) == 0 {
		t.Errorf("chara 1 should have images")
	}
}

func TestFindCharaImages(t *testing.T) {
	repo, closeDB := newCharaRepository(t)
	defer closeDB()
	charaID := uint32(1)
	got, err := repo.FindCharaImages(context.Background(), model.CharaImageQuery{CharaID: &charaID})
	if err != nil {
		t.Fatalf("failed to find chara images: %s", err)
	}
	if len(got) == 0 {
		t.Fatal("got 0 chara images, want at least 1")
	}
	for _, img := range got {
		if img.Type != model.CharaImageTypeNormal {
			t.Errorf("image %d type = %s, want %s", img.ID, img.Type, model.CharaImageTypeNormal)
		}
		if img.URL == "" {
			t.Errorf("image %d has empty URL", img.ID)
		}
	}
}
