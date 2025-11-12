"use client"
import { motion, AnimatePresence } from "framer-motion"

interface ActionResultProps {
  text: string
  actionLabel: string
}

export default function ActionResult({ text, actionLabel }: ActionResultProps) {
  return (
    <AnimatePresence>
      <motion.div
        key={text}
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 max-w-xs"
      >
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">{actionLabel}</p>
          <p className="text-gray-900 font-medium text-center break-words">{text}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
