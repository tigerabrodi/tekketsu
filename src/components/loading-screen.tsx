import { motion } from 'motion/react'
import './loading-screen.css'

const BRUSH_EASE: [number, number, number, number] = [0.0, 0.95, 0.05, 1.0]

const STROKES = [
  // 鉄 (tetsu) — LEFT RADICAL 釒
  { d: 'M 142,46 Q 130,68 108,94', w: 8, delay: 0.1, dur: 0.15 },
  { d: 'M 58,110 L 196,110', w: 8, delay: 0.2, dur: 0.18 },
  { d: 'M 128,110 L 128,268', w: 8, delay: 0.3, dur: 0.2 },
  { d: 'M 126,260 Q 110,274 84,288', w: 6, delay: 0.4, dur: 0.14 },
  { d: 'M 130,260 Q 146,274 172,288', w: 6, delay: 0.48, dur: 0.14 },

  // 鉄 (tetsu) — RIGHT PART 失
  { d: 'M 318,56 Q 306,74 284,94', w: 7, delay: 0.56, dur: 0.14 },
  { d: 'M 228,114 L 376,114', w: 8, delay: 0.64, dur: 0.18 },
  { d: 'M 302,118 Q 272,186 224,278', w: 8, delay: 0.74, dur: 0.24 },
  { d: 'M 304,118 Q 340,186 390,274', w: 8, delay: 0.88, dur: 0.24 },

  // 血 (chi / ketsu)
  { d: 'M 472,46 Q 462,64 448,86', w: 7, delay: 1.02, dur: 0.14 },
  { d: 'M 442,98 L 632,98', w: 8, delay: 1.1, dur: 0.2 },
  { d: 'M 450,98 L 450,282', w: 8, delay: 1.22, dur: 0.22 },
  { d: 'M 510,134 L 510,274', w: 6, delay: 1.34, dur: 0.18 },
  { d: 'M 572,134 L 572,274', w: 6, delay: 1.44, dur: 0.18 },
  { d: 'M 624,98 L 624,282', w: 8, delay: 1.54, dur: 0.22 },
  { d: 'M 450,282 L 624,282', w: 8, delay: 1.66, dur: 0.2 },
]

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-container">
        <motion.svg
          viewBox="0 0 680 340"
          xmlns="http://www.w3.org/2000/svg"
          className="loading-kanji"
        >
          {STROKES.map((stroke, i) => (
            <motion.path
              key={i}
              d={stroke.d}
              strokeWidth={stroke.w}
              className="loading-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: {
                  delay: stroke.delay,
                  duration: stroke.dur,
                  ease: BRUSH_EASE,
                },
                opacity: {
                  delay: stroke.delay,
                  duration: 0.01,
                },
              }}
            />
          ))}
        </motion.svg>

        <motion.p
          className="loading-label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.5, ease: 'easeOut' }}
        >
          鉄血 · tekketsu · iron blood
        </motion.p>
      </div>
    </div>
  )
}

export { LoadingScreen }
