import React, { useState, useEffect } from 'react'
import { playAmbientSound, stopAmbientSound } from '../../utils/audioSoundscape'
import { Volume2, VolumeX, Waves, CloudRain, Coffee, Music, ExternalLink, ShieldCheck } from 'lucide-react'

const SOUNDS = [
  { id: 'none', label: 'Off', icon: VolumeX },
  { id: 'ocean', label: 'Ocean Waves 🌊', icon: Waves },
  { id: 'rain', label: 'Soft Rain 🌧️', icon: CloudRain },
  { id: 'cafe', label: 'Cozy Cafe ☕', icon: Coffee },
]

export const SPOTIFY_PLAYLISTS = [
  {
    name: 'Peaceful Piano 🎹',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO',
    desc: 'Soft, calming piano melodies for deep relaxation',
    color: '#E8C5C8',
  },
  {
    name: 'Lofi Chill Beats 🎧',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DX8UebfMyUZLW',
    desc: 'Gentle, soothing lofi rhythms for reflection',
    color: '#C5D8CD',
  },
  {
    name: 'Deep Focus 🌊',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ',
    desc: 'Calming ambient soundscapes & atmospheric music',
    color: '#BEE3F8',
  },
  {
    name: 'Acoustic Calm 🎸',
    url: 'https://open.spotify.com/playlist/37i9dQZF1DX0SM0LYsmbMT',
    desc: 'Quiet acoustic strings and warm ambient tunes',
    color: '#E9D8FD',
  },
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
          background: 'linear-gradient(135deg, #1DB954 0%, #179B45 100%)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '20px',
          padding: '6px 14px',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 4px 12px rgba(29, 185, 84, 0.25)',
        }}
      >
        <Music size={14} /> Spotify Calm 🎧
      </button>

      {/* Spotify Playlist Selection Popover */}
      {showSpotifyModal && (
        <div
          style={{
            position: 'absolute',
            top: '44px',
            right: '0',
            zIndex: 60,
            background: '#FFFDF9',
            border: '1px solid #E2D9CF',
            borderRadius: '20px',
            padding: '16px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
            width: '320px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Music size={16} color="#1DB954" />
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#2C3E35' }}>Spotify Calming Playlists</span>
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
            <ShieldCheck size={14} /> Opens directly in Spotify — 100% private
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {SPOTIFY_PLAYLISTS.map((pl) => (
              <a
                key={pl.name}
                href={pl.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  borderRadius: '14px',
                  background: '#FAF7F2',
                  border: '1px solid #EBE3D7',
                  textDecoration: 'none',
                  color: '#2C3E35',
                  transition: 'all 0.15s ease',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#2C3E35' }}>{pl.name}</div>
                  <div style={{ fontSize: '11px', color: '#8A7B70', marginTop: '2px' }}>{pl.desc}</div>
                </div>
                <ExternalLink size={14} color="#1DB954" style={{ flexShrink: 0, marginLeft: '8px' }} />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
