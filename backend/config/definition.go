package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// マッピング用の構造体
type Config struct {
	Db    Db
	Oauth Oauth
	Image Image
	Env   string
}

type Db struct {
	Host string
	Name string
	User string
	Pass string
}

type Oauth struct {
	IssuerUri string
	Audience  string
}

type Image struct {
	UploaderHost string
	Domain       string
}

func Load() (*Config, error) {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Printf(".env file not exist.", err)
	}

	return &Config{
		Db: Db{
			Host: os.Getenv("DB_HOST"),
			Name: os.Getenv("DB_NAME"),
			User: os.Getenv("DB_USER"),
			Pass: os.Getenv("DB_PASS"),
		},
		Oauth: Oauth{
			IssuerUri: os.Getenv("OAUTH_ISSUERURI"),
			Audience:  os.Getenv("OAUTH_AUDIENCE"),
		},
		Image: Image{
			UploaderHost: os.Getenv("IMAGE_UPLOADER_HOST"),
			Domain:       os.Getenv("IMAGE_DOMAIN"),
		},
		Env: os.Getenv("ENV"),
	}, nil
}
