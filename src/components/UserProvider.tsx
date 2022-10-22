import { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { useSupabaseClient } from "./SupabaseProvider";

const UserSessionContext = createContext<Session | null>(null);

export default function UserProvider(props: { children: React.ReactNode }) {
    const [session, setSession] = useState(null);
    const supabase = useSupabaseClient()

    useEffect(() => {
        // @ts-ignore
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
        // @ts-ignore
        supabase.auth.onAuthStateChange((e, session) => setSession(session))
      }, [])

    return (
       <UserSessionContext.Provider value={session}>
            {props.children}
       </UserSessionContext.Provider> 
    )
}

export function useUserSession() {
    return useContext(UserSessionContext)
}