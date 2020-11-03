import Head from 'next/head'
import Link from 'next/link'
import React, { FunctionComponent, useEffect, useState } from 'react'
import styled from 'styled-components'
import useAuth from '../services/useAuth'

type LayoutProps = {
  title?: string
}

type Path = {
  url: string
  name: string
  role?: string
}

const pathMap = {
  '/register': [{ url: '/login', name: 'Login' }],
  '/login': [{ url: '/register', name: 'Sign Up' }],
  loggedIn: [{ url: '/dashboard', name: 'Dashboard' }],
  admin: [{ url: '/admin', name: 'Admin' }],
}

const Layout: FunctionComponent<LayoutProps> = ({ title, children }) => {
  const { user, logout } = useAuth()
  const [paths, setPaths] = useState([])

  useEffect(() => {
    const currentPage = window.location.pathname
    setPaths(pathMap[currentPage] || [])

    if (user?.role === 'ADMIN') {
      if (pathMap.admin.some((p) => !paths.includes(p))) {
        setPaths((prevPaths) => [...prevPaths, ...pathMap.admin])
      }
    }

    if (user?.authenticated) {
      if (pathMap.loggedIn.some((p) => !paths.includes(p))) {
        setPaths((prevPaths) => [...prevPaths, ...pathMap.loggedIn])
      }
    }
  }, [user])

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
            {user?.authenticated && (
              <button onClick={logout} className="logout">
                Logout
              </button>
            )}
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

    nav {
      *:not(:last-child) {
        margin-right: 1rem;
      }
    }

    .logout {
      color: #fff;
      background: none;
      border: none;
    }

    .logout,
    a {
      font-size: 1.2rem;
      &:hover {
        color: ${(props) => props.theme.grey['400']};
      }
    }
  }
`
