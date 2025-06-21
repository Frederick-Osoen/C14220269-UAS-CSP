export type Role = 'user' | 'admin'

export type User = {
  id: number
  username: string
  password: string
  role: Role
}

export type Product = {
  id: number
  nama_produk: string
  harga_satuan: number
  quantity: number
  user_id?: number | null
}