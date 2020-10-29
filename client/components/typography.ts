import styled from 'styled-components'

const Text = styled.p`
  text-align: ${(props) => props.textAlign};
  margin: ${(props) => props.margin};
  margin-bottom: ${(props) => props.mb};
  max-width: ${(props) => props.maxWidth};
`

const Headline = styled(Text)`
  font-size: 36px;
  font-size: max(34px, min(42px, 3vw));
  font-size: clamp(36px, 3vw, 48px);
  font-weight: 400;
  letter-spacing: 0.05rem;
`

const Subheading = styled(Text)`
  font-size: 28px;
  font-size: max(28px, min(36px, 3vw));
  font-size: clamp(28px, 3vw, 36px);
  font-weight: 600;
`

const Title = styled(Text)`
  font-size: 19px;
  font-size: max(19px, min(22, 3vw));
  font-size: clamp(19px, 3vw, 22px);
  font-weight: 400;
`

const Body = styled(Text)`
  font-size: 17px;
  font-size: max(17px, min(20px, 2.4vw));
  font-size: clamp(17px, 2.4vw, 20px);
  font-weight: 500;
  color: ${(props) => props.theme.grey['800']};
`

const Caption = styled(Text)`
  font-size: 14px;
  font-size: max(12px, min(14px, 3vw));
  font-size: clamp(12px, 3vw, 14px);
  font-weight: 500;
  color: ${(props) => props.theme.grey['800']};
`

export { Headline, Subheading, Title, Body, Caption }
