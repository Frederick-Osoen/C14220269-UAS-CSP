'use client';

import { useState } from 'react';
import supabase from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Listbox } from '@headlessui/react';
import { User, ShieldCheck } from 'lucide-react';

const roles = [
  { id: 'user', name: 'User', icon: User },
  { id: 'admin', name: 'Admin', icon: ShieldCheck },
];

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(roles[0]); // using object now
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg("Passwords don't match!");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from('users').insert([
      {
        username,
        password,
        role: role.id,
      },
    ]);

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('Signup successful!');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 animate-gradient">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-sm"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-pink-600">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-5">
          {/* USERNAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border text-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Choose a username"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border text-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="••••••••"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border text-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="••••••••"
            />
          </div>

          {/* ROLE SELECT DROPDOWN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <Listbox value={role} onChange={setRole}>
  {({ open }) => (
    <div className="relative">
      <Listbox.Button className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 shadow flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-purple-400">
        <span className="flex items-center gap-2">
          <role.icon className="w-4 h-4" />
          {role.name}
        </span>
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </Listbox.Button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto"
          >
            <Listbox.Options static className="outline-none">
              {roles.map((r) => (
                <Listbox.Option
                  key={r.id}
                  value={r}
                  className={({ active }) =>
                    `cursor-pointer select-none px-4 py-2 flex items-center gap-2 ${
                      active ? 'bg-purple-100 text-purple-700' : 'text-gray-700'
                    }`
                  }
                >
                  <r.icon className="w-4 h-4" />
                  {r.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )}
</Listbox>

          </div>

          {/* ERROR / SUCCESS MESSAGE */}
          {errorMsg && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500 text-center">
              {errorMsg}
            </motion.p>
          )}
          {successMsg && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-green-600 text-center">
              {successMsg}
            </motion.p>
          )}

          {/* SUBMIT */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-300 hover:from-pink-600 hover:to-orange-500 text-white py-2 rounded-xl font-semibold shadow-lg transition-all duration-300"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </motion.button>
        </form>

        <p className="text-sm mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <button onClick={() => router.push('/login')} className="text-pink-600 hover:underline">
            Login
          </button>
        </p>
      </motion.div>
    </div>
  );
}
