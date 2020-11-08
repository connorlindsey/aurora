import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

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

  return (
    <Wrapper>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && <Dropdown ref={menuRef}>{children}</Dropdown>}
    </Wrapper>
  )
}

export default Menu

const Wrapper = styled.div`
  position: relative;
`

const Dropdown = styled.div`
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
`
