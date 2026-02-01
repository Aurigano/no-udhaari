import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext'
import { AVATARS } from '../constants'
import styles from './CandidatesStep.module.css'

function generateId() {
  return 'c-' + Math.random().toString(36).slice(2, 11)
}

export function CandidatesStep() {
  const { candidates, setCandidates } = useSession()
  const navigate = useNavigate()
  const [newName, setNewName] = useState('')
  const [newAvatarId, setNewAvatarId] = useState(AVATARS[0].id)

  const usedAvatarIds = new Set(candidates.map((c) => c.avatarId))
  const availableAvatars = AVATARS.filter((a) => !usedAvatarIds.has(a.id))
  const currentPickerAvatars = availableAvatars.length ? availableAvatars : AVATARS

  const addCandidate = () => {
    const name = newName.trim()
    if (!name) return
    const avatar = AVATARS.find((a) => a.id === newAvatarId) || AVATARS[0]
    setCandidates([
      ...candidates,
      { id: generateId(), name, avatarId: avatar.id, avatarUrl: avatar.url },
    ])
    setNewName('')
    setNewAvatarId(currentPickerAvatars[0]?.id ?? AVATARS[0].id)
  }

  const removeCandidate = (id) => {
    setCandidates(candidates.filter((c) => c.id !== id))
  }

  const canNext = candidates.length >= 2

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Who&apos;s in?</h1>
      <p className={styles.subtitle}>Add at least two people to split expenses.</p>

      <ul className={styles.list}>
        {candidates.map((c) => (
          <li key={c.id} className={styles.card}>
            <img src={c.avatarUrl} alt="" className={styles.avatar} />
            <span className={styles.name}>{c.name}</span>
            <button
              type="button"
              className={styles.remove}
              onClick={() => removeCandidate(c.id)}
              aria-label={`Remove ${c.name}`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.addForm}>
        <div className={styles.avatarPicker}>
          {currentPickerAvatars.map((a) => (
            <button
              key={a.id}
              type="button"
              className={`${styles.avatarOption} ${newAvatarId === a.id ? styles.selected : ''}`}
              onClick={() => setNewAvatarId(a.id)}
              title={`Avatar ${a.id}`}
            >
              <img src={a.url} alt="" />
            </button>
          ))}
        </div>
        <div className={styles.inputRow}>
          <input
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCandidate()}
            className={styles.input}
          />
          <button type="button" onClick={addCandidate} className={styles.addBtn} disabled={!newName.trim()}>
            Add
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/expenses')}
        className={styles.nextBtn}
        disabled={!canNext}
      >
        Next: Add expenses
      </button>
    </div>
  )
}
