package db

import (
	"chat-role-play/application/usecase"
	"chat-role-play/config"
	"chat-role-play/domain/model"
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Tabler interface {
	TableName() string
}

type DB struct {
	Connection *gorm.DB
}

func NewDB() DB {
	cfg, err := config.Load()
	if err != nil {
		panic(err.Error())
	}

	// https://gorm.io/ja_JP/docs/connecting_to_the_database.html
	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8mb4&parseTime=true",
		cfg.Db.User,
		cfg.Db.Pass,
		cfg.Db.Host,
		cfg.Db.Name,
	)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags),
			logger.Config{
				LogLevel:                  logger.Error,
				IgnoreRecordNotFoundError: true,
			},
		),
	})
	if err != nil {
		panic(err.Error())
	}

	return DB{
		Connection: db,
	}
}

var txKey = struct{}{}

type tx struct {
	db *gorm.DB
}

func NewTransaction(db *gorm.DB) usecase.Transaction {
	return &tx{
		db: db,
	}
}

func (t *tx) DoInTx(ctx context.Context, f func(ctx context.Context) (interface{}, error)) (interface{}, error) {
	var result interface{} = nil
	var err error = nil
	t.db.Transaction(func(tx *gorm.DB) error {
		// contextにトランザクションを保存
		ctx = context.WithValue(ctx, &txKey, tx)

		// トランザクションの対象処理へコンテキストを引き継ぎ
		result, err = f(ctx)
		if err != nil {
			return err // rollback
		}
		return nil // commit
	})
	return result, err
}

func GetTx(ctx context.Context) (*gorm.DB, bool) {
	tx, ok := ctx.Value(&txKey).(*gorm.DB)
	return tx, ok
}

func Paginate(query *model.PagingQuery) func(db *gorm.DB) *gorm.DB {
	if query == nil {
		return func(db *gorm.DB) *gorm.DB {
			return db.Offset(0).Limit(10)
		}
	}
	return func(db *gorm.DB) *gorm.DB {
		page := query.PageNumber
		if page <= 0 {
			page = 1
		}

		var size int
		switch {
		case query.PageSize <= 0:
			size = 10
		default:
			size = query.PageSize
		}

		offset := (page - 1) * size

		if query.Desc {
			return db.Offset(offset).Limit(size).Order("id desc")
		} else if query.Latest {
			return db.Limit(size).Order("id desc")
		} else {
			return db.Offset(offset).Limit(size).Order("id asc")
		}
	}
}

func likeEscape(str string) string {
	s := strings.ReplaceAll(str, "%", "\\%")
	return fmt.Sprintf("%%%s%%", s)
}

func Like(columnName string, keywords []string) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		var query string
		likeEscapedKeywords := make([]interface{}, len(keywords))
		for idx, kwd := range keywords {
			likeEscapedKeywords[idx] = likeEscape(kwd)
			if idx == 0 {
				query += fmt.Sprintf("%s LIKE ?", columnName)
			} else {
				query += fmt.Sprintf(" OR %s LIKE ?", columnName)
			}
		}
		return db.Where(query, likeEscapedKeywords...)
	}
}
