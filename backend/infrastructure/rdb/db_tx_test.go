package db_test

import (
	"context"
	"errors"
	"testing"
	"time"

	model "chat-role-play/domain/model"
	db "chat-role-play/infrastructure/rdb"
)

// DoInTx 内の読み取りが tx の接続を共有すること (#47)。
// MaxOpenConns=1 にすると、読み取りが tx と別の接続を取ろうとした場合はプール待ちで永久にブロックする
// (変更前の挙動)。tx を共有していれば即座に返る。
func TestConnSharesTxConnectionInsideDoInTx(t *testing.T) {
	database := NewTestDB()
	sqlDB, err := database.Connection.DB()
	if err != nil {
		t.Fatal(err)
	}
	sqlDB.SetMaxOpenConns(1)
	defer sqlDB.SetMaxOpenConns(0)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	repo := db.NewCharaRepository(&database)
	transaction := NewTestTransaction(database.Connection)
	done := make(chan error, 1)
	go func() {
		_, err := transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
			tx, ok := db.GetTx(ctx)
			if !ok {
				t.Error("tx not found in ctx")
			}
			if database.Conn(ctx) != tx {
				t.Error("Conn(ctx) should return tx inside DoInTx")
			}
			// tx を保持したまま読み取り。別接続を取ろうとするとプール (上限 1) 待ちでハングする
			_, err := repo.FindDesigners(ctx, model.DesignerQuery{})
			return nil, err
		})
		done <- err
	}()

	select {
	case err := <-done:
		if err != nil {
			t.Fatalf("read inside tx failed: %v", err)
		}
	case <-time.After(6 * time.Second):
		t.Fatal("read inside DoInTx blocked: it is not sharing the tx connection")
	}
}

// Conn(ctx) が ctx を引き継ぎ、context timeout でクエリを打ち切れること (#47)。
func TestConnRespectsContextTimeout(t *testing.T) {
	database := NewTestDB()
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
	defer cancel()

	start := time.Now()
	result := database.Conn(ctx).Exec("SELECT SLEEP(2)")
	elapsed := time.Since(start)
	if result.Error == nil {
		t.Fatal("expected error by context timeout, got nil")
	}
	if !errors.Is(result.Error, context.DeadlineExceeded) {
		t.Fatalf("expected context.DeadlineExceeded, got %v", result.Error)
	}
	if elapsed > 1500*time.Millisecond {
		t.Fatalf("query was not cancelled by context: took %v", elapsed)
	}
}

// tx 外では Conn(ctx) がベース接続を返すこと。
func TestConnReturnsBaseConnectionOutsideTx(t *testing.T) {
	database := NewTestDB()
	ctx := context.Background()
	if _, ok := db.GetTx(ctx); ok {
		t.Fatal("unexpected tx in background ctx")
	}
	var one int
	if err := database.Conn(ctx).Raw("SELECT 1").Scan(&one).Error; err != nil {
		t.Fatal(err)
	}
	if one != 1 {
		t.Fatalf("got %d, want 1", one)
	}
}

// 対照実験: DoInTx 内で tx を使わずベース接続から読むと、プール上限 (1) に達しているため
// プール待ちになり、context timeout で打ち切られる (変更前の相互待ちの再現)。
func TestSeparateConnectionInsideTxWaitsForPool(t *testing.T) {
	database := NewTestDB()
	sqlDB, err := database.Connection.DB()
	if err != nil {
		t.Fatal(err)
	}
	sqlDB.SetMaxOpenConns(1)
	defer sqlDB.SetMaxOpenConns(0)

	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	transaction := NewTestTransaction(database.Connection)
	_, err = transaction.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		var one int
		// tx ではなくベース接続を使う = 2 本目の接続をプールから取ろうとする
		return nil, database.Connection.WithContext(ctx).Raw("SELECT 1").Scan(&one).Error
	})
	if !errors.Is(err, context.DeadlineExceeded) {
		t.Fatalf("expected pool wait to be cut by context.DeadlineExceeded, got %v", err)
	}
}
