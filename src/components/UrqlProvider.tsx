import { SupabaseClient } from "@supabase/supabase-js"
import { useState } from "react";
import { createClient, Provider } from "urql";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "../public.env"
import { useSupabaseClient } from "./SupabaseProvider";

export default function UrqlProvider(props: { children: React.ReactNode }) {
    const supabaseClient = useSupabaseClient();

    const [client] = useState(() => {
        return createClient({
            url: `${SUPABASE_URL}/graphql/v1`,
            fetchOptions: {
                headers: {
                    apiKey: SUPABASE_ANON_KEY,
                    authorization: `Bearer ${SUPABASE_ANON_KEY}`
                }
            }
        })
    })

    return <Provider value={client}>{props.children}</Provider>
}