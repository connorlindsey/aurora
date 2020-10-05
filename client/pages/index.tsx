import Head from 'next/head'
import Link from "next/link"
import styled from "styled-components";

export default function Home() {
  return (
    <div>
      <Head>
        <title>twelvemonth</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Headline>twelvemonth</Headline>
        <p>Track your aims simply and consistently.</p>
      </main>

      <nav>
        <Link href="/dashboard"><a>Dashboard</a></Link>
      </nav>
    </div>
  )
}

const Headline = styled.h1`
  font-size: 2rem;
  color: #1290be;
`