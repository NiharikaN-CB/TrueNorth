// Web Audio API Ambient Sound Synthesizer for TrueNorth
// Zero external audio files required — 100% offline & local

let audioCtx = null
let currentSource = null
let gainNode = null

export function playAmbientSound(type, volume = 0.3) {
  stopAmbientSound()

  if (type === 'none') return

  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!AudioContextClass) return

  audioCtx = new AudioContextClass()
  gainNode = audioCtx.createGain()
  gainNode.gain.value = volume
  gainNode.connect(audioCtx.destination)

  const bufferSize = audioCtx.sampleRate * 2
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate)
  const output = noiseBuffer.getChannelData(0)

  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1
  }

  const whiteNoise = audioCtx.createBufferSource()
  whiteNoise.buffer = noiseBuffer
  whiteNoise.loop = true

  if (type === 'rain') {
    // Rain sound: Lowpass filter + slight highpass
    const filter = audioCtx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 1000
    whiteNoise.connect(filter)
    filter.connect(gainNode)
  } else if (type === 'ocean') {
    // Ocean sound: LFO modulated lowpass filter
    const filter = audioCtx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 400

    const lfo = audioCtx.createOscillator()
    lfo.frequency.value = 0.12 // 8-second wave cycle
    const lfoGain = audioCtx.createGain()
    lfoGain.gain.value = 300
    lfo.connect(lfoGain)
    lfoGain.connect(filter.frequency)
    lfo.start()

    whiteNoise.connect(filter)
    filter.connect(gainNode)
  } else if (type === 'cafe') {
    // Warm cafe noise
    const filter = audioCtx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 800
    filter.Q.value = 1.5
    whiteNoise.connect(filter)
    filter.connect(gainNode)
  }

  whiteNoise.start()
  currentSource = whiteNoise
}

export function stopAmbientSound() {
  if (currentSource) {
    try {
      currentSource.stop()
    } catch (e) {}
    currentSource = null
  }
  if (audioCtx) {
    try {
      audioCtx.close()
    } catch (e) {}
    audioCtx = null
  }
}

export function setAmbientVolume(val) {
  if (gainNode) {
    gainNode.gain.value = val
  }
}
