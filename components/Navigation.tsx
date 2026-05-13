'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { LogOut, Plus, Search, User as UserIcon } from 'lucide-react'

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
  const getUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user ?? null)
    setLoading(false)
  }
  getUser()

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null)
    setLoading(false)
  })

  return () => subscription.unsubscribe()
}, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return <nav className="bg-white shadow-sm border-b border-gray-200 h-16" />
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Campus Lost & Found
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/browse" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Browse</span>
                </Link>
                
                <Link href="/post" className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
                  <Plus className="w-4 h-4" />
                  <span>Post Item</span>
                </Link>

                <Link href="/my-items" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">My Items</span>
                </Link>

                <button onClick={handleSignOut} className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/browse" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Browse
                </Link>
                <Link href="/auth" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
