'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const vertexShader = `
varying vec3 vNormal;
varying float vReflectionFactor;
float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
}
void main() {
  vNormal = normal * rand(instanceMatrix[3].xz);
  vec4 worldPosition = modelMatrix * instanceMatrix * vec4(position + vec3(0., .3, 0.), 1.);
  vReflectionFactor = .2 + 2. * pow(
    1. + dot(normalize(worldPosition.xyz - cameraPosition), normal),
    3.
  );
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`

const fragmentShader = `
varying vec3 vNormal;
varying float vReflectionFactor;
void main() {
  vec3 colored = mix(vNormal, vec3(1.), .75);
  gl_FragColor = vec4(colored, vReflectionFactor);
}
`

type Particle = {
  x: number
  y: number
  z: number
  scale: number
  maxScale: number
  deltaScale: number
  isFlying: boolean
  grow: () => void
}

type TextureCoord = {
  x: number
  y: number
}

export function Title() {
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLDivElement>(null)
  const [text, setText] = useState('20 Svg`s with Gravit Designer')

  useEffect(() => {
    if (!containerRef.current || !inputRef.current) return

    const container = containerRef.current
    const input = inputRef.current
    const fontName = 'Verdana'
    const textureFontSize = 58
    const fontScaleFactor = 0.03

    input.innerText = text
    input.style.font = `20 ${textureFontSize}px ${fontName}`
    input.style.lineHeight = `${textureFontSize * 1.1}px`

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 18

    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enablePan = false

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    const geometry = new THREE.IcosahedronGeometry(0.2, 3)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true
    })

    const dummy = new THREE.Object3D()
    const stringBox = { wTexture: 0, hTexture: 0, wScene: 0, hScene: 0 }
    let textureCoords: TextureCoord[] = []
    let particles: Particle[] = []
    let instancedMesh: THREE.InstancedMesh

    const createParticle = ([x, y]: [number, number]): Particle => ({
      x: x + 0.2 * (Math.random() - 0.5),
      y: y + 0.2 * (Math.random() - 0.5),
      z: 0,
      scale: 0.1 * Math.random(),
      maxScale: Math.pow(Math.random(), 3),
      deltaScale: 0.02 * Math.random(),
      isFlying: Math.random() < 0.06,
      grow() {
        this.scale += this.deltaScale
        if (this.scale >= this.maxScale) this.scale = 0
        if (this.isFlying) this.y -= 7 * this.deltaScale
      }
    })

    const sampleCoordinates = () => {
      const lines = text.split('\n')
      stringBox.wTexture = input.clientWidth
      stringBox.hTexture = input.clientHeight
      stringBox.wScene = stringBox.wTexture * fontScaleFactor
      stringBox.hScene = stringBox.hTexture * fontScaleFactor

      canvas.width = stringBox.wTexture
      canvas.height = stringBox.hTexture
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = `100 ${textureFontSize}px ${fontName}`
      ctx.fillStyle = '#2a9d8f'
      lines.forEach((line, i) => {
        ctx.fillText(line, 0, ((i + 0.8) * stringBox.hTexture) / lines.length)
      })

      const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
      textureCoords = []
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          if (img.data[(x + y * canvas.width) * 4] > 0) {
            textureCoords.push({ x, y })
          }
        }
      }
    }

    const refreshText = () => {
      sampleCoordinates()
      particles = textureCoords.map(c => createParticle([c.x * fontScaleFactor, c.y * fontScaleFactor]))
      if (instancedMesh) scene.remove(instancedMesh)
      instancedMesh = new THREE.InstancedMesh(geometry, material, particles.length)
      instancedMesh.position.set(-stringBox.wScene / 2, -stringBox.hScene / 2, 0)
      scene.add(instancedMesh)
    }

    const updateParticles = () => {
      particles.forEach((p, i) => {
        p.grow()
        dummy.position.set(p.x, stringBox.hScene - p.y, p.z)
        dummy.scale.setScalar(p.scale)
        dummy.updateMatrix()
        instancedMesh.setMatrixAt(i, dummy.matrix)
      })
      instancedMesh.instanceMatrix.needsUpdate = true
    }

    const animate = () => {
      requestAnimationFrame(animate)
      updateParticles()
      renderer.render(scene, camera)
    }

    refreshText()
    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    input.addEventListener('input', () => {
      setText(input.innerText)
      refreshText()
    })

    container.addEventListener('click', () => {
      input.focus()
      const sel = window.getSelection()
      sel?.collapse(input, input.childNodes.length)
    })

    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      container.innerHTML = ''
    }
  }, [text])

  return (
    <>
      <div
        ref={inputRef}
        className="absolute top-0 left-0 opacity-0 pointer-events-none"
      />
      <div ref={containerRef} className="absolute inset-0" />
    </>
  )
}
