'use client'
import { motion, Transition as FMTransition } from 'framer-motion'
import { PropsWithChildren } from 'react'

type RevealProps = PropsWithChildren<{
  delay?: number
  y?: number
  x?: number
  transition?: FMTransition
  pop?: boolean
  scaleFrom?: number
}>

export default function Reveal({ children, delay = 0, y = 24, x = 0, transition, pop = false, scaleFrom = 0.96 }: RevealProps) {
  const defaultTransition: FMTransition = pop
    ? { type: 'tween', duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }
    : { type: 'spring', stiffness: 90, damping: 18, mass: 0.8, delay }

  return (
    <motion.div
      initial={{ opacity: 0, y, x, filter: 'blur(8px)', scale: pop ? scaleFrom : 1 }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: 'blur(0px)', scale: pop ? [scaleFrom, 1.02, 1] : 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={transition ?? defaultTransition}
      style={{ willChange: 'transform, opacity, filter' }}
    >
      {children}
    </motion.div>
  )
}