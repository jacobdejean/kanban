import styled from 'styled-components'

export interface TaskProps {
    title: string,
    description: string,
    tags: string[]
}

export default function Task(props: TaskProps) {

    return (
        <Tag color={'green'}>{props.title}</Tag>
    )
}

const Tag = styled.div`
    color: white;
    background-color: ${props => props.color};
`