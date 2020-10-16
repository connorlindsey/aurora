
import Head from 'next/head'
import Link from "next/link"
import { useEffect, useState} from 'react'
import styled from "styled-components";

const nouns = ['aims', 'tasks', 'initiatives', 'goals', 'habits', 'time', 'challenges', 'targets']

export default function Home() {
	const [keyword, setKeyword]	= useState("aims")
	
	useEffect(() => { 
		const interval = setInterval(() => { 
			let num = Math.floor(Math.random() * nouns.length) 
			setKeyword(nouns[num])}, 2500) 

		return () => clearInterval(interval)
	}, [])

	return (
		<Layout>
			<Main>
				<Headline>12month</Headline>
				<Tagline>A tool for tracking life's most important <KeyWord>{keyword}</KeyWord>.</Tagline>
				<ScreenShotContainer>
					<img style={{maxHeight: '400px'}} src="/assets/mockups.png" alt="images of mockups"></img>
				</ScreenShotContainer>
				<SignupContainer>
					<h2>Early Access</h2>	
					<p style={{textAlign: 'justify'}}>Our app is currently in development and we could really use your help. Sign up below and we'll reach out to your with <u>updates</u>, <u>questions</u>, and <u>requests for feedback.</u></p>	
					<Input placeholder="name"></Input>
					<Input placeholder="email"></Input>
					<Submit type="submit">Submit</Submit>
				</SignupContainer>    
			</Main>
		</Layout>
  )
}

const ScreenShotContainer = styled.div`
	width: 50%;
	border-radius: 3px;
	text-align: center;
	 
	@media (max-width: 768px) {
		width: 80%;
	}
	
`
const Submit = styled.button`
	background-color: #5CD670;
	padding: .5rem 1rem;
	border-radius: 3px;
	border: none;
	margin: 1rem;
		
	&:hover {
		background-color:#2D3139;
		border: solid 1px #5CD670; 
		color: #5CD670;
	}

`
const Input = styled.input`
	background: transparent;
	border: solid .5px white;
	border-radius: 3px;
	color: white;
	padding: .5rem;
	margin: 1.25rem .5rem;
`
const Headline = styled.h1`
	font-size: 2rem;
	color: white;
`
const Tagline = styled.h2`
	text-align: center;
	margin: 2rem 5rem;
`

const KeyWord = styled.span`
	color: #5CD670;
	text-decoration: underline;
`
const Layout = styled.div`
	display: flex;
	justify-content: center;
    align-items: center;	
	background-color: #1E2128;
	min-height: 100vh;
	width: 100vw;
	overflow-x:hidden;
	color: white;
`
const Main = styled.main`
	display:flex;
	align-items:center;
	flex-direction: column;
`
const SignupContainer = styled.div`
	width: 50%;
	min-height: 400px;
	border-radius: 3px;
	box-shadow: 0 3px 6px -2px #000;
  	
	background-color: #2D3139;
	text-align: center;
	margin: 2rem;
	padding: 4rem;
	 
	@media (max-width: 768px) {
		width: 80%;
	}
`