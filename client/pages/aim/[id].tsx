import { GetStaticProps } from 'next'
import Head from 'next/head'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import AimCard from '../../components/AimCard'
import AuthGuard from '../../components/AuthGuard'
import Layout from '../../components/Layout'
import { getAim } from '../../services/AimService'

type AimDetailProps = {
  aim: any[]
  errorMessage: string
}

const AimDetail: FunctionComponent<AimDetailProps> = ({ aim, errorMessage }) => {
  if (!aim || errorMessage) {
    return (
      <Layout>
        <Container>
          <h2>Error</h2>
          <p>{errorMessage || 'Unable to fetch aim. Please try again later'}</p>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout>
      <AuthGuard>
        <Head>
          <title>AimDetail | twelvemonth</title>
          <link rel="icon" href="/favicon_1.ico" />
        </Head>

        <Container>
          <AimCard aim={aim} />
          <Divider />
          {/* TODO: Calendar component */}
        </Container>
      </AuthGuard>
    </Layout>
  )
}

export default AimDetail

export const getServerSideProps: GetStaticProps = async (context) => {
  let { id } = context.params
  let data = await getAim(id as string)

  return {
    props: { aim: data.aim, errorMessage: data.message || '' },
  }
}

const Divider = styled.hr`
  margin: 1rem 0;
  border: none;
  height: 2px;
  background-color: ${(props) => props.theme.grey['700']};
`

const Container = styled.main`
  max-width: 500px;
  margin: 4rem auto 2rem;
`
