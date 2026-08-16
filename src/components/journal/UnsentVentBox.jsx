import React, { useState } from 'react'
import { Lock, Heart, ShieldCheck, Sparkles, Key, CheckCircle2, Trash2, Eye } from 'lucide-react'

export default function UnsentVentBox() {
  const [ventText, setVentText] = useState('')
  const [isSealed, setIsSealed] = useState(false)
  const [showPeek, setShowPeek] = useState(false)
  const [reflection, setReflection] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSealAndReflect = () => {
    if (!ventText.trim()) return
    setIsProcessing(true)
    setIsSealed(true)
    setShowPeek(false)

    // Simulate gentle wellness reflection with safety guardrails
    setTimeout(() => {
      setReflection({
        summary:
          "Expressing these raw thoughts here keeps your peace intact. You are holding your boundaries with dignity instead of acting out of immediate anxious urgency.",
        gentleAffirmation: "Your worth isn't determined by a fast reply. You are in control.",
      })
      setIsProcessing(false)
    }, 1000)
  }

  const handleReset = () => {
    setVentText('')
    setIsSealed(false)
    setShowPeek(false)
    setReflection(null)
  }

  return (
    <div
      style={{
        background: '#FFFDF9',
        border: '1px solid #EBE3D7',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.04)',
        maxWidth: '760px',
        width: '100%',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px dashed #E2D9CF',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              background: '#FFE3EA',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Lock size={18} color="#D9486B" />
          </div>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", margin: 0, fontSize: '18px', color: '#2C3E35' }}>
              The Unsent Text Vent Vault 🔒
            </h3>
            <span style={{ fontSize: '12px', color: '#8A7B70' }}>
              Store the text you shouldn't send in your private treasure chest.
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            color: '#2C5741',
            background: '#EAF4EE',
            padding: '4px 10px',
            borderRadius: '12px',
          }}
        >
          <ShieldCheck size={14} /> 100% Private &amp; Local
        </div>
      </div>

      {/* Interactive Treasure Chest Showcase */}
      <div
        style={{
          background: 'linear-gradient(180deg, #FAF4ED 0%, #FFFDF9 100%)',
          border: '1px solid #EDE3D7',
          borderRadius: '20px',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ fontSize: '64px', lineHeight: 1, filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.1))' }}>
          {!isSealed ? '🧰' : '🔐'}
        </div>

        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            color: '#2C3E35',
            fontSize: '16px',
            marginTop: '8px',
          }}
        >
          {!isSealed ? 'Your Treasure Vault is Open ✨' : 'Treasure Chest Locked & Sealed 🔒'}
        </div>

        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#8A7B70' }}>
          {!isSealed
            ? 'Write down your unsent thoughts below and lock them away safely.'
            : 'Your message is safely stored inside the chest. You avoided sending an impulsive text!'}
        </p>
      </div>

      {!isSealed ? (
        <div>
          <textarea
            value={ventText}
            onChange={(e) => setVentText(e.target.value)}
            placeholder="Type your unsent message freely... Say everything on your mind without worrying about how it sounds."
            rows={4}
            style={{
              width: '100%',
              border: '1px solid #EBE3D7',
              borderRadius: '16px',
              padding: '14px 16px',
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '15px',
              lineHeight: '1.6',
              color: '#3A423D',
              background: '#FAF6F0',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '14px',
            }}
          >
            <span style={{ fontSize: '12px', color: '#8A7B70', fontStyle: 'italic' }}>
              ✨ Sealing this text holds your boundaries &amp; protects your peace.
            </span>

            <button
              onClick={handleSealAndReflect}
              disabled={!ventText.trim()}
              style={{
                background: ventText.trim()
                  ? 'linear-gradient(135deg, #D9486B 0%, #B93838 100%)'
                  : '#E2D9CF',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '24px',
                padding: '10px 22px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: ventText.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: ventText.trim() ? '0 4px 14px rgba(217, 72, 107, 0.3)' : 'none',
              }}
            >
              <Key size={15} /> Lock in Treasure Chest 🔒
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              background: '#FFF5F7',
              border: '1px solid #FFD6E8',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={20} color="#D9486B" />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#D9486B' }}>
                  Unsent Text Sealed in Treasure Chest 🧰✨
                </div>
                <div style={{ fontSize: '12px', color: '#8A5844', marginTop: '2px' }}>
                  Safely locked in local memory. You held your peace!
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowPeek(!showPeek)}
                style={{
                  background: '#F4ECE1',
                  border: '1px solid #E2D9CF',
                  borderRadius: '12px',
                  padding: '6px 12px',
                  color: '#8A5844',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 500,
                }}
              >
                <Eye size={14} /> {showPeek ? 'Hide Text' : 'Peek Inside 🗝️'}
              </button>

              <button
                onClick={handleReset}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#8A7B70',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Trash2 size={14} /> Clear
              </button>
            </div>
          </div>

          {showPeek && (
            <div
              style={{
                background: '#FFFBF5',
                border: '1px dashed #E2D9CF',
                borderRadius: '14px',
                padding: '14px 16px',
                fontFamily: "'Playfair Display', serif",
                fontSize: '14px',
                color: '#3A423D',
                fontStyle: 'italic',
                lineHeight: '1.6',
              }}
            >
              "{ventText}"
            </div>
          )}

          {isProcessing ? (
            <div style={{ textAlign: 'center', padding: '16px', color: '#D9486B', fontSize: '13px' }}>
              <span>Locking chest &amp; generating gentle validation... ✨</span>
            </div>
          ) : (
            reflection && (
              <div
                style={{
                  background: '#FAF6F0',
                  border: '1px solid #EBE3D7',
                  borderRadius: '16px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2C3E35', fontWeight: 600, fontSize: '14px' }}>
                  <Sparkles size={16} color="#C4715A" /> Gentle Boundary Validation
                </div>

                <p style={{ margin: 0, fontSize: '14px', color: '#3A423D', lineHeight: '1.6' }}>
                  {reflection.summary}
                </p>

                <div
                  style={{
                    background: '#EAF4EE',
                    border: '1px solid #B7E4C7',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    color: '#2C5741',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Heart size={15} color="#2C5741" />
                  <span>{reflection.gentleAffirmation}</span>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
