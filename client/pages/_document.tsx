import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage

    // Generate SSR style sheets
    const sheet = new ServerStyleSheet()
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
      })

    const initialProps = await Document.getInitialProps(ctx)
    return initialProps
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600&family=Nunito:wght@400;600&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <div id="modal" />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
