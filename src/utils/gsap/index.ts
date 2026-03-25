import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

// Export main GSAP instance
export { gsap, ScrollTrigger }

// Export animation presets
export * from './animations'

// Export custom hooks
export * from './hooks'

// Export scroll trigger utilities
export * from './scrollTrigger'

// Export text animations
export * from './textAnimations'

// Type definitions for better TypeScript support
export type GSAPTween = gsap.core.Tween
export type GSAPTimeline = gsap.core.Timeline
export type GSAPTweenVars = gsap.TweenVars
export type GSAPScrollTrigger = ScrollTrigger
export type GSAPScrollTriggerVars = ScrollTrigger.Vars