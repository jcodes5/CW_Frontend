import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, GSAPTweenVars, GSAPTimeline, GSAPScrollTrigger } from './index'

/**
 * Hook for scroll-triggered animations
 * @param triggerRef - Ref to the trigger element
 * @param animation - GSAP animation (timeline or tween)
 * @param options - ScrollTrigger configuration options
 */
export function useGSAPScrollTrigger(
  triggerRef: React.RefObject<HTMLElement>,
  animation: GSAPTimeline | gsap.core.Tween,
  options: ScrollTrigger.Vars = {}
): void {
  useEffect(() => {
    const element = triggerRef.current
    if (!element) return

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: element,
        animation,
        ...options,
      })
    })

    return () => ctx.revert()
  }, [triggerRef, animation, options])
}

/**
 * Hook for staggered animations on a container
 * @param containerRef - Ref to the container element
 * @param selector - CSS selector for child elements to animate
 * @param animation - Animation properties
 * @param stagger - Stagger delay between elements
 */
export function useGSAPStagger(
  containerRef: React.RefObject<HTMLElement>,
  selector: string,
  animation: GSAPTweenVars,
  stagger = 0.1
): void {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const elements = container.querySelectorAll(selector)
    if (elements.length === 0) return

    const ctx = gsap.context(() => {
      gsap.from(elements, {
        ...animation,
        stagger,
      })
    }, container)

    return () => ctx.revert()
  }, [containerRef, selector, animation, stagger])
}

/**
 * Hook for creating and managing GSAP timelines
 * @param dependencies - Dependencies array for timeline recreation
 * @returns GSAP Timeline instance
 */
export function useGSAPTimeline(
  dependencies: any[] = []
): GSAPTimeline {
  const timelineRef = useRef<GSAPTimeline>()

  useEffect(() => {
    // Create new timeline
    timelineRef.current = gsap.timeline()

    // Cleanup function
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
        timelineRef.current = undefined
      }
    }
  }, dependencies)

  return timelineRef.current!
}

/**
 * Hook for simple tween animations on mount
 * @param targetRef - Ref to the target element
 * @param animation - Animation properties
 * @param dependencies - Dependencies for re-triggering animation
 */
export function useGSAPTween(
  targetRef: React.RefObject<HTMLElement>,
  animation: GSAPTweenVars,
  dependencies: any[] = []
): void {
  useEffect(() => {
    const element = targetRef.current
    if (!element) return

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.from(element, animation)
    })

    return () => ctx.revert()
  }, [targetRef, animation, ...dependencies])
}

/**
 * Hook for hover animations
 * @param elementRef - Ref to the element
 * @param onHover - Animation to play on hover
 * @param onLeave - Animation to play on mouse leave
 */
export function useGSAPHover(
  elementRef: React.RefObject<HTMLElement>,
  onHover: GSAPTweenVars,
  onLeave: GSAPTweenVars = { scale: 1 }
): void {
  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      element.addEventListener('mouseenter', () => {
        gsap.to(element, onHover)
      })

      element.addEventListener('mouseleave', () => {
        gsap.to(element, onLeave)
      })
    })

    return () => ctx.revert()
  }, [elementRef, onHover, onLeave])
}

/**
 * Hook for managing GSAP context to prevent memory leaks
 * @param callback - Function containing GSAP animations
 * @param dependencies - Dependencies for context recreation
 * @returns GSAP context instance
 */
export function useGSAPContext(
  callback: () => void,
  dependencies: any[] = []
): gsap.Context {
  const contextRef = useRef<gsap.Context>()

  useEffect(() => {
    // Create new context
    contextRef.current = gsap.context(callback)

    // Cleanup function
    return () => {
      if (contextRef.current) {
        contextRef.current.revert()
        contextRef.current = undefined
      }
    }
  }, dependencies)

  return contextRef.current!
}