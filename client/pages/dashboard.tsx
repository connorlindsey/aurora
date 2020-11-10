import { GetStaticProps } from 'next'
import Head from 'next/head'
import React, { FunctionComponent } from 'react'
import AuthGuard from '../components/AuthGuard'
import Layout from '../components/Layout'
import { Button } from '../components/Button'
import { Headline, Title } from '../components/typography'
import styled from 'styled-components'


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
          { aims.length ? 
          <div>
            <h1>Dashboard</h1>
            <p>List of aims:</p>
            <ul>
              {aims.map((aim) => (
                <li key={aim.id}>{aim.name}</li>
              ))}            </ul>
          </div> : 
          <Container> 
           <Headline>Create An Aim</Headline> 
           <Hr/>
           <Title>Track daily progress in any area of your life, represented by an aim.</Title>
           <Button>Get Started</Button>
          </Container>}
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
    "name": "Read",
    "id": 1,
    "description":"Read 50 pages/day"
	  },
	  {
    "name": "Sleep",
    "id": 2,
    "description":"Sleep 8hrs/ night"
	  },
	  {
    "name": "Workout",
    "id": 3,
    "description":"Do some sort of exercise"
	  }
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
  height: 1px;
  background-color: #5CD670;
  border: none;
`
