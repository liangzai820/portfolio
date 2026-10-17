import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  radius: number
  baseAlpha: number
  phase: number
  speed: number
}

/**
 * 星空背景（Canvas 实现）
 * - 星点数量随视口缩放（移动端减少）
 * - 页面不可见时暂停动画
 * - 响应 prefers-reduced-motion，降级为静态星空
 */
export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    let stars: Star[] = []
    let rafId = 0
    let running = true

    const initStars = () => {
      const isMobile = window.innerWidth < 768
      const count = isMobile ? 60 : 140
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.5 + 0.3,
        baseAlpha: Math.random() * 0.6 + 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.005,
      }))
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initStars()
      if (!running) return
      draw()
    }

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      const t = performance.now() / 1000

      for (const star of stars) {
        const alpha =
          star.baseAlpha * (0.6 + 0.4 * Math.sin(t * star.speed * 20 + star.phase))
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.fill()
      }

      if (running && !reducedMotion) {
        rafId = requestAnimationFrame(draw)
      }
    }

    const handleVisibility = () => {
      running = document.visibilityState === 'visible'
      if (running && !reducedMotion) {
        cancelAnimationFrame(rafId)
        rafId = requestAnimationFrame(draw)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  )
}
