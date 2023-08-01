package graphql

import (
	"encoding/base64"
	"fmt"
)

func intIdToBase64(id uint32, prefix string) string {
	str := fmt.Sprintf("%s:%d", prefix, id)
	return base64.StdEncoding.EncodeToString([]byte(str))
}

func int64IdToBase64(id uint64, prefix string) string {
	str := fmt.Sprintf("%s:%d", prefix, id)
	return base64.StdEncoding.EncodeToString([]byte(str))
}
