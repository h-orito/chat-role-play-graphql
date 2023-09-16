import { useEffect, useState } from 'react'
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
