import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

// TODO: Make this component keyboard accessible
// Trap focus, close on esc
const Menu = ({ trigger, children }) => {
  const menuRef = useRef<HTMLElement>()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target) && isOpen) {
      setIsOpen(false)
    }
  }

  const a11yClick = (event) => {
    const code = event.charCode || event.keyCode
    if (code === 32 || code === 13) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <Wrapper>
      <div
        className="trigger"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyPress={a11yClick}
      >
        {trigger}
      </div>

      {isOpen && <Dropdown ref={menuRef}>{children}</Dropdown>}
    </Wrapper>
  )
}

export default Menu

const Wrapper = styled.div`
  position: relative;

  .trigger {
    background-color: transparent;
    outline: none;
    border: none;
    margin: 0;
    padding: 0;
    display: grid;
    place-items: center;

    &:focus-visible {
      outline-offset: 1px;
      outline: -webkit-focus-ring-color auto 1px;
    }
  }
`

const Dropdown = styled.div`
  box-shadow: ${(props) => props.theme.elevation4};
  position: absolute;
  top: calc(100% + 0.25rem);
  right: 0;
  z-index: 2;
  background-color: ${(props) => props.theme.grey['800']};
  border-radius: ${(props) => props.theme.borderRadius};
  padding: 0.8rem 1rem;

  display: flex;
  flex-direction: column;
  align-items: flex-end;

  & > * {
    height: 1.5rem;
  }

  .menu-btn {
    cursor: pointer;
    background: none;
    border: none;
    color: #fff;
    font-size: 1.2rem;
    padding: 0;
    outline: none;

    &:focus-visible {
      outline-offset: 1px;
      outline: -webkit-focus-ring-color auto 1px;
    }

    &:hover {
      color: ${(props) => props.theme.grey['400']};
    }
  }
`
