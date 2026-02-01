import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext'
import { CURRENCY } from '../constants'
import styles from './EntriesStep.module.css'

function generateId() {
  return 'e-' + Math.random().toString(36).slice(2, 11)
}

export function EntriesStep() {
  const { candidates, entries, setEntries } = useSession()
  const navigate = useNavigate()
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState(candidates[0]?.id ?? '')
  const [splitAmong, setSplitAmong] = useState(new Set(candidates.map((c) => c.id)))

  useEffect(() => {
    if (candidates.length < 2) {
      navigate('/', { replace: true })
      return
    }
    setPaidBy((prev) => (candidates.some((c) => c.id === prev) ? prev : candidates[0]?.id ?? ''))
    setSplitAmong(new Set(candidates.map((c) => c.id)))
  }, [candidates, navigate])

  const toggleSplit = (id) => {
    const next = new Set(splitAmong)
    if (next.has(id)) {
      if (next.size === 1) return
      next.delete(id)
    } else next.add(id)
    setSplitAmong(next)
  }

  const addEntry = () => {
    const desc = description.trim()
    const amt = parseFloat(amount)
    if (!desc || isNaN(amt) || amt <= 0 || splitAmong.size === 0) return
    setEntries([
      ...entries,
      {
        id: generateId(),
        description: desc,
        amount: amt,
        paidBy,
        splitAmong: [...splitAmong],
      },
    ])
    setDescription('')
    setAmount('')
    setPaidBy(candidates[0]?.id ?? '')
    setSplitAmong(new Set(candidates.map((c) => c.id)))
  }

  const removeEntry = (id) => {
    setEntries(entries.filter((e) => e.id !== id))
  }

  const getCandidate = (id) => candidates.find((c) => c.id === id)

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Session expenses</h1>
      <p className={styles.subtitle}>Add each expense and who paid / who it&apos;s split between.</p>

      <ul className={styles.list}>
        {entries.map((e) => {
          const payer = getCandidate(e.paidBy)
          const share = e.amount / (e.splitAmong?.length || 1)
          return (
            <li key={e.id} className={styles.card}>
              <div className={styles.cardMain}>
                <span className={styles.desc}>{e.description}</span>
                <span className={styles.amount}>{CURRENCY}{Number(e.amount).toFixed(2)}</span>
              </div>
              <div className={styles.cardMeta}>
                Paid by {payer?.name ?? '?'} · split {e.splitAmong?.length ?? 0} ways ({CURRENCY}{share.toFixed(2)} each)
              </div>
              <button
                type="button"
                className={styles.remove}
                onClick={() => removeEntry(e.id)}
                aria-label="Remove entry"
              >
                ×
              </button>
            </li>
          )
        })}
      </ul>

      <div className={styles.addForm}>
        <input
          type="text"
          placeholder="What was it? (e.g. Dinner)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.input}
        />
        <div className={styles.row}>
          <input
            type="number"
            placeholder="Amount"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={styles.inputAmount}
          />
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className={styles.select}
          >
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>{c.name} paid</option>
            ))}
          </select>
        </div>
        <div className={styles.splitSection}>
          <span className={styles.splitLabel}>Split between:</span>
          <div className={styles.splitChips}>
            {candidates.map((c) => (
              <label key={c.id} className={styles.chip}>
                <input
                  type="checkbox"
                  checked={splitAmong.has(c.id)}
                  onChange={() => toggleSplit(c.id)}
                />
                <img src={c.avatarUrl} alt="" className={styles.chipAvatar} />
                <span>{c.name}</span>
              </label>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={addEntry}
          className={styles.addBtn}
          disabled={!description.trim() || !amount || parseFloat(amount) <= 0 || splitAmong.size === 0}
        >
          Add expense
        </button>
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={() => navigate('/')} className={styles.backBtn}>
          Back
        </button>
        <button type="button" onClick={() => navigate('/report')} className={styles.reportBtn}>
          See report
        </button>
      </div>
    </div>
  )
}
