import React, { useEffect, useRef, useState } from 'react'
import { FiX } from 'react-icons/fi'
import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'

// TODO: Autofocus and trap focus inside
const Modal = ({ isOpen, setIsOpen, children }) => {
  const ref = useRef<HTMLElement>()

  const portalRef = useRef<HTMLElement>()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    portalRef.current = document.querySelector('#modal')
    setMounted(true)
  }, [])

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

  const template = (transform) => {
    return `scale(${transform.scale}) translate3d(-50%, -50%, 0)`
  }

  return mounted
    ? createPortal(
        <React.Fragment>
          <AnimatePresence>
            {isOpen && (
              <>
                <Overlay
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.9 }}
                  exit={{ opacity: 0 }}
                />
                <StyledModal
                  ref={ref}
                  transformTemplate={template}
                  initial={{
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0,
                  }}
                  style={{
                    originX: 0,
                    originY: 0,
                  }}
                  transform={{ type: 'spring', mass: 0.9 }}
                >
                  <div>
                    <CloseButton onClick={() => setIsOpen(false)} />
                    {children}
                  </div>
                </StyledModal>
              </>
            )}
          </AnimatePresence>
        </React.Fragment>,
        portalRef.current
      )
    : null
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

const StyledModal = styled(motion.div)`
  position: fixed;
  left: 50%;
  top: 30%;
  transform: translate3d(-50%, -50%, 0);
  background-color: ${(props) => props.theme.grey['800']};
  width: calc(100vw - 1rem);
  max-width: 600px;
  padding: 2rem;
  border-radius: ${(props) => props.theme.borderRadius};
  box-shadow: ${(props) => props.theme.elevation4};
  z-index: 6;
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
