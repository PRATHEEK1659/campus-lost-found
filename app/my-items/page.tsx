'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Item } from '@/types/database'
import { useRouter } from 'next/navigation'

export default function MyItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchMyItems()
  }, [])

  const fetchMyItems = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth')
      return
    }

    const { data } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) setItems(data)
    setLoading(false)
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this item?')) return
    
    await supabase.from('items').delete().eq('id', id)
    setItems(items.filter(item => item.id !== id))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Items</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <p className="text-gray-600 text-lg mb-4">You haven't posted any items yet.</p>
            <button
              onClick={() => router.push('/post')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
              Post Your First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {item.image_url && (
                  <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {item.type.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      item.status === 'open' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    <p>📍 {item.location}</p>
                    <p>📅 {new Date(item.date_occurred).toLocaleDateString()}</p>
                  </div>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
