import { useState, useEffect } from 'react'
import Auth from './components/Auth.js'
import { gql, useMutation, useQuery } from 'urql'
import styled from 'styled-components'
import Task from './components/Task.js'
import Board from './components/Board.js'
import UserProvider, { useUserSession } from './components/UserProvider.js'

const GET_BOARDS = gql`
  query GetBoards($id: UUID!) {
    profilesCollection(filter: { id: { eq: $id}}) {
      edges {
        node {
          boards
        }
      }
    }
  }
` 

const CREATE_PROFILE = gql`
  mutation CreateProfile($id: UUID!) {
    insert_profiles(objects: [{ id: $id }]) {
      returning {
        boards
      }
    }
  }
`

// assigns board ID to profile with given id
const ASSIGN_BOARD = gql`
  mutation ($profileId: UUID!, $boardId: UUID!) {
    update_profiles(where: { id: {_eq: $profileId}}, _set: {boards: [$boardId]}) {
      affected_rows
      returning {
        id
        boards
      }
    }
  }
`

export default function App() {
  const [demo, setDemo] = useState(false)
  const session = useUserSession()

  const [getBoardsQuery] = useQuery({
    query: GET_BOARDS,
    variables: { id: session?.user.id },
    pause: !session
  })

  if(!session)
    return <Auth onSkip={() => setDemo(true)}/>
  
  console.log(`Get Boards Query (on ${session?.user.id}): `, getBoardsQuery.data?.profilesCollection?.edges?.[0].node.boards)

  let stages = [
    {title: 'BACKLOG', tasks: ['id', 'id']},
    {title: 'PROG', tasks: ['id', 'id']},
    {title: 'DONE', tasks: ['id', 'id']}
  ]

  

  return (
    <Globals>
      <Board stages={stages}/>
    </Globals>
  )
}

const Globals = styled.div`
  @font-face {
    font-family: 'Prompt';
    src: url('/fonts/Prompt-Bold.ttf');
    font-weight: 700;
  }

  @font-face {
    font-family: 'Prompt';
    src: url('/fonts/Prompt-Medium.ttf');
    font-style: normal;
    font-weight: 500;
  }

  font-family: 'Prompt';

  height: 100vh;
  width: 100vw;
  overflow: none;
  background-color: #242038;

  a {
    color: #7604F1;
  }
`

