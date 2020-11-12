import styled from 'styled-components'

interface ButtonProps {
  loading?: boolean
  margin?: string
  secondary?: boolean
  width?: any
  type?: string
}

const Button: React.FunctionComponent<ButtonProps> = (props) => {
  const { loading, ...otherProps } = props
  return <ButtonWrapper {...otherProps}>{loading ? 'Loading' : props.children}</ButtonWrapper>
}

const ButtonWrapper = styled.button`
  height: 36px;
  padding: 0 12px;
  font-size: 1rem;
  margin: ${(props) => props.margin || `0`};
  letter-spacing: 5%;
  text-decoration: none;
  border-radius: ${(props) => props.theme.borderRadius};
  background-color: ${(props) =>
    props.secondary ? props.theme.grey['300'] : props.theme.primary['500']};
  border: none;
  cursor: pointer;
  width: ${(props) => props.theme.width};
  border: 2px solid transparent;
  outline: none;

  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) =>
      props.secondary ? props.theme.grey['200'] : props.theme.primary['400']};
  }

  &:active {
    background-color: ${(props) =>
      props.secondary ? props.theme.grey['400'] : props.theme.primary['600']};
  }

  &:disabled {
    background-color: ${(props) => props.theme.grey['300']};
    cursor: not-allowed;
  }

  &:focus-visible {
    outline-offset: 1px;
    outline: -webkit-focus-ring-color auto 1px;
  }
`

const TextButton = styled.button`
  height: ${(props) => (props.large ? '48px' : '40px')};
  font-size: ${(props) => (props.large ? '1.2rem' : '1rem')};
  color: ${(props) => props.theme.primary['500']};
  margin: ${(props) => props.margin || `0`};
  letter-spacing: 0.04em;
  text-decoration: none;
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;

  &:hover {
    color: ${(props) => props.theme.primary['600']};
  }

  &:active {
    color: ${(props) => props.theme.primary['400']};
  }

  &:focus-visible {
    outline-offset: 1px;
    outline: -webkit-focus-ring-color auto 1px;
  }
`

// const DangerButton = styled(Button)`
//   background-color: ${(props) => props.theme.error['100']};
//   color: ${(props) => props.theme.error['600']};

//   &:hover {
//     background-color: ${(props) => props.theme.error['300']};
//     color: ${(props) => props.theme.error['600']};
//   }

//   &:active {
//     background-color: ${(props) => props.theme.error['400']};
//   }

//   &:focus {
//     border: 2px solid ${(props) => props.theme.error['600']};
//     outline: none;
//   }
// `

export { TextButton, Button }
