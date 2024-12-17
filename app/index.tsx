import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import Auth from "@/components/Auth";
import Main from "@/components/Main";
import { ScrollView, View } from "react-native";
import { Session } from "@supabase/supabase-js";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <ScrollView>
      {session && session.user ? (
        <Main email={session?.user.email || "Sign In"} />
      ) : (
        <Auth />
      )}
    </ScrollView>
  );
}
