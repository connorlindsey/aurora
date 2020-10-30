import Head from 'next/head'
import Link from 'next/link'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components'

type LayoutProps = {
  title?: string
}

type Path = {
  url: string
  name: string
}

const pathMap = {
  '/register': [{ url: '/login', name: 'Login' }],
  '/login': [{ url: '/register', name: 'Sign Up' }],
}

const Layout: FunctionComponent<LayoutProps> = ({ title, children }) => {
  let paths = []
  if (typeof window !== 'undefined') {
    const currentPage = window.location.pathname
    paths = pathMap[currentPage] || []
  }

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
          <nav>
            {paths.map((path) => (
              <Link href={path.url} key={path.url}>
                <a>{path.name}</a>
              </Link>
            ))}
          </nav>
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
    display: flex;
    align-items: center;
    justify-content: space-between;

    a {
      font-size: 1.2rem;
    }
  }
`
