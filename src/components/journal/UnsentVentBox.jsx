import React, { useState } from 'react'
import { Lock, Heart, ShieldCheck, Sparkles, Key, CheckCircle2, Trash2, Eye } from 'lucide-react'

export default function UnsentVentBox() {
  const [ventText, setVentText] = useState('')
  const [eatingState, setEatingState] = useState('idle') // 'idle' | 'eating' | 'eaten'
  const [showPeek, setShowPeek] = useState(false)
  const [reflection, setReflection] = useState(null)

  const handleFeedChest = () => {
    if (!ventText.trim()) return
    setEatingState('eating')

    // Munching / Gulp animation sequence
    setTimeout(() => {
      setEatingState('eaten')
      setReflection({
        summary:
          "Your message has been eaten and stored safely inside the vault. Expressing it here protects your emotional peace without making an impulsive decision.",
        gentleAffirmation: "Your worth isn't determined by a fast reply. You are in control.",
      })
    }, 1400)
  }

  const handleReset = () => {
    setVentText('')
    setEatingState('idle')
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
              The Message-Eating Treasure Vault 🧰
            </h3>
            <span style={{ fontSize: '12px', color: '#8A7B70' }}>
              Feed your unsent message to the treasure box to lock it away safely.
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

      {/* Animated Munching Treasure Chest Stage */}
      <div
        style={{
          background: 'linear-gradient(180deg, #FAF4ED 0%, #FFFDF9 100%)',
          border: '1px solid #EDE3D7',
          borderRadius: '20px',
          padding: '24px',
          textAlign: 'center',
          marginBottom: '20px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          style={{
            fontSize: '72px',
            lineHeight: 1,
            transition: 'transform 0.2s ease',
            transform: eatingState === 'eating' ? 'scale(1.2) rotate(-5deg)' : 'scale(1)',
          }}
        >
          {eatingState === 'idle' && '🧰'}
          {eatingState === 'eating' && '😮‍💨📦'}
          {eatingState === 'eaten' && '🔐'}
        </div>

        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            color: '#2C3E35',
            fontSize: '17px',
            marginTop: '10px',
          }}
        >
          {eatingState === 'idle' && 'The Treasure Box is Hungry for Unsent Texts 😋'}
          {eatingState === 'eating' && 'Nom Nom Nom... Gulping Your Message! ✨'}
          {eatingState === 'eaten' && 'Gulp! Message Safely Locked Inside Belly 🔒'}
        </div>

        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#8A7B70' }}>
          {eatingState === 'idle' && 'Write down the message you shouldn’t send and feed it to the chest.'}
          {eatingState === 'eating' && 'Swallowing your text scroll and locking the padlock...'}
          {eatingState === 'eaten' && 'Your text is safely digested into local memory. You held your peace!'}
        </p>
      </div>

      {eatingState === 'idle' && (
        <div>
          <textarea
            value={ventText}
            onChange={(e) => setVentText(e.target.value)}
            placeholder="Type your unsent message freely... Say everything on your mind before feeding it to the chest."
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
              ✨ Feeding this to the box holds your boundaries &amp; protects your peace.
            </span>

            <button
              onClick={handleFeedChest}
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
              <Key size={15} /> Feed to Treasure Chest 😋🔒
            </button>
          </div>
        </div>
      )}

      {eatingState === 'eating' && (
        <div style={{ textAlign: 'center', padding: '24px 0', color: '#D9486B', fontSize: '15px', fontWeight: 600 }}>
          <span>*Nom nom nom* 📜 ➔ 🧰 Gulping your text scroll...</span>
        </div>
      )}

      {eatingState === 'eaten' && (
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
                  Unsent Text Eaten &amp; Locked in Local Vault 🧰😋
                </div>
                <div style={{ fontSize: '12px', color: '#8A5844', marginTop: '2px' }}>
                  Safely swallowed into local memory. You held your peace!
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
                <Eye size={14} /> {showPeek ? 'Close Belly' : 'Peek Inside Belly 🗝️'}
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
                <Trash2 size={14} /> Clear Vault
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

          {reflection && (
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
          )}
        </div>
      )}
    </div>
  )
}
