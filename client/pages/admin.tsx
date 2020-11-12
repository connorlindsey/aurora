import { GetStaticProps } from 'next'
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

export const getServerSideProps: GetStaticProps = async (context) => {
  let accounts = []
  let earlyAccess = []
  console.log('Getting admin props')
  try {
    let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_SSR}/admin/accounts`)
    accounts = await res.json()
    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_SSR}/admin/earlyAccess`)
    earlyAccess = await res.json()
  } catch (e) {
    if (e instanceof Error) {
      console.log('Error getting props')
      console.error(e.message)
    }
  }

  return {
    props: { accounts, earlyAccess },
  }
}
