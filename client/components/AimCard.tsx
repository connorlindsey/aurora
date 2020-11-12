import Link from 'next/link'
import React, { useState } from 'react'
import { FiMoreVertical } from 'react-icons/fi'
import styled from 'styled-components'
import Menu from './Menu'

interface AimCardProps {
  aim: any // TODO: Make an Aim type
}

const AimCard: React.FunctionComponent<AimCardProps> = ({ aim }) => {
  const [isComplete, setIsComplete] = useState(false)
  const toggleCompletion = () => {
    setIsComplete(!isComplete)
  }

  return (
    <AimCardWrapper>
      <label htmlFor={aim.id}>
        <input id={aim.id} type="checkbox" checked={isComplete} onChange={toggleCompletion} />
      </label>
      <Link href={`/aim/${aim.name}`}>
        <a>
          <h2>{aim.name}</h2>
        </a>
      </Link>
      <Menu trigger={<FiMoreVertical />}>
        <button className="menu-btn">Edit</button>
        <button className="menu-btn">Delete</button>
      </Menu>
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

  label {
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
