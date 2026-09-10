package health

import (
	"context"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"
)

// pingTimeout は DB 疎通確認の上限。k8s の probe timeoutSeconds はこれより長く設定すること。
const pingTimeout = 3 * time.Second

type handler struct {
	sqlDB *sql.DB
}

// NewHandler は DB の疎通を確認するヘルスチェックハンドラを返す。
// プールから接続を取って Ping するため、プール枯渇でクエリが永久待ちになる状態
// (プロセスは生きているが応答できない) も 503 として検知できる。
func NewHandler(sqlDB *sql.DB) http.Handler {
	return &handler{sqlDB: sqlDB}
}

func (h *handler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	ctx, cancel := context.WithTimeout(req.Context(), pingTimeout)
	defer cancel()

	w.Header().Set("Content-Type", "application/json")
	if err := h.sqlDB.PingContext(ctx); err != nil {
		log.Printf("health check failed: %v", err)
		w.WriteHeader(http.StatusServiceUnavailable)
		json.NewEncoder(w).Encode(map[string]string{"status": "ng", "error": err.Error()})
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}
