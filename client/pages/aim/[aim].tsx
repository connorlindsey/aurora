import { GetStaticProps } from 'next'
import Head from 'next/head'
import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components'
import AimCard from '../../components/AimCard'
import AuthGuard from '../../components/AuthGuard'
import Layout from '../../components/Layout'

type AimDetailProps = {
  aim: any[]
}

const AimDetail: FunctionComponent<AimDetailProps> = ({ aim }) => {
  return (
    <Layout>
      <AuthGuard>
        <Head>
          <title>AimDetail | twelvemonth</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Container>
          <AimCard aim={{ name: aim, id: Math.floor(Math.random() * Math.floor(1000)) }} />
          <Divider />
          {/* TODO: Calendar component */}
        </Container>
      </AuthGuard>
    </Layout>
  )
}

export default AimDetail

export const getServerSideProps: GetStaticProps = async (context) => {
  const { aim } = context.params

  return {
    props: { aim },
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
