import { gsap, ScrollTrigger } from './index'

/**
 * Create a scroll-triggered fade in animation
 * @param element - Target element
 * @param options - ScrollTrigger options
 */
export function createScrollFadeIn(
  element: HTMLElement | string,
  options: Partial<ScrollTrigger.Vars> = {}
): ScrollTrigger {
  return ScrollTrigger.create({
    trigger: element,
    start: 'top 80%',
    toggleActions: 'play none none reverse',
    onEnter: () => gsap.fromTo(element, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }),
    ...options,
  })
}

/**
 * Create a scroll-triggered scale in animation
 * @param element - Target element
 * @param options - ScrollTrigger options
 */
export function createScrollScaleIn(
  element: HTMLElement | string,
  options: Partial<ScrollTrigger.Vars> = {}
): ScrollTrigger {
  return ScrollTrigger.create({
    trigger: element,
    start: 'top 85%',
    toggleActions: 'play none none reverse',
    onEnter: () => gsap.fromTo(element, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 }),
    ...options,
  })
}

/**
 * Create a parallax effect on scroll
 * @param element - Target element
 * @param speed - Speed multiplier (negative for opposite direction)
 * @param options - Additional ScrollTrigger options
 */
export function createParallax(
  element: HTMLElement | string,
  speed = -0.5,
  options: Partial<ScrollTrigger.Vars> = {}
): ScrollTrigger {
  return ScrollTrigger.create({
    trigger: element,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      gsap.set(element, { y: self.progress * speed * 100 })
    },
    ...options,
  })
}

/**
 * Create a multi-layer parallax effect
 * @param layers - Array of {element, speed} objects
 * @param options - ScrollTrigger options for the container
 */
export function createMultiParallax(
  layers: Array<{ element: HTMLElement | string; speed: number }>,
  options: Partial<ScrollTrigger.Vars> = {}
): ScrollTrigger {
  return ScrollTrigger.create({
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      layers.forEach(({ element, speed }) => {
        gsap.set(element, { y: self.progress * speed * 100 })
      })
    },
    ...options,
  })
}

/**
 * Create a scroll-triggered counter animation
 * @param element - Target element containing the number
 * @param targetValue - Final number to count to
 * @param options - ScrollTrigger options
 */
export function createCounter(
  element: HTMLElement | string,
  targetValue: number,
  options: Partial<ScrollTrigger.Vars> = {}
): ScrollTrigger {
  return ScrollTrigger.create({
    trigger: element,
    start: 'top 80%',
    onEnter: () => {
      gsap.to(element, {
        textContent: targetValue,
        duration: 2,
        ease: 'power1.out',
        snap: { textContent: 1 },
      })
    },
    ...options,
  })
}

/**
 * Create a scroll-triggered stagger animation
 * @param container - Container element
 * @param selector - Selector for child elements
 * @param animation - Animation properties
 * @param stagger - Stagger delay
 * @param options - ScrollTrigger options
 */
export function createScrollStagger(
  container: HTMLElement | string,
  selector: string,
  animation: gsap.TweenVars,
  stagger = 0.1,
  options: Partial<ScrollTrigger.Vars> = {}
): ScrollTrigger {
  return ScrollTrigger.create({
    trigger: container,
    start: 'top 80%',
    onEnter: () => {
      const elements = gsap.utils.toArray(`${container} ${selector}`)
      gsap.from(elements, {
        ...animation,
        stagger,
      })
    },
    ...options,
  })
}

/**
 * Create a progress-based animation
 * @param element - Target element
 * @param progressCallback - Function called with scroll progress
 * @param options - ScrollTrigger options
 */
export function createProgressAnimation(
  element: HTMLElement | string,
  progressCallback: (progress: number) => void,
  options: Partial<ScrollTrigger.Vars> = {}
): ScrollTrigger {
  return ScrollTrigger.create({
    trigger: element,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => progressCallback(self.progress),
    ...options,
  })
}

/**
 * Create a reveal animation with clip-path
 * @param element - Target element
 * @param options - ScrollTrigger options
 */
export function createClipReveal(
  element: HTMLElement | string,
  options: Partial<ScrollTrigger.Vars> = {}
): ScrollTrigger {
  // Set initial state
  gsap.set(element, { clipPath: 'inset(0 0 100% 0)' })

  return ScrollTrigger.create({
    trigger: element,
    start: 'top 80%',
    onEnter: () => gsap.to(element, { clipPath: 'inset(0 0 0% 0)', duration: 0.8 }),
    ...options,
  })
}

/**
 * Refresh all ScrollTrigger instances (useful after layout changes)
 */
export function refreshScrollTriggers(): void {
  ScrollTrigger.refresh()
}

/**
 * Kill all ScrollTrigger instances
 */
export function killAllScrollTriggers(): void {
  ScrollTrigger.killAll()
}

/**
 * Get all active ScrollTrigger instances
 */
export function getAllScrollTriggers(): ScrollTrigger[] {
  return ScrollTrigger.getAll()
}