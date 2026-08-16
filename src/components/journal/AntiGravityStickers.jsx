import React, { useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'
import { Sparkles, RefreshCw, Plus } from 'lucide-react'

// Pinterest-inspired Cute Kawaii Emotes
export const CUTEST_KAWAII_STICKERS = [
  { id: 'ribbon_bow', emoji: '🎀', bg: '#FFE3EA', border: '#FFB6C1' },
  { id: 'sparkle_heart', emoji: '💖', bg: '#FFF0F5', border: '#FFC0CB' },
  { id: 'boba_tea', emoji: '🧋', bg: '#FFF5F0', border: '#FCD7C7' },
  { id: 'soft_bunny', emoji: '🐰', bg: '#FFF0F5', border: '#FFD6E8' },
  { id: 'sweet_strawberry', emoji: '🍓', bg: '#FFEBEB', border: '#FFC4C4' },
  { id: 'cozy_matcha', emoji: '🍵', bg: '#EAF4EE', border: '#B7E4C7' },
  { id: 'polaroid_memory', emoji: '📸', bg: '#FAF6F0', border: '#E2D9CF' },
  { id: 'coastal_shell', emoji: '🐚', bg: '#FDF6F0', border: '#F4C7B8' },
  { id: 'blush_rose', emoji: '🌹', bg: '#FFEBEB', border: '#F8B4B4' },
  { id: 'cloud_dream', emoji: '☁️', bg: '#F0F8FF', border: '#B0C4DE' },
  { id: 'boundary_gem', emoji: '💎', bg: '#F0F7FF', border: '#BEE3F8' },
  { id: 'self_clarity', emoji: '🔮', bg: '#F3E8FF', border: '#E9D8FD' },
  { id: 'green_flag', emoji: '🟢', bg: '#E6FFFA', border: '#B2F5EA' },
  { id: 'gentle_notice', emoji: '🚩', bg: '#FFF5F5', border: '#FED7D7' },
  { id: 'star_sparkle', emoji: '✨', bg: '#FEFCBF', border: '#F6E05E' },
]

export default function FloatingSanctuary() {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  const [stickersState, setStickersState] = useState([])
  const engineRef = useRef(null)
  const bodiesRef = useRef([])

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return

    const { Engine, Bodies, Composite, Mouse, MouseConstraint, Runner, Body } = Matter

    const width = containerRef.current.clientWidth || 720
    const height = 440

    // 1. Create Engine with Zero Gravity
    const engine = Engine.create()
    engine.world.gravity.x = 0
    engine.world.gravity.y = 0
    engineRef.current = engine

    // 2. Invisible Boundary Walls
    const wallOptions = { isStatic: true }
    const walls = [
      Bodies.rectangle(width / 2, -20, width * 2, 40, wallOptions),
      Bodies.rectangle(width / 2, height + 20, width * 2, 40, wallOptions),
      Bodies.rectangle(-20, height / 2, 40, height * 2, wallOptions),
      Bodies.rectangle(width + 20, height / 2, 40, height * 2, wallOptions),
    ]
    Composite.add(engine.world, walls)

    // 3. Spawn Initial Floating Sticker Physics Bodies
    const initialList = CUTEST_KAWAII_STICKERS.slice(0, 8)
    const newBodies = []
    const newStickersState = []

    initialList.forEach((item, i) => {
      const radius = 34
      const x = 100 + (i % 4) * 150 + Math.random() * 20
      const y = 80 + Math.floor(i / 4) * 150 + Math.random() * 20

      const body = Bodies.circle(x, y, radius, {
        restitution: 0.9,
        frictionAir: 0.008,
      })

      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 3,
        y: (Math.random() - 0.5) * 3,
      })

      newBodies.push({ body, item, id: `sticker-${i}-${Date.now()}` })
      newStickersState.push({
        id: `sticker-${i}-${Date.now()}`,
        item,
        x: body.position.x,
        y: body.position.y,
        angle: body.angle,
      })

      Composite.add(engine.world, body)
    })

    bodiesRef.current = newBodies
    setStickersState(newStickersState)

    // 4. Mouse constraint for dragging and tossing
    const mouse = Mouse.create(containerRef.current)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    })
    Composite.add(engine.world, mouseConstraint)

    const runner = Runner.create()
    Runner.run(runner, engine)

    // 5. Physics Tick Loop: Sync Matter.js positions to React DOM state
    let animId
    const updatePositions = () => {
      const updated = bodiesRef.current.map(({ body, item, id }) => ({
        id,
        item,
        x: body.position.x,
        y: body.position.y,
        angle: body.angle,
      }))
      setStickersState(updated)
      animId = requestAnimationFrame(updatePositions)
    }
    animId = requestAnimationFrame(updatePositions)

    return () => {
      cancelAnimationFrame(animId)
      Runner.stop(runner)
      Composite.clear(engine.world, false)
      Engine.clear(engine)
    }
  }, [])

  const addSticker = () => {
    if (!engineRef.current || !containerRef.current) return
    const { Bodies, Composite, Body } = Matter

    const width = containerRef.current.clientWidth || 720
    const height = 440
    const randomItem =
      CUTEST_KAWAII_STICKERS[Math.floor(Math.random() * CUTEST_KAWAII_STICKERS.length)]

    const radius = 34
    const body = Bodies.circle(width / 2, height / 2, radius, {
      restitution: 0.92,
      frictionAir: 0.008,
    })

    Body.setVelocity(body, {
      x: (Math.random() - 0.5) * 4,
      y: (Math.random() - 0.5) * 4,
    })

    const newId = `sticker-${Date.now()}`
    bodiesRef.current.push({ body, item: randomItem, id: newId })
    Composite.add(engineRef.current.world, body)
  }

  const impulsePush = () => {
    if (!engineRef.current) return
    const { Body } = Matter
    bodiesRef.current.forEach(({ body }) => {
      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 5,
        y: (Math.random() - 0.5) * 5,
      })
    })
  }

  return (
    <div
      style={{
        background: '#FFFDF9',
        borderRadius: '24px',
        border: '1px solid #EBE3D7',
        boxShadow: '0 12px 40px rgba(0,0,0,0.05)',
        padding: '20px',
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
          paddingBottom: '10px',
          borderBottom: '1px dashed #E2D9CF',
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
            Floating Sanctuary 🌌
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={addSticker}
            style={{
              background: '#F4ECE1',
              border: '1px solid #E5DCD1',
              borderRadius: '16px',
              padding: '6px 14px',
              fontSize: '12px',
              color: '#8A5844',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 500,
            }}
          >
            <Plus size={14} /> Add Cute Emote
          </button>

          <button
            onClick={impulsePush}
            style={{
              background: '#FAF7F2',
              border: '1px solid #EDE6DD',
              borderRadius: '16px',
              padding: '6px 14px',
              fontSize: '12px',
              color: '#6B5E55',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <RefreshCw size={14} /> Float Push
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        style={{
          position: 'relative',
          borderRadius: '18px',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #FAF6F0 0%, #FFFBF5 100%)',
          border: '1px dashed #E5DCD1',
          height: '440px',
        }}
      >
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {stickersState.map((s) => (
          <div
            key={s.id}
            style={{
              position: 'absolute',
              left: `${s.x - 34}px`,
              top: `${s.y - 34}px`,
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: s.item.bg,
              border: `2px solid ${s.item.border}`,
              boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `rotate(${s.angle}rad)`,
              cursor: 'grab',
              userSelect: 'none',
              transition: 'transform 0.05s linear',
            }}
          >
            <span style={{ fontSize: '32px', lineHeight: 1 }}>{s.item.emoji}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#8A7B70',
        }}
      >
        <span>✨ Grab, toss, and float clean emotes around your sanctuary</span>
        <span>{stickersState.length} emotes floating</span>
      </div>
    </div>
  )
}
