import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { FiMoreVertical } from 'react-icons/fi'
import styled from 'styled-components'
import { deleteAim, editAim } from '../services/AimService'
import { STATUS } from '../types/common'
import { Button } from './Button'
import { Form, Input } from './Form'
import Menu from './Menu'
import Modal from './Modal'

interface AimCardProps {
  aim: any // TODO: Make an Aim type
}

const AimCard: React.FunctionComponent<AimCardProps> = ({ aim: initialAim }) => {
  const [aim, setAim] = useState(initialAim)
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [status, setStatus] = useState<STATUS>(STATUS.DEFAULT)
  const [error, setError] = useState({ key: '', message: '' })
  const [formValues, setFormValues] = useState({
    name: aim.name,
  })
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    setError({ key: '', message: '' })
    setFormValues({
      ...formValues,
      [e.currentTarget.name]: e.currentTarget.value,
    })
  }

  const handleDelete = async () => {
    try {
      const res = await deleteAim(aim.id)
      if (res.status === 'Success') {
        // TODO: Better handle this to prevent having to refresh
        if (router.pathname === '/dashboard') {
          router.reload() // Reload dashboard to fetch aims again
        } else {
          router.back() // Go back from newly deleted aim detail page
        }
      } else {
        throw new Error(res.message)
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message)
      }
    }
  }

  const handleEdit = async (e: Event) => {
    e.preventDefault()
    if (!formValues.name) return

    setStatus(STATUS.LOADING)
    try {
      const res = await editAim(formValues.name, aim.id)
      if (res.status === 'Success') {
        setStatus(STATUS.SUCCESS)
        setAim({
          ...aim,
          name: formValues.name,
        })
        setIsModalOpen(false)
      } else {
        throw new Error(res.message)
      }
    } catch (e) {
      if (e instanceof Error) {
        // TODO: Remove the error when the modal is closed
        setError({ key: 'FORM', message: e.message })
      }
      setStatus(STATUS.ERROR)
    }
  }

  const [isComplete, setIsComplete] = useState(false)
  const toggleCompletion = () => {
    setIsComplete(!isComplete)
  }

  return (
    <AimCardWrapper>
      <label htmlFor={aim.id} className="cardLabel">
        <input id={aim.id} type="checkbox" checked={isComplete} onChange={toggleCompletion} />
      </label>
      <Link href={`/aim/${aim.id}`}>
        <a>
          <h2>{aim.name}</h2>
        </a>
      </Link>
      <Menu trigger={<FiMoreVertical />}>
        <button className="menu-btn" onClick={() => setIsModalOpen(!isModalOpen)}>
          Edit
        </button>
        <button className="menu-btn" onClick={handleDelete}>
          Delete
        </button>
      </Menu>
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <Form
          onSubmit={handleEdit}
          padding=".5rem 0 0"
          maxWidth="420px"
          errorKey="FORM"
          error={error}
        >
          <h2 style={{ textAlign: 'center' }}>Edit Aim</h2>
          <fieldset disabled={status === STATUS.LOADING}>
            <Input
              name="name"
              aria-label="Name"
              label="Name"
              value={formValues.name}
              onChange={(e) => handleInput(e)}
              required
            />
            <Button type="submit" loading={status === STATUS.LOADING}>
              Save Changes
            </Button>
          </fieldset>
        </Form>
      </Modal>
    </AimCardWrapper>
  )
}

export default AimCard

const AimCardWrapper = styled.div`
  border-radius: ${(props) => props.theme.borderRadius};
  background-color: ${(props) => props.theme.grey['800']};
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${(props) => props.theme.elevation2};
  margin-bottom: 1.5rem;
  height: 52px;

  &:hover {
    box-shadow: ${(props) => props.theme.elevation3};
  }

  label.cardLabel {
    align-self: stretch;
    border-top-left-radius: ${(props) => props.theme.borderRadius};
    border-bottom-left-radius: ${(props) => props.theme.borderRadius};
    width: 60px;
    background-color: ${(props) => props.theme.grey['700']};
    display: grid;
    place-items: center;
  }

  input[type='checkbox'] {
    height: 1.3rem;
    width: 1.3rem;
    color: green;
  }

  a {
    line-height: 52px;
    width: 100%;
  }

  h2 {
    user-select: none;
    font-size: 1.4rem;
    font-weight: 400;
    margin: 0 1rem;
  }

  svg {
    height: 40px;
    width: 40px;
    padding: 8px;
    margin: 0 8px;
    border-radius: 50px;
    transition: ${(props) => props.theme.transition};
    cursor: pointer;

    &:hover {
      background-color: ${(props) => props.theme.grey['700']};
    }
  }
`

// Entire label
// const AimCardWrapper = styled.div`
//   border-radius: ${(props) => props.theme.borderRadius};
//   background-color: ${(props) => props.theme.grey['800']};
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   box-shadow: ${(props) => props.theme.elevation3};
//   margin-bottom: 1.5rem;

//   label {
//     display: flex;
//     align-items: center;
//     justify-content: flex-start;
//     cursor: pointer;
//     width: 100%;
//   }

//   h2 {
//     user-select: none;
//     font-size: 24px;
//     font-weight: 400;
//     margin-left: 8px;
//   }

//   svg {
//     height: 40px;
//     width: 40px;
//     padding: 8px;
//     margin-right: 8px;
//     border-radius: 50px;

//     &:hover {
//       background-color: ${(props) => props.theme.grey['600']};
//     }
//   }
// `
