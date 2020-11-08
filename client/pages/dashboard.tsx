import { GetStaticProps } from 'next'
import Head from 'next/head'
import React, { FunctionComponent } from 'react'
import AuthGuard from '../components/AuthGuard'
import Layout from '../components/Layout'

type DashboardProps = {
  aims: any[]
}

const Dashboard: FunctionComponent<DashboardProps> = ({ aims }) => {
  return (
    <Layout>
      <AuthGuard>
        <Head>
          <title>Dashboard | twelvemonth</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <h1>Dashboard</h1>
          <p>List of aims:</p>
          <ul>
            {aims.map((aim) => (
              <li key={aim.id}>{aim.name}</li>
            ))}
          </ul>
        </main>
      </AuthGuard>
    </Layout>
  )
}

export default Dashboard

export const getServerSideProps: GetStaticProps = async (context) => {
  console.log('Getting props')
  let aims = []
  try {
    const res = await fetch('http://api:8000/aims')
    const data = await res.json()
    aims = data
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }

  return {
    props: { aims },
  }
}
