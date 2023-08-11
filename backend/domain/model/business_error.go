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
