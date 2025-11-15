'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { setSupabaseClient } from '../Checklist-Dashboard/SupabaseClient'
import { Provider } from 'react-redux'
import store from '../Checklist-Dashboard/redux/store'
import { BrowserRouter } from 'react-router-dom'

declare global {
  interface Window {
    __CHECKLIST_SUPABASE__?: ReturnType<typeof createClient>
  }
}

// Load the legacy checklist dashboard (with Redux + REST integrations) only on the client.
const ChecklistDashboardApp = dynamic(
  () => import('../Checklist-Dashboard/Dashboard'),
  { ssr: false }
)

export default function ChecklistDashboard() {
  const [supabaseReady, setSupabaseReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    const loadSupabase = async () => {
      const cachedClient =
        typeof window !== 'undefined' ? window.__CHECKLIST_SUPABASE__ : undefined

      if (cachedClient) {
        setSupabaseClient(cachedClient)
        setSupabaseReady(true)
        return
      }

      try {
        const res = await fetch('/api/env/supabase')
        if (!res.ok) {
          console.error('Failed to load Supabase config')
          return
        }
        const { url, key } = await res.json()
        if (!url || !key) {
          console.error('Supabase env vars are missing.')
          return
        }
        if (cancelled) return

        let client =
          typeof window !== 'undefined' ? window.__CHECKLIST_SUPABASE__ : undefined

        if (!client) {
          client = createClient(url, key, {
            realtime: { params: { eventsPerSecond: 10 } },
          })

          if (typeof window !== 'undefined') {
            window.__CHECKLIST_SUPABASE__ = client
          }
        }

        setSupabaseClient(client)
        setSupabaseReady(true)
      } catch (error) {
        console.error('Unable to initialize Supabase', error)
      }
    }

    loadSupabase()

    return () => {
      cancelled = true
    }
  }, [])

  if (!supabaseReady) {
    return null
  }

  return (
    <Provider store={store}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ChecklistDashboardApp />
      </BrowserRouter>
    </Provider>
  )
}
