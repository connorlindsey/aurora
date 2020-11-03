import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { AuthService } from '../services/AuthService'
import Theme from '../styles/defaultTheme'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthService>
      <ThemeProvider theme={Theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthService>
  )
}

export default MyApp
