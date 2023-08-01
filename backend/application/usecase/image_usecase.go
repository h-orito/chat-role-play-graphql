package usecase

import (
	"bytes"
	"chat-role-play/config"
	"encoding/base64"
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"
)

type ImageUsecase interface {
	Upload(file io.Reader) (url *string, err error)
}

type imageUsecase struct {
}

func NewImageUsecase() ImageUsecase {
	return &imageUsecase{}
}

func (*imageUsecase) Upload(file io.Reader) (url *string, err error) {
	return post(file)
}

func post(file io.Reader) (*string, error) {
	cfg, err := config.Load()
	if err != nil {
		panic(err.Error())
	}

	// io.Reader to []byte
	b, err := ioutil.ReadAll(file)
	if err != nil {
		return nil, err
	}
	body := request{
		// []byte to base64
		Body: base64.StdEncoding.EncodeToString(b),
	}
	// to json body
	bodyJson, err := json.Marshal(body)
	if err != nil {
		return nil, err
	}
	// request
	req, err := http.NewRequest(
		"PUT",
		cfg.Image.UploaderHost+"/upload",
		bytes.NewBuffer(bodyJson),
	)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	resBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	key := string(resBody)
	// r2.devを一時的に使用　レート制限があるらしいのでカスタムドメインを使うべきか？
	url := cfg.Image.Domain + key
	return &url, err
}

type request struct {
	Body string `json:"body"`
}
