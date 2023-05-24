package db

import (
	"chat-role-play/src/config"
	"fmt"

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
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		panic(err.Error())
	}

	return DB{
		Connection: db,
	}
}

func Paginate(pageSize int, pageNumber int) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		page := pageNumber
		if page <= 0 {
			page = 1
		}

		var size int
		switch {
		case pageSize > 100:
			size = 100
		case pageSize <= 0:
			size = 10
		default:
			size = pageSize
		}

		offset := (page - 1) * pageSize
		return db.Offset(offset).Limit(size)
	}
}
