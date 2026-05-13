'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Item } from '@/types/database'
import { Search, X } from 'lucide-react'

export default function BrowsePage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'lost' | 'found'>('all')
  const [claimModal, setClaimModal] = useState<{ show: boolean; item: Item | null }>({ show: false, item: null })
  const [claimMessage, setClaimMessage] = useState('')
  const [user, setUser] = useState<any>(null)
  
  const supabase = createClient()

  useEffect(() => {
    fetchItems()
    getUser()
  }, [])

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const fetchItems = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('items')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (data) setItems(data)
    setLoading(false)
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || item.type === selectedType
    return matchesSearch && matchesType
  })

  const handleClaim = async () => {
    if (!user) {
      alert('Please sign in to claim items')
      return
    }
    if (!claimMessage.trim()) {
      alert('Please add a message')
      return
    }

    const { error } = await supabase.from('claims').insert({
      item_id: claimModal.item!.id,
      claimer_id: user.id,
      message: claimMessage,
      status: 'pending'
    })

    if (!error) {
      alert('Claim submitted! The poster will be notified.')
      setClaimModal({ show: false, item: null })
      setClaimMessage('')
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Items</h1>
          <p className="text-xl text-gray-600">Find your lost items or help others find theirs</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedType === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedType('lost')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedType === 'lost'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Lost
              </button>
              <button
                onClick={() => setSelectedType('found')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedType === 'found'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Found
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl">
            <p className="text-gray-600 text-lg">No items found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
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
                    <span className="text-sm text-gray-500">{item.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                  <div className="text-sm text-gray-500 mb-4">
                    <p>📍 {item.location}</p>
                    <p>📅 {new Date(item.date_occurred).toLocaleDateString()}</p>
                  </div>
                  
                  {user && user.id !== item.user_id && (
                    <button
                      onClick={() => setClaimModal({ show: true, item })}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                    >
                      {item.type === 'lost' ? 'I Found This!' : 'This Is Mine!'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {claimModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Claim Item</h2>
              <button onClick={() => setClaimModal({ show: false, item: null })}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">{claimModal.item?.title}</h3>
              <p className="text-gray-600 mb-4">
                Tell the poster why you think this is yours or provide details about when you found it.
              </p>
              <textarea
                value={claimMessage}
                onChange={(e) => setClaimMessage(e.target.value)}
                placeholder="I lost this wallet on Tuesday near the library entrance. It has my student ID inside..."
                rows={4}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setClaimModal({ show: false, item: null })}
                className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClaim}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Submit Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
