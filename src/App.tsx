import { useState, useEffect } from 'react';
import Auth from './components/Auth.js';
import { gql, Mutation, useMutation, useQuery } from 'urql';
import styled from 'styled-components';
import Task from './components/Task.js';
import Board, { BoardProps, Stage } from './components/Board.js';
import UserProvider, { useUserSession } from './components/UserProvider.js';
import { usePushableState } from './interactivity.js';
import yeast from 'yeast';
import { useSupabaseClient } from './components/SupabaseProvider.js';

const GET_BOARD = gql`
  query GetBoard($id: UUID!) {
    profilesCollection(filter: { id: { eq: $id } }) {
      edges {
        node {
          board
        }
      }
    }
  }
`;

export default function App() {
  const [demo, setDemo] = useState(false);
  const session = useUserSession();
  const supabase = useSupabaseClient();

  const [getBoardQuery] = useQuery({
    query: GET_BOARD,
    variables: { id: session?.user.id },
    pause: !session,
  });

  const newProfile = {
    id: session?.user.id,
    board: {
      id: yeast(),
      name: 'New Board',
      allTags: [
        { 
          id: '0',
          value: 'DESIGN',
          color: '#FF8C42'
        },
        { 
          id: '1',
          value: 'BACKEND',
          color: '#CAFE48'
        }
      ],
      stages: [
        {
          name: 'BACKLOG',
          tasks: [
            {
              description: 'Make various logos',
              tags: [{id: '0'}],
              id: 'OG3We1j.0',
            }
          ],
          id: 'OG3We1j',
        },
        {
          name: 'PROG',
          tasks: [
            {
              description: 'Designed needed schemas',
              tags: [{id: '1'}],
              id: 'OG3We1j.3',
            },
          ],
          id: 'OG3We1j.2',
        },
        {
          name: 'DONE',
          tasks: [
            {
              description: "Finish graphic for hero section's background",
              tags: [{id: '0'}],
              id: 'OG3We1j.1',
            },
          ],
          id: 'OG3We1j.4',
        },
      ],
    },
  }

  let boardResponse = `{ "id": "${yeast()}", "name": "BOARD", "stages": [], "allTags": [] }`
    
  try {
    boardResponse = getBoardQuery.data?.profilesCollection?.edges?.[0].node.board;
    if(!boardResponse) throw new Error('error, remaking profile')
  } catch(error) {
    createProfile().then((res) => console.log(res));
    boardResponse = JSON.stringify(newProfile)
  }

  //const [boards, pushBoard] = usePushableState<BoardProps>(session ? JSON.parse(boardsResponse).active : [], { deepCopy: true })
  const json = JSON.parse(boardResponse)
  const board = !session ? { id: yeast(), name: 'BOARD', stages: [] } : json.board ?? json;
  console.log(board)

  async function createProfile() {
    return await supabase.from('profiles').insert([newProfile]);
  }

  if (!session) return <Auth onSkip={() => setDemo(true)} />;

  return (
    <Globals>
      <Board
        key={board.id}
        id={board.id}
        name={board.name}
        stages={board.stages}
        allTags={board.allTags}
      ></Board>
    </Globals>
  );
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
    color: #7604f1;
  }
`;