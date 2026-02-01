import { useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext'
import { CURRENCY } from '../constants'
import { computeSettlement } from '../utils/settlement'
import styles from './ReportStep.module.css'

export function ReportStep() {
  const { candidates, entries, resetSession } = useSession()
  const navigate = useNavigate()

  useEffect(() => {
    if (candidates.length < 2) navigate('/', { replace: true })
  }, [candidates.length, navigate])
  const { nets, transfers, idToPerson } = useMemo(
    () => computeSettlement(candidates, entries),
    [candidates, entries]
  )

  const allSettled = transfers.length === 0

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Settlement report</h1>
      <p className={styles.subtitle}>
        {allSettled ? 'Everyone is square.' : 'Who should pay whom to settle up.'}
      </p>

      {!allSettled && (
        <ul className={styles.transfers}>
          {transfers.map((t, i) => (
            <li key={i} className={styles.transfer}>
              <div className={styles.from}>
                <img
                  src={idToPerson[t.fromId]?.avatarUrl}
                  alt=""
                  className={styles.avatar}
                />
                <span>{t.fromName}</span>
              </div>
              <span className={styles.arrow}>→</span>
              <span className={styles.amount}>
                {CURRENCY}{t.amount.toFixed(2)}
              </span>
              <span className={styles.arrow}>→</span>
              <div className={styles.to}>
                <img
                  src={idToPerson[t.toId]?.avatarUrl}
                  alt=""
                  className={styles.avatar}
                />
                <span>{t.toName}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {allSettled && (
        <div className={styles.settled}>
          <p>No one owes anyone. All expenses are already balanced.</p>
        </div>
      )}

      <div className={styles.balances}>
        <h2 className={styles.balancesTitle}>Net balance (for reference)</h2>
        <ul className={styles.balanceList}>
          {candidates.map((c) => {
            const net = nets[c.id] ?? 0
            const isZero = Math.abs(net) < 0.01
            return (
              <li key={c.id} className={styles.balanceRow}>
                <img src={c.avatarUrl} alt="" className={styles.avatar} />
                <span className={styles.balanceName}>{c.name}</span>
                <span
                  className={
                    isZero
                      ? styles.balanceZero
                      : net > 0
                        ? styles.balancePositive
                        : styles.balanceNegative
                  }
                >
                  {isZero ? '—' : net > 0 ? `+${CURRENCY}${net.toFixed(2)}` : `−${CURRENCY}${Math.abs(net).toFixed(2)}`}
                </span>
              </li>
            )
          })}
        </ul>
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={() => navigate('/expenses')} className={styles.backBtn}>
          Back to entries
        </button>
        <button
          type="button"
          onClick={() => {
            resetSession()
            navigate('/')
          }}
          className={styles.startOverBtn}
        >
          Start over
        </button>
      </div>
    </div>
  )
}
