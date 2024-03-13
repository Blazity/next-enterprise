import { Head, Html, Main, NextScript } from 'next/document'
 
export default function Document() {
  return (
    <Html>
      <Head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon.png"></link>
          <meta name="theme-color" content="#fff" />
          <meta name='application-name' content={"pwa test"} />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <meta name='apple-mobile-web-app-status-bar-style' content='default' />
          <meta name='apple-mobile-web-app-title' content={"pwa test"} />
          <meta name='description' content={"fuck me whattttt"} />
          <meta name='format-detection' content='telephone=no' />
          <meta name='mobile-web-app-capable' content='yes' />
          <meta name='theme-color' content='#FFFFFF' />
        </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}