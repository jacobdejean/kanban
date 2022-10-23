import React, { useState } from 'react'
import styled from 'styled-components'
import { AuthError, Session } from '@supabase/supabase-js'
import { useSupabaseClient } from './SupabaseProvider'
import yeast from 'yeast'

export interface AuthProps {
    onSkip: () => void
}

export default function Auth(props: AuthProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({ faulted: false, message: '' })
    const [email, setEmail] = useState('')
    const supabase = useSupabaseClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { data, error } = await supabase.auth.signInWithOtp({
            email: email
        })
        setError({ faulted: true, message: error!.message })
    }

    return (
        <Wrapper>
            <Container>
                <Form onSubmit={handleLogin}>
                    <Label htmlFor={'email'}>LOGIN</Label>
                    <Input
                        name={'email'}
                        type={'email'}
                        placeholder={'email@domain.com'}
                        value={email}
                        onChange={e => setEmail(e.target.value)} />
                    <Send>SEND LINK</Send>
                    <p>Go <a>here</a> for demo</p>
                </Form>
                <Error>{error.message}</Error>
            </Container>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;
`

const Container = styled.div`
    width: 15rem;
    border: solid 1px #7604F1;
    padding: 0.5rem;
    background-color: white;

`

const Label = styled.label`
    font-size: 1.5rem;
    letter-spacing: 1px;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;

    p {
        margin: 0;
        text-align: center;
    }
`

const Input = styled.input`
    font-size: 1rem;
    border-radius: 2px;
    border: none;
    background-color: #F9EAE1;
    padding: 0.5rem;
    font-family: 'Prompt';
    outline: solid 0px #7604F1;
    transition: outline 0.125s ease;

    &:focus-visible {
        outline: solid 2px #7604F1;
    }

    &::selection {
        background-color: #7604F1;
        color: #F9EAE1;
    }
`

const Send = styled.button`
    background-color: #7604F1;
    color: white;
    border: none;
    padding: 9px 15px 9px 15px;
    letter-spacing: 1px;
    font-family: 'Prompt';
    margin-bottom: 1rem;
`

const Error = styled.p`
    color: red;

`