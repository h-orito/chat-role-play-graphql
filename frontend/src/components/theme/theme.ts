export type Theme = {
  base: BaseTheme
  sidebar: SidebarTheme
  primary: TypeTheme
  secondary: TypeTheme
  warning: TypeTheme
  danger: TypeTheme
  notification: TypeTheme
}

export type BaseTheme = {
  text: string
  link: string
  background: string
  border: string
}

export type SidebarTheme = {
  text: string
  background: string
  hover: string
}

export const lightTheme: Theme = {
  base: {
    text: '#374151',
    link: '#3b82f6',
    background: '#fff',
    border: '#d1d5db'
  },
  sidebar: {
    text: '#374151',
    background: '#fff',
    hover: '#e2e8f0'
  },
  primary: {
    text: '#374151',
    border: '#3b82f6',
    background: '#dbeafe',
    active: '#93c5fd'
  },
  secondary: {
    text: '#6b7280',
    border: '#6b7280',
    background: '#f3f4f6',
    active: '#d1d5db'
  },
  warning: {
    text: '#000',
    border: '#eab308',
    background: '#fef9c3',
    active: '#fde047'
  },
  danger: {
    text: '#000',
    border: '#ef4444',
    background: '#fee2e2',
    active: '#fca5a5'
  },
  notification: {
    text: '#000',
    border: '#f3f3f6',
    background: '#f3f3f6',
    active: '#eee'
  }
}

const darkTheme: Theme = {
  base: {
    text: '#fff',
    link: '#14b4ff',
    background: '#222222',
    border: '#464545'
  },
  sidebar: {
    text: '#fff',
    background: '#363636',
    hover: '#222222'
  },
  primary: {
    text: '#fff',
    border: '#3b82f6',
    background: '#3991f4',
    active: '#3b82f6'
  },
  secondary: {
    text: '#aaa',
    border: '#6b7280',
    background: '#777',
    active: '#d1d5db'
  },
  warning: {
    text: '#000',
    border: '#eab308',
    background: '#fef9c3',
    active: '#fde047'
  },
  danger: {
    text: '#fff',
    border: '#ef4444',
    background: '#f87171',
    active: '#ef4444'
  },
  notification: {
    text: '#eee',
    border: '#777',
    background: '#777',
    active: '#eee'
  }
}

export type TypeTheme = {
  text: string
  border: string
  background: string
  active: string
}

const buttonCss = (typeTheme: TypeTheme) => `
color: ${typeTheme.text};
border-color: ${typeTheme.border};
background-color: ${typeTheme.background};
&:hover {
    background-color: ${typeTheme.active};
}
&:disabled {
    color: #fff;
    background-color: #9ca3af;
}
`

export const themeOptions = [
  {
    label: 'ライト',
    value: 'light'
  },
  {
    label: 'ダーク',
    value: 'dark'
  }
]

export const themeMap: Map<string, Theme> = new Map<string, Theme>([
  ['light', lightTheme],
  ['dark', darkTheme]
])

export const getThemeCSS = (themeName: string = 'light'): string => {
  const theme = themeMap.get(themeName)!
  return convertThemeToCSS(theme)
}

export const convertThemeToCSS = (theme: Theme): string => {
  return `
    body {
        color: ${theme.base.text};
        background-color: ${theme.base.background};
    }
    .base-text {
        color: ${theme.base.text};
    }
    .base-link {
        color: ${theme.base.link};
    }
    .base-background {
        background-color: ${theme.base.background};
    }
    .base-border {
        border-color: ${theme.base.border};
    }
    .sidebar-background {
        background-color: ${theme.sidebar.background};
    }
    .sidebar-text {
        color: ${theme.sidebar.text};
    }
    .sidebar-hover {
        &:hover {
            background-color: ${theme.sidebar.hover};
        }
    }
    .primary-text {
        color: ${theme.primary.text};
    }
    .primary-hover-text {
        &:hover {
            color: ${theme.primary.text};
        }
    }
    .primary-button {
        ${buttonCss(theme.primary)}
    }
    .primary-border {
        border-color: ${theme.primary.border};
    }
    .primary-background {
        background-color: ${theme.primary.background};
    }
    .primary-active {
        background-color: ${theme.primary.active};
    }
    .primary-hover-background {
        &:hover {
            background-color: ${theme.primary.active};
        }
    }
    .secondary-text {
        color: ${theme.secondary.text};
    }
    .secondary-button {
        ${buttonCss(theme.secondary)}
    }
    .secondary-border {
        border-color: ${theme.secondary.border};
    }
    .secondary-background {
        background-color: ${theme.secondary.background};
    }
    .secondary-active {
        background-color: ${theme.secondary.active};
    }
    .warning-text {
        color: ${theme.warning.text};
    }
    .warning-button {
        ${buttonCss(theme.warning)}
    }
    .warning-border {
        border-color: ${theme.warning.border};
    }
    .warning-background {
        background-color: ${theme.warning.background};
    }
    .warning-active {
        background-color: ${theme.warning.active};
    }
    .danger-text {
        color: ${theme.danger.text};
    }
    .danger-button {
        ${buttonCss(theme.danger)}
    }
    .danger-border {
        border-color: ${theme.danger.border};
    }
    .danger-background {
        background-color: ${theme.danger.background};
    }
    .danger-active {
        background-color: ${theme.danger.active};
    }
    .notification-text {
        color: ${theme.notification.text};
    }
    .notification-button {
        ${buttonCss(theme.notification)}
    }
    .notification-border {
        border-color: ${theme.notification.border};
    }
    .notification-background {
        background-color: ${theme.notification.background};
    }
    .notification-active {
        background-color: ${theme.notification.active};
    }
    `
}
