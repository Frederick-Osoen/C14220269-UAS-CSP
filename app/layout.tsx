import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster} from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'C14220269',
  description: 'A vibrant animated landing page with Supabase backend',
  icons: {
    icon: '@/app/favicon2.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 min-h-screen text-white`}>
        {children}
        <Toaster position='top-center'/>
      </body>
    </html>
  )
}
