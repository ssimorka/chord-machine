import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'
import { GENRES } from '@/data/genres'

interface Props {
  open: boolean
  activeIndex: number | null
  onPick: (idx: number) => void
}

export function GenreLibrary({ open, activeIndex, onPick }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="pt-2">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {GENRES.map((g, i) => (
                <motion.button
                  key={g.name}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ y: -1 }}
                  onClick={() => onPick(i)}
                  className={cn(
                    'group relative flex flex-col items-start gap-1 overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-colors',
                    activeIndex === i
                      ? 'border-purple/60 bg-purple/10'
                      : 'border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'
                  )}
                >
                  {activeIndex === i && (
                    <motion.span
                      layoutId="genre-glow"
                      className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-purple/40"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <div className="flex w-full items-center justify-between">
                    <span className={cn('text-[13px] font-semibold leading-tight', activeIndex === i && 'text-purple')}>
                      {g.name}
                    </span>
                    <span className="font-mono text-[10px] tabular-nums text-muted">{g.bpm}</span>
                  </div>
                  <p className="line-clamp-1 text-[11px] text-muted/70">{g.vibe}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
