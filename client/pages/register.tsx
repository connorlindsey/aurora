import React, { useState, FunctionComponent } from 'react'
import Layout from '../components/Layout'
import { Form, Label, Input } from '../components/Form'
import { Button } from '../components/Button'
import styled from 'styled-components'

enum STATUS {
  DEFAULT,
  LOADING,
  ERROR,
  SUCCESS,
}

const Register: FunctionComponent = () => {
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
    // TODO: Input validation and errors in Label
    setStatus(STATUS.LOADING)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: 'post',
        body: JSON.stringify(formValues),
      })
      const data = await res.json()
      if (data.status === 'Success') {
        setStatus(STATUS.SUCCESS)
        // TODO: Navigate away
        alert('Success signing up')
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
        <h1>Sign Up</h1>
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
            <Button type="submit">Sign Up</Button>
          </fieldset>
        </Form>
      </Card>
    </Layout>
  )
}

export default Register

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
