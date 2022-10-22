import { usePushableState } from '../interactivity'
import styled from 'styled-components'
import Task, { TaskProps } from './Task'
import { REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js'

export interface BoardProps {
    id: string,
    name: string,
    stages: Stage[]
}  

export interface Stage {
    name: string,
    tasks: TaskProps[]
}

interface StageProps {
    width: string
}

const fetchTasks = async () => {

}

export default function Board(props: BoardProps) {
    const [stages, pushStage] = usePushableState<Stage>(props.stages)

    return (
        <Wrapper>
            { stages.map(stage => 
            <Stage width={`calc(100vw / ${stages.length})`}>
                <h2>{stage.name}</h2>
                <TaskHolder>
                    { stage.tasks.map(task => <Task title={task.title} description={task.description} tags={task.tags}/>)}
                </TaskHolder>
            </Stage>)}
            <AddStage onClick={_ => pushStage({name: 'NEW STAGE', tasks: []}) }>+</AddStage>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 100%;
    min-height: 100%;

    display: flex;
    color: white;

    h2 {
        letter-spacing: 1px;
        margin: 0;
    }
`

const Stage = styled.div<StageProps>`
    border: solid 1px #7604F1;
    border-right: none;
    flex: 1 1 auto;
    padding: 0.5rem;
    max-width: ${props => props.width};
`

const AddStage = styled.div`
    width: 4rem;
    border: solid 1px #7604F1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    margin-right: 1rem;

    &:hover {
        background-color: black;
    }
`

const TaskHolder = styled.div`
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
`