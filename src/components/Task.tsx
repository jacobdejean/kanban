import React, {useState} from 'react'
import styled, {css} from 'styled-components'

export interface TaskProps {
    title: string,
    description: string,
    tags: string[]
}

export interface TaskWrapperProps {
    highlighted: boolean
}

export default function Task(props: TaskProps) {
    const [editMode, setEditMode] = useState(false)

    function completeEdit() {
        setEditMode(false)

        // update user profile here
    }

    return (
        <Wrapper highlighted={editMode} onDoubleClick={_ => setEditMode(true)}>
            <Name contentEditable={editMode} onBlur={_ => completeEdit()}>
                {props.description}
            </Name>
            {props.tags.map(tag => <Tag color={'#CAFE48'}>{tag}</Tag>)}
        </Wrapper>
    )
}

const Wrapper = styled.div<TaskWrapperProps>`
    color: black;
    background-color: white;
    padding: 0.5rem;
    display: flex;
    column-gap: 1rem;
    user-select: none;

    ${props => props.highlighted && css`
        outline: dotted 4px #7604F1;
        outline-offset: -4px;
    `}
`

const Name = styled.div`
    flex: 1 1 auto;
    background: none;

    &:focus-visible {
        outline-color: #CAFE48;
    }
`

const Tag = styled.div`
    background-color: #CAFE48;
    color: black;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 3rem;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
`