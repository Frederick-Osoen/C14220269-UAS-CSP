'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main className="flex flex-col items-center justify-center h-screen text-center px-4 animate-gradient">
      <motion.h1
        className="text-5xl md:text-7xl font-extrabold drop-shadow-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to <span className="text-yellow-300">UAS CSP</span>
      </motion.h1>

      <motion.p
        className="mt-6 max-w-xl text-lg md:text-xl text-white/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
          This web is created by Frederick Christian Osoen C14220269 powered by Next.js, Tailwind, and Supabase.
      </motion.p>

      <motion.div
        className="mt-10 flex gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <button
          onClick={() => router.push('/login')}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-full transition-all duration-300"
        >
          Login
        </button>
        <button
          onClick={() => router.push('/signup')}
          className="bg-white hover:bg-gray-100 text-purple-700 font-semibold px-6 py-3 rounded-full transition-all duration-300"
        >
          Sign Up
        </button>
      </motion.div>

      <motion.div
        className="absolute bottom-10 text-white/80 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        &copy; 2025 FCO-C14220269. don't copy my web!
      </motion.div>
    </main>
  )
}
