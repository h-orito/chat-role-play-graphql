import { getThemeCSS } from '../theme/theme'

export default function RootLayout({
  children,
  themeName = 'light'
}: {
  children: React.ReactNode
  themeName?: string
}) {
  const themeCSS = getThemeCSS(themeName)
  return (
    <>
      <div>{children}</div>
      <style jsx global>{`
        ${themeCSS}
      `}</style>
    </>
  )
}
