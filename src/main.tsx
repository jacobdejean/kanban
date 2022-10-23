import React from 'react'
import ReactDOM from 'react-dom/client'
import * as urql from 'urql'
import App from './App'
import SupabaseProvider from './components/SupabaseProvider'
import UrqlProvider from './components/UrqlProvider'
import UserProvider from './components/UserProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SupabaseProvider>
      <UrqlProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </UrqlProvider>
    </SupabaseProvider>
  </React.StrictMode>
)
