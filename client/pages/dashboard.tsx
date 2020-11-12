import { GetStaticProps } from 'next'
import Head from 'next/head'
import React, { FunctionComponent, useState } from 'react'
import AuthGuard from '../components/AuthGuard'
import Layout from '../components/Layout'
import { Button } from '../components/Button'
import { Headline, Subheading, Title } from '../components/typography'
import styled from 'styled-components'

type DashboardProps = {
  aims: any[]
}

type CreateAimModalProps = {
  closeModal: () => void
}

const CreateAimModal: FunctionComponent<CreateAimModalProps> = (props) => {
  return (
    <CreateAimContainer>
      <CreateAimFormContainer>
        <form>
          <input placeholder="Name" />
          <input placeholder="Description" />
        </form>
        <Button>save</Button>
        <Button
          //   style={{ margin: '5px' }}
          onClick={() => {
            props.closeModal()
          }}
        >
          cancel
        </Button>
      </CreateAimFormContainer>
    </CreateAimContainer>
  )
}

const CreateAimFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  margin: 0 auto;
  height: 30%;
  padding: 1rem;
  border-radius: 5px;
  border: 2px solid ${(props) => props.theme.primary['900']};
`
const CreateAimContainer = styled.div`
  display: flex;
  width: 90vw;
  height: 60vh;
  position: absolute;
  background-color: ${(props) => props.theme.grey['900']};
`

const Dashboard: FunctionComponent<DashboardProps> = ({ aims }) => {
  const [showCreateAimModal, setShowCreateAimModal] = useState(false)

  return (
    <Layout>
      <AuthGuard>
        <Head>
          <title>Dashboard | twelvemonth</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          {aims.length ? (
            <div>
              <h1>Dashboard</h1>
              <p>List of aims:</p>
              <ul>
                {aims.map((aim) => (
                  <li key={aim.id}>{aim.name}</li>
                ))}
              </ul>
            </div>
          ) : (
            <Container>
              <Headline>Create An Aim</Headline>
              <Hr />
              <Title>Track daily progress in any area of your life, represented by an aim.</Title>
              <Button
                onClick={() => {
                  setShowCreateAimModal(true)
                }}
              >
                Get Started
              </Button>
              {showCreateAimModal ? (
                <CreateAimModal
                  closeModal={() => {
                    setShowCreateAimModal(false)
                  }}
                />
              ) : undefined}
            </Container>
          )}
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

  aims = [
    {
      name: 'Read',
      id: 1,
      description: 'Read 50 pages/day',
    },
    {
      name: 'Sleep',
      id: 2,
      description: 'Sleep 8hrs/ night',
    },
    {
      name: 'Workout',
      id: 3,
      description: 'Do some sort of exercise',
    },
  ]
  aims = []
  return {
    props: { aims },
  }
}

const Container = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 7rem auto;
  flex-direction: column;
  max-width: 50%;
  justify-items: center;

  @media screen and (max-width: 600px) {
    margin: 0 auto;
    width: 90%;
  }
`

const Hr = styled.hr`
  width: 100%;
  background-color: #5cd670;
  border: 1px solid #5cd670;
`
