package model

import "errors"

type ErrBusiness struct {
	Message string
	Err     error
}

func NewErrBusiness(msg string) error {
	return &ErrBusiness{
		Message: msg,
		Err:     errors.New(msg),
	}
}

func (e *ErrBusiness) Error() string {
	return e.Message
}

func (e *ErrBusiness) UnWrap() error {
	return e.Err
}

// ErrWrongGamePassword はゲームの参加パスワードが違うときのエラー (失敗回数を数えるため区別する)
var ErrWrongGamePassword = NewErrBusiness("パスワードが違います")
