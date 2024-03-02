import { getThemeCSS } from '../theme/theme'

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const themeCSS = getThemeCSS('light')
  return (
    <>
      <style jsx global>{`
        ${themeCSS}
      `}</style>
      <div>{children}</div>
    </>
  )
}
