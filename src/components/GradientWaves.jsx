import React, { useEffect, useRef } from 'react'

export default function GradientWaves({
  horizonColor = "#E8D8D2",
  waveColor = "#C98F9A",
  crestColor = "#F8F1EA",
  speed = 0.15,
  amplitude = 1.7,
  waveScale = 0.6,
  waveRatio = 0.85,
  swell = 28.5,
  turbulence = 10.5,
  tilt = 1.05,
  zoom = 1,
  height = 5.5,
  fogDepth = 15,
  detail = "medium",
  brightness = 0.85,
  opacity = 0.78,
  grain = true,
  grainIntensity = 0.13,
  mouseInteraction = true,
  parallaxStrength = 0.59,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let time = 0

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth || 1080
        canvas.height = canvas.parentElement.clientHeight || 1080
      } else {
        canvas.width = 1080
        canvas.height = 1080
      }
    }
    resize()
    window.addEventListener('resize', resize)

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += speed * 0.2

      // Draw Horizon background
      ctx.fillStyle = horizonColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw animated waves
      const waveCount = 3
      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath()
        ctx.moveTo(0, canvas.height)

        const layerOffset = i * 60
        const step = 20
        for (let x = 0; x <= canvas.width; x += step) {
          const waveAngle = (x * 0.004 * waveScale) + time + (i * waveRatio)
          const offset = Math.sin(waveAngle) * swell * amplitude
          const y = (canvas.height * 0.55) + layerOffset + offset
          ctx.lineTo(x, y)
        }

        ctx.lineTo(canvas.width, canvas.height)
        ctx.closePath()

        const waveGrad = ctx.createLinearGradient(0, canvas.height * 0.4, 0, canvas.height)
        waveGrad.addColorStop(0, crestColor)
        waveGrad.addColorStop(0.3, waveColor)
        waveGrad.addColorStop(1, horizonColor)

        ctx.fillStyle = waveGrad
        ctx.globalAlpha = opacity * (1 - (i * 0.25))
        ctx.fill()
      }

      ctx.globalAlpha = 1
      animationFrameId = requestAnimationFrame(render)
    }
    render()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [horizonColor, waveColor, crestColor, speed, amplitude, waveScale, waveRatio, swell, opacity])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        borderRadius: '50%',
      }}
    />
  )
}
