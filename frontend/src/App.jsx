import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import {Dashboard} from '@uppy/react'
import Uppy from '@uppy/core'
import Tus from '@uppy/tus'

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

const supabase = createClient(
  'http://127.0.0.1:54331',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
)

const endpoint = 'http://127.0.0.1:3000/drawings/upload'
const partner_name = 'ESS Modular'

function App() {
  const [session, setSession] = useState(null)
  const [uppy, setUppy] = useState(() => new Uppy().use(Tus, {
    endpoint,
    headers: {
      'authorization': `Bearer ${session?.access_token}`,
      partner_name
    },
  }));

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUppy(new Uppy().use(Tus, {
        endpoint,
        headers: {
          'authorization': `Bearer ${session?.access_token}`,
          partner_name
        }
      }))
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUppy(new Uppy().use(Tus, {
        endpoint,
        headers: {
          'authorization': `Bearer ${session?.access_token}`,
          partner_name
        }
      }))
    })

    return () =>
      subscription.unsubscribe()
  }, [])

  if (!session) {
    return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]}/>)
  }
  else {
  return (
    <>
      <div style={{display: 'flex', justifyContent: 'end', padding: '10px'}}>
        <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
      </div>
      <Dashboard
        uppy={uppy}
        width='100vw'
        height='calc(100vh - 50px)'
        proudlyDisplayPoweredByUppy={false}
      />
    </>
  )
  }
}

export default App
