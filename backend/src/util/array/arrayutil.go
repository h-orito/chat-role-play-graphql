package array

func ForEach[T any](array []T, f func(T)) {
	for _, value := range array {
		f(value)
	}
}

func Filter[T any](arr []T, predicate func(T) bool) (result []T) {
	for _, value := range arr {
		if predicate(value) {
			result = append(result, value)
		}
	}
	// 実態を作って返す
	if len(result) == 0 {
		return make([]T, 0)
	}
	return
}

func Count[T any](arr []T, predicate func(T) bool) (count int) {
	count = 0
	for _, value := range arr {
		if predicate(value) {
			count++
		}
	}
	return
}

func Find[T any](array []T, predicate func(T) bool) (result *T) {
	for _, value := range array {
		if predicate(value) {
			return &value
		}
	}
	return nil
}

func Map[T, V any](array []T, f func(T) V) (result []V) {
	for _, value := range array {
		result = append(result, f(value))
	}
	// 実態を作って返す
	if len(result) == 0 {
		return make([]V, 0)
	}
	return
}

func MapWithIndex[T, V any](elms []T, fn func(int, T) V) []V {
	result := make([]V, len(elms), cap(elms))
	for i, elm := range elms {
		result[i] = fn(i, elm)
	}
	// 実態を作って返す
	if len(result) == 0 {
		return make([]V, 0)
	}
	return result
}

func FlatMap[T, V any](array []T, fn func(T) []V) (result []V) {
	for _, elm := range array {
		result = append(result, fn(elm)...)
	}
	// 実態を作って返す
	if len(result) == 0 {
		return make([]V, 0)
	}
	return
}
