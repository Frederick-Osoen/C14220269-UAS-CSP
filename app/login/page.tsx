'use client';

import { useState } from 'react';
import supabase from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { setUserSession, clearUserSession } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const { data, error } = await supabase
      .from('users')
      .select('id, username, role')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error || !data) {
      setErrorMsg('Invalid username or password.');
      setLoading(false);
      return;
    }

    setUserSession(data);

    if (data.role === 'admin') {
      router.push('/dashboard/admin');
    } else {
      router.push('/dashboard/user');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 animate-gradient">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-sm"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-pink-600 drop-shadow">
         Login to Your Account
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border text-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border text-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="••••••••"
            />
          </div>

          {errorMsg && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-center text-red-600"
            >
              {errorMsg}
            </motion.p>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-2 rounded-xl font-semibold shadow-lg transition-all duration-300"
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>

        <p className="text-sm mt-6 text-center text-gray-600">
          Haven't had an account?{' '}
          <button
            onClick={() => router.push('/signup')}
            className="text-pink-600 hover:underline"
          >
            Sign-up
          </button>
        </p>
      </motion.div>
    </div>
  );
}
