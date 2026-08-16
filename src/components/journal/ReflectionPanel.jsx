import React, { useState } from 'react'
import { useJournalStore } from '../../store/useJournalStore'
import { extractTextFromCanvasData } from '../../utils/canvasText'
import { formatChecklistForReflection } from '../../utils/checklist'
import { Sparkles, Heart, Compass, AlertCircle, Bookmark } from 'lucide-react'

const MAX_TEXT_LENGTH = 10000
const REQUEST_TIMEOUT_MS = 25000

export default function ReflectionPanel() {
  const currentPage = useJournalStore((state) => state.pages.find((p) => p.id === state.currentPageId))
  const reflection = currentPage?.reflection ?? null
  const isReflecting = useJournalStore((state) => state.isReflecting)
  const setIsReflecting = useJournalStore((state) => state.setIsReflecting)
  const setReflection = useJournalStore((state) => state.setReflection)
  const [reflectionError, setReflectionError] = useState(null)

  const handleReflect = async () => {
    const notesText = (currentPage?.notesText || '').trim()
    const canvasText = extractTextFromCanvasData(currentPage?.canvasData)
    const checklistText = formatChecklistForReflection(currentPage?.checklist)
    const combinedText = [notesText, canvasText, checklistText].filter(Boolean).join('\n\n').trim()

    if (!combinedText) {
      setReflectionError("Write a little about how you're feeling before reflecting.")
      return
    }
    if (combinedText.length > MAX_TEXT_LENGTH) {
      setReflectionError(`Your entry is a bit long for reflection right now (max ${MAX_TEXT_LENGTH} characters).`)
      return
    }

    setReflectionError(null)
    setIsReflecting(true)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
      const response = await fetch('/api/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: combinedText }),
        signal: controller.signal,
      })
      const payload = await response.json().catch(() => null)

      if (!response.ok || !payload) {
        throw new Error(payload?.error || 'Something went wrong generating your reflection.')
      }

      setReflection(payload)
    } catch (err) {
      const message =
        err.name === 'AbortError'
          ? 'The reflection is taking longer than expected. Please try again.'
          : err.message || 'Something went wrong. Please try again.'
      setReflectionError(message)
      setIsReflecting(false)
    } finally {
      clearTimeout(timeoutId)
    }
  }

  return (
    <div
      style={{
        background: '#F1E4D9',
        border: '1px solid rgba(215, 155, 149, 0.3)',
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
          <Sparkles size={18} color="#984343" />
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              margin: 0,
              fontSize: '18px',
              color: '#984343',
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
              : '#984343',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '24px',
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: isReflecting ? 'wait' : 'pointer',
            boxShadow: '0 4px 12px rgba(152, 67, 67, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {isReflecting ? 'Reflecting...' : 'Reflect ✦'}
        </button>
      </div>

      {reflectionError && (
        <div
          style={{
            marginBottom: '14px',
            padding: '10px 14px',
            background: '#FDF2F2',
            border: '1px solid #F3D6D6',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
          }}
        >
          <AlertCircle size={15} color="#B3413D" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span style={{ fontSize: '12.5px', color: '#7A2E2B', lineHeight: '1.5' }}>{reflectionError}</span>
        </div>
      )}

      {!reflection && !isReflecting && !reflectionError && (
        <p style={{ fontSize: '13px', color: '#8a6a5f', lineHeight: '1.6', margin: 0 }}>
          When you feel ready, press <b>Reflect ✦</b>. TrueNorth will offer a calm, non-judgmental
          mirror to help process your thoughts without giving unsolicited advice or diagnoses.
        </p>
      )}

      {isReflecting && (
        <div style={{ textAlign: 'center', padding: '20px 0', color: '#984343', fontSize: '14px' }}>
          <span>Reading gently with care... ✨</span>
        </div>
      )}

      {reflection && !isReflecting && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
          <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '14px', border: '1px solid rgba(215, 155, 149, 0.25)' }}>
            <p style={{ margin: 0, color: '#4A2E28', fontSize: '14px', lineHeight: '1.6' }}>
              {reflection.summary}
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {reflection.emotions.map((emotion, idx) => (
              <span
                key={idx}
                style={{
                  background: '#F7D7CD',
                  color: '#8a6a5f',
                  fontSize: '12px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                }}
              >
                #{emotion}
              </span>
            ))}
          </div>

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
              color: '#5f8b90',
            }}
          >
            <Heart size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
            <span>{reflection.gentleReflection}</span>
          </div>

          {reflection.patternObservation && (
            <div
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                background: '#EAF2F4',
                border: '1px solid #D6E6EA',
                padding: '12px 14px',
                borderRadius: '12px',
                fontSize: '13px',
                color: '#3E5A61',
              }}
            >
              <Bookmark size={15} style={{ marginTop: '2px', flexShrink: 0 }} />
              <span style={{ fontStyle: 'italic' }}>{reflection.patternObservation}</span>
            </div>
          )}

          {reflection.questions?.length > 0 && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#8a6a5f',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                }}
              >
                <Compass size={13} /> Questions to sit with
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {reflection.questions.map((q, idx) => (
                  <li key={idx} style={{ fontSize: '13px', color: '#4A423C', lineHeight: '1.5' }}>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ background: '#FDF6F0', border: '1px solid #F0E3D5', padding: '12px 14px', borderRadius: '12px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#984343',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '6px',
              }}
            >
              Recovery & self-care
            </div>
            <span style={{ fontSize: '13px', color: '#4A423C', lineHeight: '1.5' }}>{reflection.recoverySuggestion}</span>
          </div>

          {reflection.redFlags?.length > 0 && (
            <div
              style={{
                background: '#FFF8F0',
                border: '1px solid #F0DFC8',
                padding: '12px 14px',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#9A6B2E',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                <AlertCircle size={13} /> Gentle things to notice
              </div>
              {reflection.redFlags.map((flag, idx) => (
                <div key={idx} style={{ fontSize: '13px', color: '#4A423C', lineHeight: '1.5' }}>
                  <div>{flag.observation}</div>
                  <div style={{ fontSize: '12px', color: '#8a6a5f', marginTop: '2px' }}>{flag.reason}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
