import React, { useState, useEffect } from 'react'
import { playAmbientSound, stopAmbientSound } from '../../utils/audioSoundscape'
import { Volume2, VolumeX, Waves, CloudRain, Coffee } from 'lucide-react'

const SOUNDS = [
  { id: 'none', label: 'Off', icon: VolumeX },
  { id: 'ocean', label: 'Ocean Waves 🌊', icon: Waves },
  { id: 'rain', label: 'Soft Rain 🌧️', icon: CloudRain },
  { id: 'cafe', label: 'Cozy Cafe ☕', icon: Coffee },
]

export default function AmbientSoundPlayer() {
  const [activeSound, setActiveSound] = useState('none')
  const [volume, setVolume] = useState(0.3)

  const handleSelectSound = (soundId) => {
    setActiveSound(soundId)
    if (soundId === 'none') {
      stopAmbientSound()
    } else {
      playAmbientSound(soundId, volume)
    }
  }

  useEffect(() => {
    return () => {
      stopAmbientSound()
    }
  }, [])

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: '#FAF7F2',
        border: '1px solid rgba(215, 155, 149, 0.25)',
        borderRadius: '20px',
        padding: '4px 10px',
      }}
    >
      <Volume2 size={14} color="#8a6a5f" />
      <span style={{ fontSize: '12px', color: '#6B5E55', fontWeight: 500 }}>Soundscape:</span>
      <div style={{ display: 'flex', gap: '4px' }}>
        {SOUNDS.map((s) => {
          const isActive = activeSound === s.id
          return (
            <button
              key={s.id}
              onClick={() => handleSelectSound(s.id)}
              style={{
                background: isActive ? '#984343' : 'transparent',
                color: isActive ? '#FFFFFF' : '#8a6a5f',
                border: 'none',
                borderRadius: '12px',
                padding: '6px 8px',
                minHeight: '24px',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {s.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
