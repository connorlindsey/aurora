import React, { useEffect, useRef } from 'react'
import { FiX } from 'react-icons/fi'
import styled from 'styled-components'

const Modal = ({ isOpen, setIsOpen, children }) => {
  const ref = useRef<HTMLElement>()

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target) && isOpen) {
      setIsOpen(false)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <>
      <Overlay></Overlay>
      <StyledModal ref={ref}>
        <div>
          <CloseButton onClick={() => setIsOpen(false)} />
          {children}
        </div>
      </StyledModal>
    </>
  )
}

export default Modal

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.grey['900']};
  opacity: 0.5;
  z-index: 5;
`

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 6;
  background-color: #fff;
  width: calc(100vw - 1rem);
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  border-radius: ${(props) => props.theme.borderRadius};
  /* box-shadow: ${(props) => props.theme.elevation3}; */
`

const CloseButton = styled(FiX)`
  position: absolute;
  top: 4px;
  right: 4px;
  height: 32px;
  width: 32px;
  color: ${(props) => props.theme.grey['700']};
  cursor: pointer;
  border-radius: 50%;
  padding: 4px;
  transition: 0.15s ease all;

  &:hover {
    background-color: ${(props) => props.theme.grey['100']};
  }
`
