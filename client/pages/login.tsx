import { useRouter } from 'next/router'
import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components'
import { Button } from '../components/Button'
import { Form, Input } from '../components/Form'
import Layout from '../components/Layout'
import useAuth from '../services/useAuth'

enum STATUS {
  DEFAULT,
  LOADING,
  ERROR,
  SUCCESS,
}

const Login: FunctionComponent = () => {
  const { login } = useAuth()
  const router = useRouter()
  const [status, setStatus] = useState<STATUS>(STATUS.DEFAULT)
  const [error, setError] = useState({ key: '', message: '' })
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
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
    if (!formValues.email || !formValues.password) {
      return
    }

    setStatus(STATUS.LOADING)
    try {
      const res = await login(formValues)
      if (res === 'Success') {
        setStatus(STATUS.SUCCESS)
        router.push('/dashboard')
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
      <Card>
        <h1>Login</h1>
        <Form
          onSubmit={handleSubmit}
          padding=".5rem 0 0"
          maxWidth="420px"
          errorKey="FORM"
          error={error}
        >
          <fieldset disabled={status === STATUS.LOADING}>
            <Input
              name="email"
              aria-label="Email"
              label="Email"
              type="email"
              placeholder="Email"
              onChange={(e) => handleInput(e)}
              required
            />
            <Input
              name="password"
              aria-label="Password"
              type="password"
              label="Password"
              placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
              onChange={(e) => handleInput(e)}
              required
            />
            <Button type="submit" loading={status === STATUS.LOADING}>
              Login
            </Button>
          </fieldset>
        </Form>
      </Card>
    </Layout>
  )
}

export default Login

const Card = styled.div`
  background-color: ${(props) => props.theme.grey['800']};
  padding: 1rem 1rem 1.5rem;
  max-width: 500px;
  margin: 0 auto;
  margin-top: max(10vh, 5rem);
  border-radius: ${(props) => props.theme.borderRadius};

  h1 {
    margin: 0;
    text-align: center;
    font-size: 1.4rem;
    font-weight: 500;
  }
`
