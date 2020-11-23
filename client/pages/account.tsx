import Head from 'next/head'
import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components'
import AuthGuard from '../components/AuthGuard'
import { Button } from '../components/Button'
import { Form, Input } from '../components/Form'
import Layout from '../components/Layout'
import useAuth from '../services/useAuth'
import { STATUS } from '../types/common'

type AccountProps = {}

const Account: FunctionComponent<AccountProps> = () => {
  const { updatePassword } = useAuth()
  const [status, setStatus] = useState<STATUS>(STATUS.DEFAULT)
  const [error, setError] = useState({ key: '', message: '' })

  // Password reset
  const [passwordValues, setPasswordValues] = useState({
    currPassword: '',
    password: '',
  })
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    setError({ key: '', message: '' })
    setPasswordValues({
      ...passwordValues,
      [e.currentTarget.name]: e.currentTarget.value,
    })
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    if (!passwordValues.currPassword || !passwordValues.password) {
      setError({ key: 'PASS-FORM', message: 'Please fill out both password fields' })
      return
    }

    setStatus(STATUS.LOADING)
    try {
      const res = await updatePassword(passwordValues)
      if (res === 'Success') {
        setError({ key: 'SUCCESS', message: '' })
        setStatus(STATUS.DEFAULT)
      } else {
        throw new Error(res)
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message)
        setError({ key: 'PASS-FORM', message: e.message })
      }
      setStatus(STATUS.ERROR)
    }
  }

  return (
    <Layout>
      <AuthGuard>
        <Head>
          <title>Account | twelvemonth</title>
          <link rel="icon" href="/favicon_1.ico" />
        </Head>
        <Container>
          <h1>Account</h1>
          <div>
            <Section>
              <h2>Update password</h2>
              <Form errorKey="PASS-FORM" error={error} onSubmit={handleSubmit}>
                <Input
                  name="password"
                  aria-label="Password"
                  type="password"
                  label="New Password"
                  placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                  onChange={(e) => handleInput(e)}
                  required
                />
                <Input
                  name="currPassword"
                  aria-label="Password"
                  type="password"
                  label="Current Password"
                  placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                  onChange={(e) => handleInput(e)}
                  required
                />
                <Button type="submit" loading={status === STATUS.LOADING}>
                  Update Password
                </Button>
              </Form>
              {error.key === 'SUCCESS' && (
                <SuccessMessage>Password updated successfully 🎉</SuccessMessage>
              )}
            </Section>
            <Section>
              <h2>Update subscription</h2>
              <p className="description">Manage your payment information through Stripe.</p>
              <Button>Update subscription</Button>
            </Section>
          </div>
        </Container>
      </AuthGuard>
    </Layout>
  )
}

export default Account

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 5rem;
`

const SuccessMessage = styled.div`
  font-size: 1.2rem;
  text-align: center;
`

const Section = styled.section`
  border: 1px solid ${(props) => props.theme.grey['700']};
  max-width: 500px;
  padding: 1rem 2rem;

  :first-child {
    border-top-left-radius: ${(props) => props.theme.borderRadius};
    border-top-right-radius: ${(props) => props.theme.borderRadius};
  }

  :last-child {
    border-bottom-left-radius: ${(props) => props.theme.borderRadius};
    border-bottom-right-radius: ${(props) => props.theme.borderRadius};
  }

  h2 {
    margin-bottom: 0.5rem;
  }

  p.description {
    max-width: 400px;
    margin-bottom: 2rem;
  }
`
