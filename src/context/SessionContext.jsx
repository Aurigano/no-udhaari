import { createContext, useContext, useState } from 'react'

const SessionContext = createContext(null)

export function SessionProvider({ children }) {
  const [candidates, setCandidates] = useState([])
  const [entries, setEntries] = useState([])

  const resetSession = () => {
    setCandidates([])
    setEntries([])
  }

  return (
    <SessionContext.Provider
      value={{
        candidates,
        setCandidates,
        entries,
        setEntries,
        resetSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}
