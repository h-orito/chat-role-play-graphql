package config

import (
	"fmt"
	"strings"

	"github.com/spf13/viper"
)

// マッピング用の構造体
type Config struct {
	Db    Db    `yaml:db`
	Oauth Oauth `yaml:oauth`
}

type Db struct {
	Host string `yaml:"host"`
	Name string `yaml:"name"`
	User string `yaml:"user"`
	Pass string `yaml:"pass"`
}

type Oauth struct {
	IssuerUri string `yaml:"issueruri"`
	Audience  string `yaml:"audience"`
}

func Load() (*Config, error) {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("src/config/")

	viper.AutomaticEnv()
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	err := viper.ReadInConfig()
	if err != nil {
		return nil, fmt.Errorf("failed to load config: %s \n", err)
	}

	var cfg Config

	err = viper.Unmarshal(&cfg)
	if err != nil {
		return nil, fmt.Errorf("unmarshal error: %s \n", err)
	}

	return &cfg, nil
}
