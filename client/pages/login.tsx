import { useRouter } from 'next/router'
import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components'
import { Button } from '../components/Button'
import { Form, Input, Label } from '../components/Form'
import Layout from '../components/Layout'

enum STATUS {
  DEFAULT,
  LOADING,
  ERROR,
  SUCCESS,
}

const Login: FunctionComponent = () => {
  const router = useRouter()
  const [status, setStatus] = useState<STATUS>(STATUS.DEFAULT)
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  })
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    if (!formValues.email || !formValues.password) {
      return
    }
    setStatus(STATUS.LOADING)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      })
      const data = await res.json()
      if (data.status === 'Success') {
        setStatus(STATUS.SUCCESS)
        localStorage.setItem('TOKEN', data.token)
        localStorage.setItem('ACCOUNT', formValues.email)
        router.push('/dashboard')
      } else {
        throw new Error(data.message)
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message)
        // TODO: Display error
      }
      setStatus(STATUS.ERROR)
    }
  }

  return (
    <Layout>
      <Card>
        <h1>Login</h1>
        <Form onSubmit={handleSubmit} padding=".5rem 0 0" maxWidth="420px">
          <fieldset disabled={status === STATUS.LOADING}>
            <Label>
              Email
              <Input
                name="email"
                aria-label="Email"
                type="email"
                placeholder="Email"
                onChange={(e) => handleInput(e)}
                required
              />
            </Label>
            <Label>
              Password
              <Input
                name="password"
                aria-label="Password"
                type="password"
                placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                onChange={(e) => handleInput(e)}
                required
              />
            </Label>
            <Button type="submit">Login</Button>
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
