import * as THREE from 'three'
import React, { useEffect, useRef } from 'react'
import { extend, useThree, useFrame } from '@react-three/fiber'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader'
import { useControls } from 'leva'
import { WaterPass } from './shaders/WaterPass'
import state from '../state'

extend({ EffectComposer, ShaderPass, RenderPass, WaterPass })

export default function Effects() {
  const composer = useRef()
  const water = useRef()
  const { gl, size, camera, scene } = useThree()
  // ── Live control panel ──────────────────────────────────────────────────────
  const ctrl = useControls('Water', {
    strength:       { value: 1,     min: 0,    max: 4,    step: 0.1 },   // scroll → ripple multiplier
    frequency:      { value: 4,     min: 1,    max: 12,   step: 0.5 },   // ripple density
    amplitude:      { value: 0.0004, min: 0,   max: 0.006, step: 0.0002 }, // ripple depth (subtle, one-directional)
    speed:          { value: 1,     min: 0,    max: 3,    step: 0.1 },   // wave time speed
    responsiveness: { value: 0.1,   min: 0.02, max: 0.5,  step: 0.01 },  // how fast it reacts / settles
  })
  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  let last = state.top
  let index = 0
  let values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  useFrame(() => {
    const { top } = state
    values[index] = Math.abs(top - last)
    const normalize = values.reduce((a, b) => a + b) / values.length
    water.current.factor = THREE.MathUtils.lerp(water.current.factor, (normalize / 20) * ctrl.strength, ctrl.responsiveness)
    water.current.uniforms.freq.value = ctrl.frequency
    water.current.uniforms.amp.value = ctrl.amplitude
    water.current.timeSpeed = 0.01 * ctrl.speed
    last = top
    index = (index + 1) % 10
    gl.autoClear = true
    composer.current.render()
  }, 1)
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attach={(parent, self) => { parent.addPass(self); return () => {} }} scene={scene} camera={camera} />
      <waterPass attach={(parent, self) => { parent.addPass(self); return () => {} }} ref={water} />
      <shaderPass attach={(parent, self) => { parent.addPass(self); return () => {} }} args={[GammaCorrectionShader]} />
    </effectComposer>
  )
}
