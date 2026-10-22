package usecase

import (
	"sync"
	"time"
)

const (
	// passwordAttemptMaxFailures 回、passwordAttemptWindow の間にパスワードを間違えたら、
	// 最後の失敗から passwordAttemptLockDuration の間は参加できなくする
	passwordAttemptMaxFailures  = 5
	passwordAttemptWindow       = 15 * time.Minute
	passwordAttemptLockDuration = 15 * time.Minute
	// これを超えるプレイヤー×ゲームの記録があれば、古い記録を掃除する
	passwordAttemptSweepThreshold = 1000
)

type passwordAttemptKey struct {
	playerID uint32
	gameID   uint32
}

type passwordAttempt struct {
	failures    []time.Time
	lockedUntil time.Time
}

// passwordAttemptLimiter はゲームの参加パスワードの失敗回数を、プレイヤー×ゲームごとにメモリで数える。
// (バックエンドは 1 台で動かしている。再起動すると回数はリセットされる)
type passwordAttemptLimiter struct {
	mu       sync.Mutex
	attempts map[passwordAttemptKey]*passwordAttempt
	now      func() time.Time
}

func newPasswordAttemptLimiter() *passwordAttemptLimiter {
	return &passwordAttemptLimiter{
		attempts: map[passwordAttemptKey]*passwordAttempt{},
		now:      time.Now,
	}
}

// IsLocked は失敗が続いたため、今は参加できない状態か返す
func (l *passwordAttemptLimiter) IsLocked(playerID, gameID uint32) bool {
	l.mu.Lock()
	defer l.mu.Unlock()
	a, ok := l.attempts[passwordAttemptKey{playerID, gameID}]
	return ok && l.now().Before(a.lockedUntil)
}

// RecordFailure はパスワードの失敗を記録する
func (l *passwordAttemptLimiter) RecordFailure(playerID, gameID uint32) {
	l.mu.Lock()
	defer l.mu.Unlock()
	now := l.now()
	if len(l.attempts) > passwordAttemptSweepThreshold {
		l.sweep(now)
	}
	key := passwordAttemptKey{playerID, gameID}
	a, ok := l.attempts[key]
	if !ok {
		a = &passwordAttempt{}
		l.attempts[key] = a
	}
	a.failures = append(recentFailures(a.failures, now), now)
	if len(a.failures) >= passwordAttemptMaxFailures {
		a.lockedUntil = now.Add(passwordAttemptLockDuration)
	}
}

func (l *passwordAttemptLimiter) sweep(now time.Time) {
	for key, a := range l.attempts {
		if len(recentFailures(a.failures, now)) == 0 && !now.Before(a.lockedUntil) {
			delete(l.attempts, key)
		}
	}
}

func recentFailures(failures []time.Time, now time.Time) []time.Time {
	recent := failures[:0]
	for _, f := range failures {
		if now.Sub(f) < passwordAttemptWindow {
			recent = append(recent, f)
		}
	}
	return recent
}
