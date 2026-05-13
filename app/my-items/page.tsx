'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Item } from '@/types/database'
import { useRouter } from 'next/navigation'

type ClaimWithProfile = {
  id: string
  message: string
  status: string
  created_at: string
  claimer_id: string
  profiles: { email: string }
}

export default function MyItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [claims, setClaims] = useState<Record<string, ClaimWithProfile[]>>({})
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

    const { data: itemsData } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (itemsData) {
      setItems(itemsData)
      
      // Fetch claims for each item
      for (const item of itemsData) {
        const { data: claimsData } = await supabase
          .from('claims')
          .select('*')
          .eq('item_id', item.id)
          .order('created_at', { ascending: false })
        
        if (claimsData) {
          setClaims(prev => ({ ...prev, [item.id]: claimsData }))
        }
      }
    }
    setLoading(false)
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this item?')) return
    await supabase.from('items').delete().eq('id', id)
    setItems(items.filter(item => item.id !== id))
  }

  const updateClaimStatus = async (claimId: string, status: 'approved' | 'rejected', itemId: string) => {
    await supabase.from('claims').update({ status }).eq('id', claimId)
    
    if (status === 'approved') {
      await supabase.from('items').update({ status: 'resolved' }).eq('id', itemId)
    }
    
    fetchMyItems()
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
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex gap-6">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.title} className="w-32 h-32 object-cover rounded-lg" />
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
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
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-3">{item.description}</p>
                        <div className="text-sm text-gray-500">
                          <p>📍 {item.location}</p>
                          <p>📅 {new Date(item.date_occurred).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            await supabase.from('items').update({ status: 'resolved' }).eq('id', item.id)
                            fetchMyItems()
                          }}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                        >
                          ✓ Resolved
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Claims Section */}
                    {claims[item.id] && claims[item.id].length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-semibold text-lg mb-4">
                          Claims ({claims[item.id].length})
                        </h4>
                        <div className="space-y-3">
                          {claims[item.id].map((claim) => (
                            <div key={claim.id} className="bg-gray-50 p-4 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="text-sm text-gray-600 mb-1">From: User {claim.claimer_id.slice(0, 8)}...</p>
                                  <p className="text-gray-800">{claim.message}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  claim.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                  claim.status === 'approved' ? 'bg-green-100 text-green-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {claim.status}
                                </span>
                              </div>
                              
                              {claim.status === 'pending' && (
                                <div className="flex gap-2 mt-3">
                                  <button
                                    onClick={() => updateClaimStatus(claim.id, 'approved', item.id)}
                                    className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => updateClaimStatus(claim.id, 'rejected', item.id)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
