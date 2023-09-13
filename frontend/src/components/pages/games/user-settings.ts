import { useCookies } from 'react-cookie'

export type UserSettings = {
  paging: UserPagingSettings
}

export type UserPagingSettings = {
  pageSize: number
  isDesc: boolean
}

export const defaultUserSettings: UserSettings = {
  paging: {
    pageSize: 10,
    isDesc: true
  }
}

export const useUserPagingSettings = (): [
  UserPagingSettings,
  (pagingSettings: UserPagingSettings) => void
] => {
  const [getCookie, setCookie] = useCookies()
  const userSettings = getCookie['user-settings'] || defaultUserSettings
  const pagingSettings = userSettings.paging
  const savePagingSettings = (pagingSettings: UserPagingSettings): void => {
    userSettings.paging = pagingSettings
    setCookie('user-settings', userSettings)
  }
  return [pagingSettings, savePagingSettings]
}
