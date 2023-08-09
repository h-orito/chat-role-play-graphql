import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <script
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0917187897820609'
          crossOrigin='anonymous'
        ></script>
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/chat-role-play/favicons/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/chat-role-play/favicons/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/chat-role-play/favicons/favicon-16x16.png'
        />
        <link rel='manifest' href='/chat-role-play/favicons/site.webmanifest' />
        <link
          rel='mask-icon'
          href='/chat-role-play/favicons/safari-pinned-tab.svg'
          color='#5bbad5'
        />
        <meta name='msapplication-TileColor' content='#da532c' />
        <meta name='theme-color' content='#efe9e2' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
