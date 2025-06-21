'use client'

import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase/client'
import { Product } from '@/types/supabase'
import { getUserSession, clearUserSession } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function UserDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [username, setUsername] = useState('')
  const router = useRouter()

  useEffect(() => {
    const session = getUserSession()

    if (!session) {
      toast.error('Anda belum login!')
      router.push('/login')
      return
    }

    setUsername(session.username)

    const fetchData = async () => {
      const { data } = await supabase.from('products').select('*')
      setProducts(data || [])
    }

    fetchData()
  }, [])

  const handleLogout = () => {
    clearUserSession()
    router.push('/login')
  }

  function formatRupiah(value: number | string) {
    const number = typeof value === 'string' ? parseInt(value) : value
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number)
  }


  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-500">
      <div className="bg-white backdrop-blur-md p-6 rounded-2xl shadow-2xl max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-purple-600">Welcome, {username}</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
          >
            Logout
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="min-w-full text-sm text-gray-800 bg-white border border-gray-300 rounded-xl">
            <thead className="bg-purple-100 text-purple-800 text-left">
              <tr>
                <th className="px-4 py-3">Nama Produk</th>
                <th className="px-4 py-3">Harga</th>
                <th className="px-4 py-3">Qty</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr
                  key={prod.id}
                  className="border-t hover:bg-purple-50 transition duration-150 ease-in-out"
                >
                  <td className="px-4 py-2">{prod.nama_produk}</td>
                  <td className="px-4 py-2">{formatRupiah(prod.harga_satuan)}</td>
                  <td className="px-4 py-2">{prod.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
