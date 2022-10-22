import { usePushableState } from '../interactivity'
import styled from 'styled-components'
import Task from './Task'

export interface BoardProps {
    stages: Stage[]
}

export interface Stage {
    title: string,
    tasks: string[]
}

const fetchTasks = async () => {

}

export default function Board(props: BoardProps) {
    const [stages, pushStage] = usePushableState<Stage>(props.stages)
    

    return (
        <Wrapper>
            { stages.map(stage => 
            <Stage>
                <h2>{stage.title}</h2>
                <TaskHolder>
                    { stage.tasks.map(task => <Task />)}
                </TaskHolder>
            </Stage>)}
            <AddStage>+</AddStage>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 100%;
    height: 100%;

    display: flex;
    color: white;

    h2 {
        letter-spacing: 1px;
        margin: 0;
    }
`

const Stage = styled.div`
    border: solid 1px #7604F1;
    border-right: none;
    flex: 1 1 auto;
    padding: 0.5rem;
`

const AddStage = styled.div`
    width: 4rem;
    border: solid 1px #7604F1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;

    &:hover {
        background-color: black;
    }
`

const TaskHolder = styled.div`
    background-color: white;
`