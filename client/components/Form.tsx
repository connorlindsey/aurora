import React, { FunctionComponent } from 'react'
import styled from 'styled-components'

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin: ${(props) => props.margin || '0 auto'};
  max-width: ${(props) => props.maxWidth || '600px'};
  padding: ${(props) => props.padding || '1.5rem 0rem'};
  text-align: left;

  fieldset {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-content: center;
    text-align: center;
    border: 0;
    margin: 0;
    padding: 0;
  }
`

const FormError = styled.div`
  font-size: 1.2rem;
  text-align: center;
  margin: 1rem 0 0;
  color: ${(props) => props.theme.error['500']};
`

interface FormProps {
  onSubmit: Function
  errorKey?: string
  error?: {
    key: string
    message: string
  }
  padding?: string
  maxWidth?: string
}

const Form: FunctionComponent<FormProps> = (props) => {
  return (
    <FormWrapper {...props}>
      {props.children}
      {props.errorKey === props.error?.key && <FormError>{props.error?.message} 🙁</FormError>}
    </FormWrapper>
  )
}

const Label = styled.label`
  width: 100%;
  font-size: 1rem;
  display: flex;
  line-height: 1.5rem;

  .error {
    margin-left: 1rem;
    color: ${(props) => props.theme.error['500']};
  }
`

const InputWrapper = styled.input`
  font-size: 1rem;
  width: ${(props) => props.width || '100%'};
  border-radius: ${(props) => props.theme.borderRadius};
  border: 2px solid ${(props) => props.theme.grey['700']};
  height: 2.25rem;
  background: ${(props) => props.theme.grey['700']};
  outline: none;
  margin: 0.5rem 0;
  padding-left: 10px;
  color: ${(props) => props.theme.grey['100']};

  :active {
    border: 2px solid ${(props) => props.theme.grey['600']};
  }

  &:focus-visible {
    outline-offset: 1px;
    outline: -webkit-focus-ring-color auto 1px;
  }

  &::placeholder {
    font-size: 1rem;
    color: ${(props) => props.theme.grey['300']};
  }

  &[type='password']::placeholder {
    font-size: 0.2rem;
    letter-spacing: 0.1rem;
  }
`

const Field = styled.div`
  margin: 0 0 1rem;
`

interface InputProps {
  errorKey?: string
  error?: {
    key: string
    message: string
  }
  label: string
}

const Input: FunctionComponent<InputProps & React.HTMLProps<HTMLInputElement>> = (props) => {
  return (
    <Field>
      <Label>
        <div>{props.label}</div>
        {props.error && props.errorKey === props.error.key && (
          <div className="error">{props.error?.message} 🙁</div>
        )}
      </Label>
      <InputWrapper {...props}>{props.children}</InputWrapper>
    </Field>
  )
}

const Textarea = styled.textarea`
  font-size: 1rem;
  width: 100%;
  border: 1px solid ${(props) => props.theme.grey['300']};
  border-radius: ${(props) => props.theme.borderRadius};
  background: #fff;
  resize: vertical;
  height: 6rem;
  padding: 4px 10px;
  outline: none;

  &::placeholder {
    font-size: 1rem;
    ${(props) => props.theme.grey['700']};
  }
`

export { Form, Input, Textarea, Label }
