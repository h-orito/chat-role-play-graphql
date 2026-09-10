package db_test

import (
	"chat-role-play/application/usecase"
	db "chat-role-play/infrastructure/rdb"
	"context"
	"fmt"
	"log"
	"testing"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func NewTestDB() db.DB {
	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8mb4&parseTime=true",
		"chatrp",
		"password",
		"localhost",
		"chat_rp_db",
	)
	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		panic(err.Error())
	}

	return db.DB{
		Connection: database,
	}
}

var errRollback = fmt.Errorf("rollback")

type testTx struct {
	tx usecase.Transaction
}

// NewTestTransaction は本番の db.NewTransaction に委譲しつつ、テスト用に必ずロールバックするトランザクションを返す。
// ctx に保存される tx のキーを本番と共有するため、リポジトリ側の GetTx / Conn(ctx) がテストでもそのまま動く。
func NewTestTransaction(database *gorm.DB) usecase.Transaction {
	return &testTx{
		tx: db.NewTransaction(database),
	}
}

func (t *testTx) DoInTx(ctx context.Context, f func(ctx context.Context) (interface{}, error)) (interface{}, error) {
	var result interface{} = nil
	var err error = nil
	_, txErr := t.tx.DoInTx(ctx, func(ctx context.Context) (interface{}, error) {
		log.Println("start transaction.")
		result, err = f(ctx)
		if err != nil {
			log.Println("transaction rollbacked.")
			return nil, err // rollback
		}
		return nil, errRollback // テストなので必ずロールバック
	})
	if txErr != nil && txErr != errRollback {
		return result, txErr
	}
	return result, err
}

func TestNewDB(t *testing.T) {
	// do nothing
}
