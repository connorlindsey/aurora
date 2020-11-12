import React, { useEffect, useRef } from 'react'
import { FiX } from 'react-icons/fi'
import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'

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

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <Overlay
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.75, top: '50%' }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0, top: '50%' }}
              transition={{
                type: 'spring',
                mass: 0.9,
              }}
            >
              <StyledModal ref={ref}>
                <div>
                  <CloseButton onClick={() => setIsOpen(false)} />
                  {children}
                </div>
              </StyledModal>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Modal

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.grey['900']};
  z-index: 5;
`

const StyledModal = styled.div`
  position: fixed;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 6;
  background-color: ${(props) => props.theme.grey['800']};
  width: calc(100vw - 1rem);
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  border-radius: ${(props) => props.theme.borderRadius};
  box-shadow: ${(props) => props.theme.elevation4};
`

const CloseButton = styled(FiX)`
  position: absolute;
  top: 4px;
  right: 4px;
  height: 32px;
  width: 32px;
  color: ${(props) => props.theme.grey['600']};
  cursor: pointer;
  border-radius: 50%;
  padding: 4px;
  transition: 0.15s ease all;

  &:hover {
    background-color: ${(props) => props.theme.grey['700']};
  }
`
