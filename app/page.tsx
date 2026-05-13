import Link from 'next/link'
import { Search, Package, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              <span className="block text-gray-900">Lost something?</span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                We'll help you find it.
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
              Your campus lost & found portal. Post lost items, find what's been found, 
              and reunite with your belongings.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/browse" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-2xl transition-all text-lg font-semibold">
                Browse Lost Items
              </Link>
              <Link href="/auth" className="px-8 py-4 bg-white text-gray-900 rounded-xl border-2 border-gray-200 hover:border-blue-600 transition-all text-lg font-semibold">
                Post an Item
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Post Your Item</h3>
              <p className="text-gray-600">Lost or found something? Post it with a photo, description, and location.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6">
                <Search className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Browse & Match</h3>
              <p className="text-gray-600">Our smart matching suggests items that might be yours based on category, date, and location.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Get Reunited</h3>
              <p className="text-gray-600">Claim your item and connect with the finder to arrange pickup.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to find your lost item?</h2>
            <p className="text-blue-100 text-lg mb-8">Join hundreds of students who've been reunited with their belongings.</p>
            <Link href="/auth" className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl hover:shadow-2xl transition-all text-lg font-semibold">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
