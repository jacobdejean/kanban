import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { useState, createContext, useContext } from 'react'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../public.env'

const SupabaseClientContext = createContext<SupabaseClient | null>(null);

export default function SupabaseProvider(props: { children: React.ReactNode }) {
    const [client] = useState(createClient(SUPABASE_URL, SUPABASE_ANON_KEY))

    return (
        <SupabaseClientContext.Provider value={client}>
            {props.children}
        </SupabaseClientContext.Provider>
    )
}

export function useSupabaseClient(): SupabaseClient {
    const client = useContext(SupabaseClientContext);

    if(!client) 
        throw new Error('No supabase client in provided context')

    return client;
}