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

var txKey = struct{}{}

type tx struct {
	db *gorm.DB
}

func NewTestTransaction(db *gorm.DB) usecase.Transaction {
	return &tx{
		db: db,
	}
}

func (t *tx) DoInTx(ctx context.Context, f func(ctx context.Context) (interface{}, error)) (interface{}, error) {
	var result interface{} = nil
	var err error = nil
	t.db.Transaction(func(tx *gorm.DB) error {
		log.Println("start transaction.")

		// contextにトランザクションを保存
		ctx = context.WithValue(ctx, &txKey, tx)

		// トランザクションの対象処理へコンテキストを引き継ぎ
		result, err = f(ctx)
		if err != nil {
			log.Println("transaction rollbacked.")
			return err // rollback
		}
		return fmt.Errorf("rollback") // テストなので必ずロールバック
	})
	return result, err
}

func GetTx(ctx context.Context) (*gorm.DB, bool) {
	tx, ok := ctx.Value(&txKey).(*gorm.DB)
	return tx, ok
}

func TestNewDB(t *testing.T) {
	// do nothing
}
