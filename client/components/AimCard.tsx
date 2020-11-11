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
      <label htmlFor="completion">
        <input id="completion" type="checkbox" checked={isComplete} onChange={toggleCompletion} />
        <h2>{aim.name}</h2>
        <div className="spacer"></div>
      </label>
      <Menu trigger={<FiMoreVertical />}>
        <button>Edit</button>
        <button>Delete</button>
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

  label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
  }

  .spacer {
    width: 100%;
  }

  h2 {
    font-size: 24px;
    font-weight: 400;
    margin-left: 8px;
  }

  svg {
    height: 40px;
    width: 40px;
    padding: 8px;
    margin-right: 8px;
    border-radius: 50px;

    &:hover {
      background-color: ${(props) => props.theme.grey['600']};
    }
  }
`
