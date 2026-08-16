import React, { useState } from 'react'
import { Lock, Heart, ShieldCheck, Sparkles, Send, Trash2, CheckCircle2 } from 'lucide-react'

export default function UnsentVentBox() {
  const [ventText, setVentText] = useState('')
  const [isSealed, setIsSealed] = useState(false)
  const [reflection, setReflection] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSealAndReflect = () => {
    if (!ventText.trim()) return
    setIsProcessing(true)
    setIsSealed(true)

    // Simulate gentle wellness reflection with safety guardrails
    setTimeout(() => {
      setReflection({
        summary:
          "Expressing these raw thoughts here keeps your peace intact. You are holding your boundaries with dignity instead of acting out of immediate anxious urgency.",
        validation:
          "It is completely natural to want reassurance, but taking this breather gives you clarity.",
        gentleAffirmation: "Your worth isn't determined by a fast reply. You are in control.",
      })
      setIsProcessing(false)
    }, 1000)
  }

  const handleReset = () => {
    setVentText('')
    setIsSealed(false)
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px',
          paddingBottom: '12px',
          borderBottom: '1px dashed #E2D9CF',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              background: '#FFE3EA',
              width: '36px',
              height: '36px',
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
              The Unsent Text Vent Vault 💌
            </h3>
            <span style={{ fontSize: '12px', color: '#8A7B70' }}>
              Type out the text you want to send but shouldn't (yet). 100% private &amp; local.
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
          <ShieldCheck size={14} /> Never Sent Anywhere
        </div>
      </div>

      {!isSealed ? (
        <div>
          <textarea
            value={ventText}
            onChange={(e) => setVentText(e.target.value)}
            placeholder="Type your unsent message here freely... Say everything on your mind without worrying about how it sounds."
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
              ✨ Sealing this text holds your boundaries &amp; protects your emotional peace.
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
              <Lock size={15} /> Seal &amp; Hold Vault 🔒
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
                  Text Sealed Safely in Local Vault 🔒
                </div>
                <div style={{ fontSize: '12px', color: '#8A5844', marginTop: '2px' }}>
                  You got it out of your system without texting him impulsively.
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#8A7B70',
                cursor: 'pointer',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Trash2 size={15} /> Clear Vault
            </button>
          </div>

          {isProcessing ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#D9486B', fontSize: '13px' }}>
              <span>Generating gentle reflection... ✨</span>
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
