import { useCookies } from 'react-cookie'

export type UserSettings = {
  paging: UserPagingSettings
  display?: UserDisplaySettings
}

export type UserPagingSettings = {
  pageSize: number
  isDesc: boolean
}

export type UserDisplaySettings = {
  themeName: string
  iconSizeRatio?: number
}

const defaultPagingSettings: UserPagingSettings = {
  pageSize: 10,
  isDesc: true
}

export const defaultDisplaySettings: UserDisplaySettings = {
  themeName: 'original',
  iconSizeRatio: 1
}

export const defaultUserSettings: UserSettings = {
  paging: defaultPagingSettings,
  display: defaultDisplaySettings
}

export const useUserPagingSettings = (): [
  UserPagingSettings,
  (pagingSettings: UserPagingSettings) => void
] => {
  const [cookies, setCookie] = useCookies(['user-settings'])
  const userSettings = cookies['user-settings'] || defaultUserSettings
  const savePagingSettings = (pagingSettings: UserPagingSettings): void => {
    const newSettings = {
      ...userSettings,
      paging: pagingSettings
    }
    setCookie('user-settings', newSettings, {
      path: '/chat-role-play',
      maxAge: 60 * 60 * 24 * 365
    })
  }
  return [userSettings.paging, savePagingSettings]
}

export const useUserDisplaySettings = (): [
  UserDisplaySettings,
  (displaySettings: UserDisplaySettings) => void
] => {
  const [cookies, setCookie] = useCookies(['user-settings'])
  const userSettings: UserSettings =
    cookies['user-settings'] || defaultUserSettings
  const saveDisplaySettings = (displaySettings: UserDisplaySettings): void => {
    const newSettings = {
      ...userSettings,
      display: displaySettings
    }
    setCookie('user-settings', newSettings, {
      path: '/chat-role-play',
      maxAge: 60 * 60 * 24 * 365
    })
  }
  return [userSettings.display ?? defaultDisplaySettings, saveDisplaySettings]
}
