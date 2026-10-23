package repository

// NewNotificationRepositoryAllowingAnyURL は宛先の確認を外したリポジトリを返す (httptest のサーバーに送るため)
func NewNotificationRepositoryAllowingAnyURL() *NotificationRepository {
	r := NewNotificationRepository()
	r.isAllowedURL = func(string) bool { return true }
	return r
}
