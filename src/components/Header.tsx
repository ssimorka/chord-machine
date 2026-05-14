import { motion } from 'framer-motion'
import { Music2 } from 'lucide-react'

interface Props { isPlaying: boolean }

export function Header({ isPlaying }: Props) {
  return (
    <header className="container flex items-center justify-between py-4 sm:py-6">
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ rotate: -20, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-purple/40 bg-purple/15"
        >
          <Music2 className="h-6 w-6 text-purple" />
          <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-purple/30 ring-offset-2 ring-offset-background" />
        </motion.div>
        <div>
          <h1 className="text-xl font-extrabold leading-none tracking-tight sm:text-2xl">
            Chord <span className="text-purple">Machine</span>
          </h1>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            16-Step Boutique Chord Sequencer · V1.0
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="chip">
          <span className={isPlaying ? 'led animate-cm-pulse' : 'led-off'} />
          {isPlaying ? 'Live' : 'Idle'}
        </span>
      </div>
    </header>
  )
}
