import React, { FunctionComponent } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import styled from 'styled-components'

type LayoutProps = {
  title?: string
}

const Layout: FunctionComponent<LayoutProps> = ({ title, children }) => {
  return (
    <Container>
      <Head>
        <title>{title && `${title} | `}twelvemonth</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Content>
        <header>
          <Link href="/">
            <a>twelvemonth</a>
          </Link>
        </header>
        <main>{children}</main>
      </Content>
    </Container>
  )
}

export default Layout

const Container = styled.div`
  padding: 0 2rem;
  background-color: ${(props) => props.theme.grey['900']};
  min-height: 100vh;
  color: #fff;
`

const Content = styled.div`
  margin: 0 auto;
  max-width: ${(props) => props.theme.maxWidth};

  header {
    padding: 1rem 0;

    a {
      font-size: 1.2rem;
    }
  }
`
