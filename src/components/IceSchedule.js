'use client'
import { useState } from 'react'

const halls = ['A-hallen', 'Ravemahallen', 'Prolympiahallen', 'D-hallen']
const times = Array.from({ length: (14 * 60) / 10 }, (_, i) => {
  const h = Math.floor(i * 10 / 60) + 6
  const m = (i * 10) % 60
  return ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2)
})

export default function IceSchedule() {
  const [desc, setDesc] = useState(Object.fromEntries(halls.map(h => [h, ''])))
  const [role, setRole] = useState('viewer')

  return (
    <div style={{ padding: '1rem' }}>
      <label>Roll:
        <select value={role} onChange={e => setRole(e.target.value)} style={{ marginLeft: 8 }}>
          <option value="viewer">Läsare</option>
          <option value="admin">Admin</option>
        </select>
      </label>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        {halls.map(hall => (
          <div key={hall} style={{ background: 'white', padding: '0.5rem', borderRadius: 4, flex: 1 }}>
            <h2>{hall}</h2>
            {role === 'admin' ? (
              <textarea
                rows="2"
                value={desc[hall]}
                onChange={e => setDesc({ ...desc, [hall]: e.target.value })}
                placeholder="Beskrivning för skärmvisning"
                style={{ width: '100%', marginBottom: '0.5rem' }}
              />
            ) : desc[hall] && (
              <p><em>{desc[hall]}</em></p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, maxHeight: 400, overflow: 'auto' }}>
              {times.map(t => (
                <div key={t} style={{
                  background: '#cce',
                  padding: '2px 4px',
                  fontSize: '0.8rem',
                  borderRadius: 2
                }}>{t}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}