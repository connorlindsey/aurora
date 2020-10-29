import styled from 'styled-components'

const Form = styled.form`
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

const Label = styled.label`
  width: 100%;
  margin: 0 auto 1rem;
  text-align: left;
  font-size: 1rem;
`

const Input = styled.input`
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

  :focus {
    border: 2px solid ${(props) => props.theme.grey['600']};
  }

  &::placeholder {
    font-size: 1rem;
    color: ${(props) => props.theme.grey['300']};
  }
`

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
