import { GetStaticProps } from 'next'
import Head from 'next/head'
import React, { FunctionComponent, useState } from 'react'
import AimCard from '../components/AimCard'
import AuthGuard from '../components/AuthGuard'
import Layout from '../components/Layout'
import styled from 'styled-components'
import { TextButton } from '../components/Button'
import Modal from '../components/Modal'

type DashboardProps = {
  aims: any[]
}

const Dashboard: FunctionComponent<DashboardProps> = ({ aims }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <Layout>
      <AuthGuard>
        <Head>
          <title>Dashboard | twelvemonth</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Container>
          <Row>
            <h1>Your Aims</h1>
            <TextButton onClick={() => setIsModalOpen(!isModalOpen)}>+ Aim</TextButton>
          </Row>
          {aims.map((aim) => (
            <AimCard key={aim.id} aim={aim} />
          ))}
          {/* TODO: Empty state */}
        </Container>
        <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
          <h1>Add Modal</h1>
        </Modal>
      </AuthGuard>
    </Layout>
  )
}

export default Dashboard

export const getServerSideProps: GetStaticProps = async (context) => {
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

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Container = styled.main`
  max-width: 500px;
  margin: 4rem auto 2rem;

  h1 {
    font-size: 1.5rem;
    font-weight: 400;
  }
`
