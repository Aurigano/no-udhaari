import { Routes, Route, Navigate } from 'react-router-dom'
import { SessionProvider } from './context/SessionContext'
import { Layout } from './components/Layout'
import { CandidatesStep } from './components/CandidatesStep'
import { EntriesStep } from './components/EntriesStep'
import { ReportStep } from './components/ReportStep'

export default function App() {
  return (
    <SessionProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<CandidatesStep />} />
          <Route path="people" element={<CandidatesStep />} />
          <Route path="expenses" element={<EntriesStep />} />
          <Route path="report" element={<ReportStep />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </SessionProvider>
  )
}
