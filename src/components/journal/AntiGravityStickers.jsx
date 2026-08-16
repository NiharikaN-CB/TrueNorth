import React, { useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'
import { Sparkles, RefreshCw, Plus, Heart, Smile } from 'lucide-react'

// Pinterest-inspired Cute Kawaii Stickers with SVG icons / Emoji Badges
export const CUTEST_KAWAII_STICKERS = [
  { id: 'ribbon_bow', label: '🎀 Ribbon Bow', emoji: '🎀', bg: '#FFE3EA', color: '#D9486B' },
  { id: 'sparkle_heart', label: '💖 Sparkle Heart', emoji: '💖', bg: '#FFF0F5', color: '#E63956' },
  { id: 'cozy_matcha', label: '🍵 Cozy Matcha', emoji: '🍵', bg: '#EAF4EE', color: '#2C5741' },
  { id: 'polaroid_memory', label: '📸 Polaroid', emoji: '📸', bg: '#FAF6F0', color: '#8A5844' },
  { id: 'coastal_shell', label: '🐚 Coastal Shell', emoji: '🐚', bg: '#FDF6F0', color: '#C4715A' },
  { id: 'rose_flower', label: '🌹 Blush Rose', emoji: '🌹', bg: '#FFEBEB', color: '#B93838' },
  { id: 'cloud_dream', label: '☁️ Cloud Dream', emoji: '☁️', bg: '#F0F8FF', color: '#4682B4' },
  { id: 'boundary_gem', label: '💎 Boundary Gem', emoji: '💎', bg: '#F0F7FF', color: '#2B6CB0' },
  { id: 'night_moon', label: '🌙 Night Moon', emoji: '🌙', bg: '#F3E8FF', color: '#6B46C1' },
  { id: 'green_flag', label: '🟢 Green Flag', emoji: '🟢', bg: '#E6FFFA', color: '#234E52' },
  { id: 'gentle_notice', label: '🚩 Gentle Notice', emoji: '🚩', bg: '#FFF5F5', color: '#9B2C2C' },
  { id: 'star_sparkle', label: '✨ Cosmic Star', emoji: '✨', bg: '#FEFCBF', color: '#975A16' },
]

export default function AntiGravityStickers() {
  const sceneRef = useRef(null)
  const engineRef = useRef(null)
  const renderRef = useRef(null)

  const [activeStickersCount, setActiveStickersCount] = useState(8)

  useEffect(() => {
    if (!sceneRef.current) return

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Body } = Matter

    const width = sceneRef.current.clientWidth || 760
    const height = 440

    // 1. Create Engine with Zero Gravity (Anti-Gravity)
    const engine = Engine.create()
    engine.world.gravity.x = 0
    engine.world.gravity.y = 0
    engineRef.current = engine

    // 2. Create Renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
      },
    })
    renderRef.current = render

    Render.run(render)
    const runner = Runner.create()
    Runner.run(runner, engine)

    // 3. Invisible Boundary Walls
    const wallOptions = { isStatic: true, render: { visible: false } }
    const walls = [
      Bodies.rectangle(width / 2, -15, width * 2, 30, wallOptions), // Top
      Bodies.rectangle(width / 2, height + 15, width * 2, 30, wallOptions), // Bottom
      Bodies.rectangle(-15, height / 2, 30, height * 2, wallOptions), // Left
      Bodies.rectangle(width + 15, height / 2, 30, height * 2, wallOptions), // Right
    ]
    Composite.add(engine.world, walls)

    // 4. Create Floating Anti-Gravity Sticker Bodies using Canvas Custom Rendering
    const spawnStickerBodies = () => {
      const initialSelection = CUTEST_KAWAII_STICKERS.slice(0, 8)
      initialSelection.forEach((sticker, i) => {
        const radius = 34
        const x = 100 + (i % 4) * 160 + (Math.random() - 0.5) * 40
        const y = 80 + Math.floor(i / 4) * 140 + (Math.random() - 0.5) * 40

        const body = Bodies.circle(x, y, radius, {
          restitution: 0.88, // Bouncy bounce
          frictionAir: 0.008, // Smooth floating low air resistance
          render: {
            fillStyle: sticker.bg,
            strokeStyle: sticker.color,
            lineWidth: 2,
          },
        })

        // Store metadata for custom canvas text/emoji rendering
        body.stickerMeta = sticker

        // Give gentle initial drift floating impulse
        Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 2.5,
          y: (Math.random() - 0.5) * 2.5,
        })

        Composite.add(engine.world, body)
      })
    }

    spawnStickerBodies()

    // 5. Custom Render Event to Draw Cute Emojis & Labels on Physics Bodies
    Matter.Events.on(render, 'afterRender', () => {
      const context = render.context
      const bodies = Composite.allBodies(engine.world)

      bodies.forEach((body) => {
        if (body.stickerMeta) {
          const { x, y } = body.position
          const angle = body.angle

          context.save()
          context.translate(x, y)
          context.rotate(angle)

          // Render Emoji Symbol
          context.font = '28px sans-serif'
          context.textAlign = 'center'
          context.textBaseline = 'middle'
          context.fillText(body.stickerMeta.emoji, 0, 0)

          context.restore()
        }
      })
    })

    // 6. Enable Mouse & Touch Dragging and Tossing
    const mouse = Mouse.create(render.canvas)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    })
    Composite.add(engine.world, mouseConstraint)
    render.mouse = mouse

    return () => {
      Render.stop(render)
      Runner.stop(runner)
      Composite.clear(engine.world, false)
      Engine.clear(engine)
    }
  }, [])

  const addRandomSticker = () => {
    if (!engineRef.current || !renderRef.current) return
    const { Bodies, Composite, Body } = Matter

    const randomSticker =
      CUTEST_KAWAII_STICKERS[Math.floor(Math.random() * CUTEST_KAWAII_STICKERS.length)]

    const width = sceneRef.current.clientWidth || 760
    const height = 440

    const body = Bodies.circle(width / 2, height / 2, 34, {
      restitution: 0.9,
      frictionAir: 0.008,
      render: {
        fillStyle: randomSticker.bg,
        strokeStyle: randomSticker.color,
        lineWidth: 2,
      },
    })

    body.stickerMeta = randomSticker

    Body.setVelocity(body, {
      x: (Math.random() - 0.5) * 4,
      y: (Math.random() - 0.5) * 4,
    })

    Composite.add(engineRef.current.world, body)
    setActiveStickersCount((prev) => prev + 1)
  }

  const resetFloatingSpace = () => {
    if (!engineRef.current) return
    const { Composite, Body } = Matter
    const bodies = Composite.allBodies(engineRef.current.world)

    bodies.forEach((body) => {
      if (body.stickerMeta) {
        Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 5,
          y: (Math.random() - 0.5) * 5,
        })
      }
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
            Anti-Gravity Sticker Space 🌌
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={addRandomSticker}
            style={{
              background: '#F4ECE1',
              border: '1px solid #E5DCD1',
              borderRadius: '16px',
              padding: '6px 12px',
              fontSize: '12px',
              color: '#8A5844',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 500,
            }}
          >
            <Plus size={14} /> Add Sticker
          </button>

          <button
            onClick={resetFloatingSpace}
            style={{
              background: '#FAF7F2',
              border: '1px solid #EDE6DD',
              borderRadius: '16px',
              padding: '6px 12px',
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
        style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #FAF6F0 0%, #FFFDF9 100%)',
          border: '1px solid #EBE3D7',
          height: '440px',
        }}
      >
        <div ref={sceneRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />
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
        <span>✨ Drag, grab, and toss stickers — zero gravity physics keeps them floating smoothly</span>
        <span>{activeStickersCount} stickers floating</span>
      </div>
    </div>
  )
}
