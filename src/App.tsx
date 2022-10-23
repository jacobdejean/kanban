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

const UPDATE_BOARD = gql`
  mutation UpdateBoard($id: UUID!, $newBoard: String!) {
    updateProfileCollection(filter: { id: { eq: $id } }, set: { board: $newBoard }) {
      affectedCount
      records {
        board
      }
    }
  }
`;

export default function App() {
  const [demo, setDemo] = useState(false);
  const session = useUserSession();
  const [updateBoardResult, updateBoard] = useMutation(UPDATE_BOARD);
  const supabase = useSupabaseClient();

  const [getBoardQuery] = useQuery({
    query: GET_BOARD,
    variables: { id: session?.user.id },
    pause: !session,
  });

  const boardResponse =
    getBoardQuery.data?.profilesCollection?.edges?.[0].node.board ??
    `{ "id": "${yeast()}", "name": "BOARD", "stages": [] }`;
  //const [boards, pushBoard] = usePushableState<BoardProps>(session ? JSON.parse(boardsResponse).active : [], { deepCopy: true })
  const board = !session ? { id: yeast(), name: 'BOARD', stages: [] } : JSON.parse(boardResponse);

  //console.log(boards)

  useEffect(() => {
    createProfile().then((res) => console.log(res));
  }, []);

  async function createProfile() {
    return await supabase.from('profiles').insert([
      {
        id: session?.user.id,
        board: {
          id: yeast(),
          name: 'New Board',
          stages: [
            {
              name: 'BACKLOG',
              tasks: [],
              id: 'OG3We1j',
            },
            {
              title: 'Logo',
              description: 'Make various logos',
              tags: ['DESIGN'],
              id: 'OG3We1j.0',
            },
            {
              name: 'PROG',
              tasks: [
                {
                  title: 'Schemas',
                  description: 'Designed needed schemas',
                  tags: ['BACKEND'],
                  id: 'OG3We1j.3',
                },
              ],
              id: 'OG3We1j.2',
            },
            {
              name: 'DONE',
              tasks: [
                {
                  title: 'Hero Graphic',
                  description: "Finish graphic for hero section's background",
                  tags: ['DESIGN'],
                  id: 'OG3We1j.1',
                },
              ],
              id: 'OG3We1j.4',
            },
          ],
        },
      },
    ]);
  }

  if (!session) return <Auth onSkip={() => setDemo(true)} />;

  return (
    <Globals>
      <Board
        key={board.id}
        id={board.id}
        name={board.name}
        stages={board.stages}
        onUpdate={updateBoard}
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
