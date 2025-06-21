'use client'

import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase/client'
import { Product } from '@/types/supabase'
import { getUserSession, clearUserSession } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState({ nama_produk: '', harga_satuan: '', quantity: '' })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [username, setUsername] = useState('')
  const router = useRouter()

  const fetchData = async () => {
    const { data } = await supabase.from('products').select('*')
    setProducts(data || [])
  }

  const handleLogout = () => {
    clearUserSession()
    router.push('/login')
  }

  const handleDelete = async (id: number) => {
    await supabase.from('products').delete().eq('id', id)
    fetchData()
  }

  const handleUpdate = async (id: number) => {
    const updated = products.find((p) => p.id === id)
    if (!updated) return
    await supabase
      .from('products')
      .update({
        nama_produk: updated.nama_produk,
        harga_satuan: updated.harga_satuan,
        quantity: updated.quantity,
      })
      .eq('id', id)
    setEditingId(null)
    fetchData()
  }

  const handleChange = (id: number, field: string, value: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    )
  }

  const handleAddProduct = async () => {
    if (!newProduct.nama_produk || !newProduct.harga_satuan || !newProduct.quantity) return
    await supabase.from('products').insert([{ ...newProduct }])
    setNewProduct({ nama_produk: '', harga_satuan: '', quantity: '' })
    fetchData()
  }

  useEffect(() => {
    const session = getUserSession()

    if (!session) {
      toast.error('Anda belum login!')
      router.push('/login')
      return
    }

    if (session.role !== 'admin') {
      toast.error("You don't have any access to admin page")
      router.push('/dashboard/user') // atau arahkan ke halaman umum
      return
    }

    setUsername(session.username)
    fetchData()
  }, [])

  function formatRupiah(value: number | string) {
    const number = typeof value === 'string' ? parseInt(value) : value
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number)
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400">
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

        {/* Add New Product */}
        <div className="mb-8 grid grid-cols-4 gap-4 text-gray-800">
          <input
            placeholder="Product Name"
            className="px-3 py-2 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={newProduct.nama_produk}
            onChange={(e) => setNewProduct({ ...newProduct, nama_produk: e.target.value })}
          />
          <input
            placeholder="Price"
            type="number"
            className="px-3 py-2 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={newProduct.harga_satuan}
            onChange={(e) => setNewProduct({ ...newProduct, harga_satuan: e.target.value })}
          />
          <input
            placeholder="Quantity"
            type="number"
            className="px-3 py-2 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
          />
          <button
            onClick={handleAddProduct}
            className="bg-green-500 text-white rounded-xl px-4 py-2 hover:bg-green-600 transition"
          >
            Add
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="min-w-full text-sm text-gray-800 bg-white border border-gray-300 rounded-xl">
            <thead className="bg-purple-100 text-purple-800 text-left">
              <tr>
                <th className="px-4 py-3">Nama Produk</th>
                <th className="px-4 py-3">Harga</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr
                  key={prod.id}
                  className="border-t hover:bg-purple-50 transition duration-150 ease-in-out"
                >
                  <td className="px-4 py-2">
                    {editingId === prod.id ? (
                      <input
                        value={prod.nama_produk}
                        onChange={(e) => handleChange(prod.id, 'nama_produk', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                    ) : (
                      prod.nama_produk
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingId === prod.id ? (
                      <input
                        type="number"
                        value={prod.harga_satuan}
                        onChange={(e) => handleChange(prod.id, 'harga_satuan', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                    ) : (
                      formatRupiah(prod.harga_satuan)
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingId === prod.id ? (
                      <input
                        type="number"
                        value={prod.quantity}
                        onChange={(e) => handleChange(prod.id, 'quantity', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                    ) : (
                      prod.quantity
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-3">
                    {editingId === prod.id ? (
                      <button
                        onClick={() => handleUpdate(prod.id)}
                        className="text-green-600 hover:underline"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditingId(prod.id)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(prod.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
