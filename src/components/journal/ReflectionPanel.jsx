import React from 'react'
import { useJournalStore } from '../../store/useJournalStore'
import { Sparkles, Heart, Shield, AlertCircle } from 'lucide-react'

export default function ReflectionPanel({ journalText }) {
  const reflection = useJournalStore((state) => state.reflection)
  const isReflecting = useJournalStore((state) => state.isReflecting)
  const setIsReflecting = useJournalStore((state) => state.setIsReflecting)
  const setReflection = useJournalStore((state) => state.setReflection)

  const handleReflect = async () => {
    setIsReflecting(true)

    // Simulate gentle AI reflection response with safe boundaries
    setTimeout(() => {
      setReflection({
        summary:
          "It sounds like the silence is creating a heavy silence inside you — leaving you waiting on someone else's timeline rather than standing comfortably in your own standard.",
        feelings: ['unsettled', 'waiting', 'seeking clarity'],
        gentleObservation:
          'You may be noticing that inconsistency leaves you feeling anxious. It is valid to want clear communication in dating.',
        tentativeNotice: null,
      })
    }, 1200)
  }

  return (
    <div
      style={{
        background: '#FAF6F0',
        border: '1px solid #EBE3D7',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#C4715A" />
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              margin: 0,
              fontSize: '18px',
              color: '#2C3E35',
            }}
          >
            Gentle Reflection
          </h3>
        </div>

        <button
          onClick={handleReflect}
          disabled={isReflecting}
          style={{
            background: isReflecting
              ? '#DCD3C7'
              : 'linear-gradient(135deg, #C4715A 0%, #A85843 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '24px',
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: isReflecting ? 'wait' : 'pointer',
            boxShadow: '0 4px 12px rgba(196, 113, 90, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {isReflecting ? 'Reflecting...' : 'Reflect ✦'}
        </button>
      </div>

      {!reflection && !isReflecting && (
        <p style={{ fontSize: '13px', color: '#8A7B70', lineHeight: '1.6', margin: 0 }}>
          When you feel ready, press <b>Reflect ✦</b>. TrueNorth will offer a calm, non-judgmental
          mirror to help process your thoughts without giving unsolicited advice or diagnoses.
        </p>
      )}

      {isReflecting && (
        <div style={{ textAlign: 'center', padding: '20px 0', color: '#A85843', fontSize: '14px' }}>
          <span>Reading gently with care... ✨</span>
        </div>
      )}

      {reflection && !isReflecting && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
          <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '14px', border: '1px solid #F0ECE4' }}>
            <p style={{ margin: 0, color: '#3A423D', fontSize: '14px', lineHeight: '1.6' }}>
              {reflection.summary}
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {reflection.feelings.map((feeling, idx) => (
              <span
                key={idx}
                style={{
                  background: '#F4ECE1',
                  color: '#8A5844',
                  fontSize: '12px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                }}
              >
                #{feeling}
              </span>
            ))}
          </div>

          {reflection.gentleObservation && (
            <div
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                background: '#F6FAF7',
                border: '1px solid #DDF0E5',
                padding: '12px 14px',
                borderRadius: '12px',
                fontSize: '13px',
                color: '#2C5741',
              }}
            >
              <Heart size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
              <span>{reflection.gentleObservation}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
