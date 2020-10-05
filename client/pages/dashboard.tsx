import React, { FunctionComponent } from "react"
import { GetStaticProps } from "next"
import Link from "next/link"
import Head from 'next/head'

type DashboardProps = {
  aims: any[]
}

const Dashboard: FunctionComponent<DashboardProps> = ({ aims }) => {
  return (
    <div>
      <Head>
        <title>dashboard | twelvemonth</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Dashboard</h1>
        <p>List of aims:</p>
        <ul>
          {aims.map(aim => <li key={aim.id}>{aim.name}</li>)}
        </ul>
      </main>

      <nav>
        <Link href="/"><a>Home</a></Link>
      </nav>
    </div>
  )
}

export default Dashboard

export const getServerSideProps: GetStaticProps = async (context) => {
  console.info("Getting props")
  let aims = []
  try {
    const res = await fetch('http://localhost:8000/aims')
    const data = await res.json()
    aims = data
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }

  return {
    props: { aims }
  }
}