import React, { useState, useEffect } from 'react'
import { playAmbientSound, stopAmbientSound } from '../../utils/audioSoundscape'
import { Volume2, VolumeX, Waves, CloudRain, Coffee, Music, ExternalLink, ShieldCheck } from 'lucide-react'

const SOUNDS = [
  { id: 'none', label: 'Off', icon: VolumeX },
  { id: 'ocean', label: 'Ocean Waves 🌊', icon: Waves },
  { id: 'rain', label: 'Soft Rain 🌧️', icon: CloudRain },
  { id: 'cafe', label: 'Cozy Cafe ☕', icon: Coffee },
]

export default function AmbientSoundPlayer() {
  const [activeSound, setActiveSound] = useState('none')
  const [volume, setVolume] = useState(0.3)
  const [showSpotifyModal, setShowSpotifyModal] = useState(false)

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
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#FAF7F2',
          border: '1px solid #EDE6DD',
          borderRadius: '20px',
          padding: '4px 10px',
        }}
      >
        <Volume2 size={14} color="#8A7B70" />
        <span style={{ fontSize: '12px', color: '#6B5E55', fontWeight: 500 }}>Soundscape:</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {SOUNDS.map((s) => {
            const isActive = activeSound === s.id
            return (
              <button
                key={s.id}
                onClick={() => handleSelectSound(s.id)}
                style={{
                  background: isActive ? '#C4715A' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#8A7B70',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '3px 8px',
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

      {/* Spotify Calming Music Button */}
      <button
        onClick={() => setShowSpotifyModal(!showSpotifyModal)}
        style={{
          background: '#1DB954',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '20px',
          padding: '5px 12px',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          boxShadow: '0 2px 8px rgba(29, 185, 84, 0.25)',
        }}
      >
        <Music size={13} /> Spotify Calm 🎧
      </button>

      {/* Privacy-First Spotify Embed Popover */}
      {showSpotifyModal && (
        <div
          style={{
            position: 'absolute',
            top: '42px',
            right: '0',
            zIndex: 60,
            background: '#FFFFFF',
            border: '1px solid #E2D9CF',
            borderRadius: '20px',
            padding: '16px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
            width: '320px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Music size={16} color="#1DB954" />
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#2C3E35' }}>Spotify Calming Player</span>
            </div>
            <button
              onClick={() => setShowSpotifyModal(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A7B70', fontSize: '14px' }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              color: '#2C5741',
              background: '#EAF4EE',
              padding: '6px 10px',
              borderRadius: '10px',
              marginBottom: '12px',
            }}
          >
            <ShieldCheck size={14} /> 100% Private — No Spotify login required
          </div>

          <iframe
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/playlist/37i9dQZF1DX8UebfMyUZLW?utm_source=generator"
            width="100%"
            height="152"
            frameBorder="0"
            allowFullScreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Calm Playlist"
          />

          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <a
              href="https://open.spotify.com/playlist/37i9dQZF1DX8UebfMyUZLW"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '12px',
                color: '#1DB954',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Open in Spotify App <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
