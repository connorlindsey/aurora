import { GetStaticProps } from 'next'
import Head from 'next/head'
import React, { FunctionComponent, useState } from 'react'
import AimCard from '../components/AimCard'
import AuthGuard from '../components/AuthGuard'
import Layout from '../components/Layout'
import styled from 'styled-components'
import { Button, TextButton } from '../components/Button'
import Modal from '../components/Modal'
import { Form, Input } from '../components/Form'
import { STATUS } from '../types/common'

type DashboardProps = {
  aims: any[]
}

// TODO: Update aim to route on id instead of name
const Dashboard: FunctionComponent<DashboardProps> = ({ aims }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [status, setStatus] = useState<STATUS>(STATUS.DEFAULT)
  const [error, setError] = useState({ key: '', message: '' })
  const [formValues, setFormValues] = useState({
    name: '',
  })
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    setError({ key: '', message: '' })
    setFormValues({
      ...formValues,
      [e.currentTarget.name]: e.currentTarget.value,
    })
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    if (!formValues.name) {
      return
    }

    setStatus(STATUS.LOADING)
    try {
      // TODO: Call aimService
      const res = 'Success'
      if (res === 'Success') {
        setStatus(STATUS.SUCCESS)
        setIsModalOpen(false)
      } else {
        throw new Error(res)
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message)
        setError({ key: 'FORM', message: e.message })
      }
      setStatus(STATUS.ERROR)
    }
  }

  return (
    <Layout>
      <AuthGuard>
        <Head>
          <title>Dashboard | twelvemonth</title>
          <link rel="icon" href="/favicon_1.ico" />
        </Head>

        <Container>
          {aims.length > 0 ? (
            <>
              <Row>
                <h1>Your Aims</h1>
                <TextButton onClick={() => setIsModalOpen(!isModalOpen)}>+ Aim</TextButton>
              </Row>
              {aims.map((aim) => (
                <AimCard key={aim.id} aim={aim} />
              ))}
            </>
          ) : (
            <EmptyState>
              <h1>Create an Aim</h1>
              <hr />
              <p>Track daily progress in any area of your life, represented by an aim</p>
              <Button onClick={() => setIsModalOpen(!isModalOpen)}>Create Aim</Button>
            </EmptyState>
          )}
        </Container>
        <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
          <Form
            onSubmit={handleSubmit}
            padding=".5rem 0 0"
            maxWidth="420px"
            errorKey="FORM"
            error={error}
          >
            <h2 style={{ textAlign: 'center' }}>Create Aim</h2>
            <fieldset disabled={status === STATUS.LOADING}>
              <Input
                name="name"
                aria-label="Name"
                label="Name"
                placeholder="Name"
                onChange={(e) => handleInput(e)}
                required
              />
              <Button type="submit" loading={status === STATUS.LOADING}>
                Create Aim
              </Button>
            </fieldset>
          </Form>
        </Modal>
      </AuthGuard>
    </Layout>
  )
}

export default Dashboard

export const getServerSideProps: GetStaticProps = async (context) => {
  let aims = []
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_SSR}/aims`)
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

const EmptyState = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  hr {
    height: 4px;
    background-color: ${(props) => props.theme.primary['500']};
    border-radius: ${(props) => props.theme.borderRadius};
    border: none;
    width: 160px;
    margin: 0rem auto 0.5rem;
  }

  p {
    max-width: 40ch;
  }
`
