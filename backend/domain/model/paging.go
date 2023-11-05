package model

type PagingQuery struct {
	PageSize   int
	PageNumber int
	Desc       bool
	Latest     bool
}
