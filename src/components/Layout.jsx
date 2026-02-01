import { Outlet, useLocation, Link } from 'react-router-dom'
import styles from './Layout.module.css'

const ROUTE_LABELS = {
  '/': '1. People',
  '/people': '1. People',
  '/expenses': '2. Expenses',
  '/report': '3. Report',
}

export function Layout() {
  const location = useLocation()
  const pathname = location.pathname
  const stepBadge = ROUTE_LABELS[pathname] ?? ''

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>No Udhaari</Link>
        {stepBadge && (
          <span className={styles.stepBadge}>{stepBadge}</span>
        )}
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
