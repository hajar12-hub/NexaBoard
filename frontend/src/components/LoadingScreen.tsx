import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Layers3 } from 'lucide-react'

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [showSkeleton, setShowSkeleton] = useState(true)
  
  const loadingTexts = [
    'Initializing...',
    'Loading resources...',
    'Setting up workspace...',
    'Connecting services...',
    'Preparing dashboard...',
    'Welcome to NexaBoard!'
  ]

  // Typing animation effect
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    // Typing effect
    const typeSpeed = 50
    const eraseSpeed = 30
    const delayBetweenTexts = 800

    const typeText = () => {
      if (charIndex < loadingTexts[textIndex].length) {
        setCurrentText(loadingTexts[textIndex].substring(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      } else {
        // Text complete, wait then move to next
        setTimeout(() => {
          if (textIndex < loadingTexts.length - 1) {
            setTextIndex(textIndex + 1)
            setCharIndex(0)
            setCurrentText('')
          }
        }, delayBetweenTexts)
      }
    }

    const timer = setTimeout(typeText, typeSpeed)
    return () => clearTimeout(timer)
  }, [charIndex, textIndex])

  // Progress animation
  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer)
          setTimeout(() => {
            setShowSkeleton(false)
            setTimeout(onComplete, 800) // Smooth transition out
          }, 500)
          return 100
        }
        return prev + Math.random() * 8 + 2
      })
    }, 150)

    return () => clearInterval(progressTimer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Background - Same as login page */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80">
        <div className="absolute inset-0 bg-grid-white/5 bg-grid-16" />
        
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-white">
        
        {/* Logo section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative">
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl blur-xl opacity-30"
              style={{
                background: 'linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1), rgba(255,255,255,0.3))',
                backgroundSize: '300% 300%',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Logo container */}
            <motion.div
              className="relative flex items-center gap-4 px-8 py-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Animated logo icon */}
              <motion.div
                className="relative"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                  <Layers3 className="w-6 h-6 text-white" />
                </div>
              </motion.div>
              
              {/* Logo text */}
              <motion.div
                className="text-3xl font-bold text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                NexaBoard
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Welcome text */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h2 className="text-2xl font-medium text-white/90">Welcome to NexaBoard</h2>
        </motion.div>

        {/* Loading content */}
        <div className="text-center space-y-8 max-w-md w-full">
          
          {/* Progress ring */}
          <div className="relative w-24 h-24 mx-auto">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
                fill="none"
              />
              <motion.circle
                cx="12"
                cy="12"
                r="10"
                stroke="white"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                style={{
                  pathLength: progress / 100,
                  rotate: 0
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </svg>
            
            {/* Progress percentage */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                className="text-lg font-semibold text-white"
                key={Math.floor(progress)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {Math.floor(progress)}%
              </motion.span>
            </div>
          </div>

          {/* Typing text animation */}
          <div className="h-8 flex items-center justify-center">
            <motion.div
              className="text-lg text-white/80 font-medium"
              key={currentText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {currentText}
              <motion.span
                className="inline-block w-0.5 h-5 bg-white ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </motion.div>
          </div>

          {/* Skeleton loading bars */}
          <AnimatePresence>
            {showSkeleton && (
              <motion.div
                className="space-y-3 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="h-2 bg-gradient-to-r from-white/20 via-white/30 to-white/20 rounded-full overflow-hidden"
                    style={{ width: `${100 - index * 15}%`, margin: '0 auto' }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      style={{ width: '50%' }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}