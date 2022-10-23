
import styled, {css} from 'styled-components'
import Search from './Search'
import { useSupabaseClient } from './SupabaseProvider'
import { useUserSession } from './UserProvider'

export interface ToolbarProps {
    onFilter: (filter: { search: string, contextId: string }) => void
}

export default function Toolbar(props: ToolbarProps) {
    const session = useUserSession()
    const supabase = useSupabaseClient()

    return (
        <Wrapper>
            <h2>{session?.user.email?.toUpperCase()}'S KANBAN</h2>
            <Search placeholder={'SEARCH'} whiteBackground={false} onFilter={props.onFilter} contextId={'none'}/>
            <Logout onClick={_ => supabase.auth.signOut()}>LOG OUT</Logout>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 100%;
    height: 3rem;
    color: white;
    display: flex;
    column-gap: 1.5rem;
    align-items: center;

    h2 {
        letter-spacing: 1px;
        margin: 0;
    }
`

const Logout = styled.button`
    border-radius: 0;
    border: none;
    background: none;
    color: white;
    font-family: 'Prompt';
    font-size: 1rem;
    text-align: right;
    margin-right: 1rem;
    flex: 1 1 auto;
    cursor: pointer;
`