import { gsap } from './index'

/**
 * Split text into characters for animation
 * @param element - Text element to split
 * @returns Array of character spans
 */
export function splitTextChars(element: HTMLElement): HTMLElement[] {
  const text = element.textContent || ''
  element.innerHTML = text
    .split('')
    .map(char => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`)
    .join('')

  return Array.from(element.querySelectorAll('.char'))
}

/**
 * Split text into words for animation
 * @param element - Text element to split
 * @returns Array of word spans
 */
export function splitTextWords(element: HTMLElement): HTMLElement[] {
  const text = element.textContent || ''
  element.innerHTML = text
    .split(' ')
    .map(word => `<span class="word">${word}</span>`)
    .join(' ')

  return Array.from(element.querySelectorAll('.word'))
}

/**
 * Split text into lines for animation
 * @param element - Text element to split
 * @returns Array of line spans
 */
export function splitTextLines(element: HTMLElement): HTMLElement[] {
  const lines = element.innerHTML.split('<br>')
  element.innerHTML = lines
    .map(line => `<span class="line">${line}</span>`)
    .join('')

  return Array.from(element.querySelectorAll('.line'))
}

/**
 * Animate text reveal by characters
 * @param element - Text element
 * @param delay - Delay before animation starts
 * @returns GSAP Timeline
 */
export function textRevealChars(
  element: HTMLElement,
  delay = 0
): gsap.core.Timeline {
  const chars = splitTextChars(element)
  const tl = gsap.timeline({ delay })

  tl.from(chars, {
    opacity: 0,
    y: 20,
    rotateY: 90,
    stagger: 0.02,
    duration: 0.3,
    ease: 'back.out(1.2)'
  })

  return tl
}

/**
 * Animate text reveal by words
 * @param element - Text element
 * @param delay - Delay before animation starts
 * @returns GSAP Timeline
 */
export function textRevealWords(
  element: HTMLElement,
  delay = 0
): gsap.core.Timeline {
  const words = splitTextWords(element)
  const tl = gsap.timeline({ delay })

  tl.from(words, {
    opacity: 0,
    y: 30,
    rotateX: -90,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power2.out'
  })

  return tl
}

/**
 * Animate text reveal by lines
 * @param element - Text element
 * @param delay - Delay before animation starts
 * @returns GSAP Timeline
 */
export function textRevealLines(
  element: HTMLElement,
  delay = 0
): gsap.core.Timeline {
  const lines = splitTextLines(element)
  const tl = gsap.timeline({ delay })

  tl.from(lines, {
    opacity: 0,
    x: -50,
    stagger: 0.2,
    duration: 0.8,
    ease: 'power3.out'
  })

  return tl
}

/**
 * Typewriter effect
 * @param element - Text element
 * @param speed - Typing speed (characters per second)
 * @param delay - Delay before animation starts
 * @returns GSAP Timeline
 */
export function typewriter(
  element: HTMLElement,
  speed = 50,
  delay = 0
): gsap.core.Timeline {
  const text = element.textContent || ''
  element.textContent = ''

  const tl = gsap.timeline({ delay })

  tl.to(element, {
    textContent: text,
    duration: text.length / speed,
    ease: 'none'
  })

  return tl
}

/**
 * Scramble text effect
 * @param element - Text element
 * @param newText - Text to scramble to
 * @param duration - Animation duration
 * @param delay - Delay before animation starts
 * @returns GSAP Timeline
 */
export function scrambleText(
  element: HTMLElement,
  newText: string,
  duration = 1,
  delay = 0
): gsap.core.Timeline {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'
  const tl = gsap.timeline({ delay })

  tl.to(element, {
    textContent: newText,
    duration,
    ease: 'power2.inOut',
    onUpdate: function() {
      const progress = this.progress()
      let scrambled = ''

      for (let i = 0; i < newText.length; i++) {
        if (i < progress * newText.length) {
          scrambled += newText[i]
        } else {
          scrambled += chars[Math.floor(Math.random() * chars.length)]
        }
      }

      element.textContent = scrambled
    }
  })

  return tl
}

/**
 * Morph text effect
 * @param element - Text element
 * @param texts - Array of texts to cycle through
 * @param interval - Time between text changes
 * @param delay - Delay before animation starts
 * @returns GSAP Timeline
 */
export function morphText(
  element: HTMLElement,
  texts: string[],
  interval = 2,
  delay = 0
): gsap.core.Timeline {
  const tl = gsap.timeline({ delay, repeat: -1 })

  texts.forEach((text, index) => {
    if (index === 0) {
      tl.set(element, { textContent: text })
    } else {
      tl.to(element, {
        textContent: text,
        duration: 0.5,
        ease: 'power2.inOut'
      }, `+=${interval}`)
    }
  })

  return tl
}

/**
 * Gradient text reveal
 * @param element - Text element
 * @param delay - Delay before animation starts
 * @returns GSAP Timeline
 */
export function gradientTextReveal(
  element: HTMLElement,
  delay = 0
): gsap.core.Timeline {
  const tl = gsap.timeline({ delay })

  // Set up gradient background
  gsap.set(element, {
    background: 'linear-gradient(90deg, #7BC8D8 0%, #ffffff 50%, #7BC8D8 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundSize: '200% 100%',
    backgroundPosition: '100% 0%'
  })

  tl.from(element, {
    opacity: 0,
    y: 30,
    duration: 0.6,
    ease: 'power2.out'
  }).to(element, {
    backgroundPosition: '0% 0%',
    duration: 1,
    ease: 'power2.inOut'
  }, '-=0.3')

  return tl
}

/**
 * Clean up text splits (remove span wrappers)
 * @param element - Text element to clean
 */
export function cleanupTextSplit(element: HTMLElement): void {
  const text = element.textContent || ''
  element.innerHTML = text
}