import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { FiUser } from 'react-icons/fi'
import styled from 'styled-components'
import useAuth from '../services/useAuth'
import Menu from './Menu'
import { AnimatePresence, motion } from 'framer-motion'

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
  const router = useRouter()
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
        <link rel="icon" href="/favicon_1.ico" />
      </Head>
      <Content>
        <header>
          <Link href="/">
            <a className="logo">twelvemonth</a>
          </Link>
          <nav>
            {paths.map((path) => (
              <Link href={path.url} key={path.url}>
                <a className={`nav-link ${router.pathname === path.url ? 'active' : null}`}>
                  {path.name}
                </a>
              </Link>
            ))}
            {user?.authenticated && (
              <Menu trigger={<MenuButton />}>
                <Link href="/account">
                  <a className={`${router.pathname === '/account' ? 'active' : null}`}>Account</a>
                </Link>
                <button
                  onClick={logout}
                  className="logout"
                  style={{ cursor: 'pointer', padding: 0 }}
                >
                  Logout
                </button>
              </Menu>
            )}
          </nav>
        </header>
        <AnimatePresence>
          <motion.div
            key={router.route}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: 'spring',
              mass: 1,
              stiffness: 100,
              damping: 15,
            }}
          >
            <main>{children}</main>
          </motion.div>
        </AnimatePresence>
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
  overflow: hidden;
`

const Content = styled.div`
  margin: 0 auto;
  max-width: ${(props) => props.theme.maxWidth};
  position: relative;
  overflow-x: hidden;
  min-height: 100vh;

  header {
    padding: 1rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    nav {
      display: flex;
      align-items: center;

      a.nav-link:not(:last-child) {
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

const MenuButton = styled(FiUser)`
  display: block;
  height: 44px;
  width: 44px;
  cursor: pointer;
  background-color: ${(props) => props.theme.grey['800']};
  color: ${(props) => props.theme.grey['300']};
  stroke-width: 2px;
  padding: 8px;
  border-radius: 50%;
  transition: ${(props) => props.theme.transition};

  &:hover {
    background-color: ${(props) => props.theme.grey['700']};
  }
`
