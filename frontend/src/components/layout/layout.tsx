import { getThemeCSS } from '../theme/theme'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const themeCSS = getThemeCSS('light')
  return (
    <>
      <div>{children}</div>
      <style jsx global>{`
        ${themeCSS}
      `}</style>
    </>
  )
}
