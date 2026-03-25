import { gsap } from './index'

/**
 * Fade in animation from below
 */
export const fadeInUp = (
  element: HTMLElement | string,
  delay = 0
): gsap.core.Tween => {
  return gsap.from(element, {
    opacity: 0,
    y: 30,
    duration: 0.6,
    delay,
    ease: 'power2.out'
  })
}

/**
 * Fade in animation from left
 */
export const fadeInLeft = (
  element: HTMLElement | string,
  delay = 0
): gsap.core.Tween => {
  return gsap.from(element, {
    opacity: 0,
    x: -30,
    duration: 0.6,
    delay,
    ease: 'power2.out'
  })
}

/**
 * Fade in animation from right
 */
export const fadeInRight = (
  element: HTMLElement | string,
  delay = 0
): gsap.core.Tween => {
  return gsap.from(element, {
    opacity: 0,
    x: 30,
    duration: 0.6,
    delay,
    ease: 'power2.out'
  })
}

/**
 * Scale in animation
 */
export const scaleIn = (
  element: HTMLElement | string,
  delay = 0
): gsap.core.Tween => {
  return gsap.from(element, {
    opacity: 0,
    scale: 0.9,
    duration: 0.5,
    delay,
    ease: 'back.out(1.2)'
  })
}

/**
 * Scale in with bounce
 */
export const scaleInBounce = (
  element: HTMLElement | string,
  delay = 0
): gsap.core.Tween => {
  return gsap.from(element, {
    opacity: 0,
    scale: 0,
    duration: 0.6,
    delay,
    ease: 'back.out(1.7)'
  })
}

/**
 * Slide in from bottom
 */
export const slideInUp = (
  element: HTMLElement | string,
  delay = 0
): gsap.core.Tween => {
  return gsap.from(element, {
    opacity: 0,
    y: 50,
    duration: 0.7,
    delay,
    ease: 'power2.out'
  })
}

/**
 * Stagger animation for multiple elements
 */
export const staggerFadeIn = (
  elements: HTMLElement[] | string,
  stagger = 0.1,
  delay = 0
): gsap.core.Tween => {
  return gsap.from(elements, {
    opacity: 0,
    y: 20,
    stagger,
    duration: 0.5,
    delay,
    ease: 'power2.out'
  })
}

/**
 * Stagger scale animation
 */
export const staggerScaleIn = (
  elements: HTMLElement[] | string,
  stagger = 0.08,
  delay = 0
): gsap.core.Tween => {
  return gsap.from(elements, {
    opacity: 0,
    scale: 0.8,
    stagger,
    duration: 0.4,
    delay,
    ease: 'back.out(1.2)'
  })
}

/**
 * Hover scale effect
 */
export const hoverScale = (
  element: HTMLElement | string,
  scaleTo = 1.05
): gsap.core.Tween => {
  return gsap.to(element, {
    scale: scaleTo,
    duration: 0.2,
    ease: 'power2.out'
  })
}

/**
 * Reset scale after hover
 */
export const resetScale = (
  element: HTMLElement | string
): gsap.core.Tween => {
  return gsap.to(element, {
    scale: 1,
    duration: 0.2,
    ease: 'power2.out'
  })
}

/**
 * Pulse animation
 */
export const pulse = (
  element: HTMLElement | string,
  repeat = -1
): gsap.core.Tween => {
  return gsap.to(element, {
    scale: 1.05,
    duration: 0.6,
    repeat,
    yoyo: true,
    ease: 'power2.inOut'
  })
}

/**
 * Shake animation
 */
export const shake = (
  element: HTMLElement | string
): gsap.core.Tween => {
  return gsap.to(element, {
    x: -5,
    duration: 0.1,
    repeat: 5,
    yoyo: true,
    ease: 'power2.inOut',
    onComplete: () => gsap.set(element, { x: 0 })
  })
}