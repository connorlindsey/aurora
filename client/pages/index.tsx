import Head from 'next/head'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Button } from '../components/Button'

const nouns = ['aims', 'tasks', 'initiatives', 'goals', 'habits', 'time', 'challenges', 'targets']

export default function Home() {
  const [keyword, setKeyword] = useState('aims')

  useEffect(() => {
    const interval = setInterval(() => {
      let num = Math.floor(Math.random() * nouns.length)
      setKeyword(nouns[num])
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  const [formStatus, setFormStatus] = useState('DEFAULT')
  const [formValues, setFormValues] = useState({
    email: '',
    name: '',
  })

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    })
  }

  // Remove error or success message after 3 seconds
  useEffect(() => {
    if (formStatus === 'LOADING' || formStatus === 'DEFAULT') {
      return
    }

    const interval = setInterval(() => {
      setFormStatus('DEFAULT')
    }, 3000)

    return () => clearInterval(interval)
  }, [formStatus])

  const earlyAccessSignup = async (e: Event) => {
    e.preventDefault()
    setFormStatus('LOADING')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/earlyaccess`, {
        method: 'post',
        body: JSON.stringify(formValues),
      })
      const data = await res.json()
      if (data.status === 'Success') {
        setFormValues({
          email: '',
          name: '',
        })
        setFormStatus('SUCCESS')
      } else {
        console.error(data.message)
        setFormStatus('ERROR')
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message)
      }
      setFormStatus('ERROR')
    }
  }

  return (
    <Layout>
      <Head>
        <title>twelvemonth</title>
      </Head>
      <Main>
        <Headline>twelvemonth</Headline>
        <Tagline>
          A tool for tracking life's most important <KeyWord>{keyword}</KeyWord>.
        </Tagline>
        <ScreenShotContainer>
          <img
            style={{ maxHeight: '400px' }}
            src="/assets/mockups.png"
            alt="images of mockups"
          ></img>
        </ScreenShotContainer>
        <SignupContainer>
          <h2>Stay in the loop</h2>
          <p>
            twelvemonth is under development. Sign up for occasional updates and to join the early
            access waitlist.
          </p>
          <Form onSubmit={earlyAccessSignup}>
            <fieldset disabled={formStatus === 'LOADING'}>
              <Label>
                Name
                <Input
                  name="name"
                  placeholder="Name"
                  aria-label="Name"
                  onChange={(e) => handleInput(e)}
                ></Input>
              </Label>
              <Label>
                Email
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  aria-label="Email"
                  required
                  onChange={(e) => handleInput(e)}
                />
              </Label>
              <Button type="submit" width="100%">
                Submit
              </Button>
            </fieldset>
            <div className="message">
              {formStatus === 'SUCCESS'
                ? 'Success! Thanks for supporting twelvemonth'
                : formStatus === 'ERROR'
                ? 'An error ocurred when submitting the form. Please try again later.'
                : null}
            </div>
          </Form>
        </SignupContainer>
      </Main>
    </Layout>
  )
}

const ScreenShotContainer = styled.div`
  width: 50%;
  border-radius: ${(props) => props.theme.borderRadius};
  text-align: center;

  @media (max-width: 768px) {
    width: 80%;
  }
`

const Form = styled.form`
  margin: 0 auto;
  max-width: 500px;

  fieldset {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border: none;
    margin: 0;
    padding: 0;

    & > *:not(:last-child) {
      padding-right: 1rem;
    }

    :disabled {
      opacity: 0.5;
    }

    @media screen and (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
    }
  }
`

const Label = styled.label`
  width: 100%;
  margin: 0 auto 1rem;
  text-align: left;
  font-size: 1rem;
`

const Input = styled.input`
  font-size: 1rem;
  width: ${(props) => props.width || '100%'};
  border: 1px solid ${(props) => props.theme.grey['700']};
  background-color: ${(props) => props.theme.grey['800']};
  border-radius: ${(props) => props.theme.borderRadius};
  height: 36px;
  outline: none;
  margin: 0.25rem 0;
  padding-left: 8px;
  color: #fff;

  &::placeholder {
    font-size: 1rem;
    color: ${(props) => props.theme.grey['400']};
  }
`
const Headline = styled.h1`
  font-size: 2rem;
  color: white;
`
const Tagline = styled.h2`
  text-align: center;
  margin: 2rem;
  max-width: 450px;
`

const KeyWord = styled.span`
  color: #5cd670;
  text-decoration: underline;
`
const Layout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1e2128;
  min-height: 100vh;
  width: 100vw;
  overflow-x: hidden;
  color: white;
`
const Main = styled.main`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 2rem;
  max-width: ${(props) => props.theme.maxWidth};
  width: 100%;
`
const SignupContainer = styled.div`
  border-radius: ${(props) => props.theme.borderRadius};
  box-shadow: 0 3px 6px -2px ${(props) => props.theme.grey['800']};

  background-color: ${(props) => props.theme.grey['800']};
  text-align: center;
  margin: 2rem auto;
  padding: 0rem 2rem 2rem;

  p {
    max-width: 500px;
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    width: 80%;
  }
`
