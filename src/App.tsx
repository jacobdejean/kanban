import { useState, useEffect } from 'react'
import Auth from './components/Auth.js'
import { gql, useMutation, useQuery } from 'urql'
import styled from 'styled-components'
import Task from './components/Task.js'
import Board, { BoardProps, Stage } from './components/Board.js'
import UserProvider, { useUserSession } from './components/UserProvider.js'
import { usePushableState } from './interactivity.js'

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

  const boardsResponse = getBoardsQuery.data?.profilesCollection?.edges?.[0].node.boards ?? '{ "active": [] }'
  //const [boards, pushBoard] = usePushableState<BoardProps>(session ? JSON.parse(boardsResponse).active : [], { deepCopy: true }) 
  const boards = session ? JSON.parse(boardsResponse).active : []
  //console.log(boards)

  if(!session)
    return <Auth onSkip={() => setDemo(true)}/>

  return (
    <Globals>
      { boards.map((board: BoardProps) => <Board id={board.id} name={board.name} stages={board.stages}></Board>) }
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
  height: 100%;

  overflow: none;
  background-color: #242038;

  a {
    color: #7604F1;
  }
`

