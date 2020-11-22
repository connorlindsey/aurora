import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import React, { FunctionComponent } from 'react'
import AuthGuard from '../components/AuthGuard'
import Layout from '../components/Layout'

type AdminProps = {
  accounts: any[]
  earlyAccess: any[]
}

const Admin: FunctionComponent<AdminProps> = ({ accounts, earlyAccess }) => {
  return (
    <Layout>
      <AuthGuard requiredRole="ADMIN">
        <Head>
          <title>Admin | twelvemonth</title>
          <link rel="icon" href="/favicon_1.ico" />
        </Head>

        <main>
          <h2>Accounts</h2>
          <ul>{accounts && accounts.map((account, i) => <li key={i}>{account.email}</li>)}</ul>
          {accounts.length <= 0 && <p>No accounts found</p>}

          <h2>Early Access</h2>
          <ul>{earlyAccess && earlyAccess.map((ea, i) => <li key={i}>{ea.email}</li>)}</ul>
          {earlyAccess.length <= 0 && <p>No early access subscribers found</p>}
        </main>
      </AuthGuard>
    </Layout>
  )
}

export default Admin

export const getServerSideProps: GetServerSideProps = async (context) => {
  let accounts = []
  let earlyAccess = []
  try {
    let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_SSR}/admin/accounts`, {
      headers: context.req ? { cookie: context.req.headers.cookie } : undefined,
    })
    let data = await res.json()
    if (data.status === 'Success') accounts = data.data

    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_SSR}/admin/earlyAccess`, {
      headers: context.req ? { cookie: context.req.headers.cookie } : undefined,
    })
    data = await res.json()
    if (data.status === 'Success') earlyAccess = data.data
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }

  return {
    props: { accounts, earlyAccess },
  }
}
