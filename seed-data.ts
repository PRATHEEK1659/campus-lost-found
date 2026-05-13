import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://cjtsdqsegejffgjdvbhz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqdHNkcXNlZ2VqZmZnamR2Ymh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NjQxNzMsImV4cCI6MjA5NDI0MDE3M30.bWwpIV2dR3L9Y7gnCZDX3VVnYWMJye45M_ZI2iM6pSk'
)

async function seed() {
  // Get your user ID first
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    console.log('Please sign in first!')
    return
  }

  const sampleItems = [
    {
      user_id: user.id,
      type: 'lost',
      title: 'iPhone 13 Pro',
      description: 'Black iPhone with cracked screen protector',
      category: 'phone',
      location: 'Student Center Cafeteria',
      date_occurred: '2026-05-10',
      status: 'open'
    },
    {
      user_id: user.id,
      type: 'found',
      title: 'Student ID Card',
      description: 'ID card with name starting with J',
      category: 'id_card',
      location: 'Library 3rd Floor',
      date_occurred: '2026-05-11',
      status: 'open'
    },
    {
      user_id: user.id,
      type: 'lost',
      title: 'Blue Backpack',
      description: 'Nike backpack with laptop inside',
      category: 'bag',
      location: 'Parking Lot B',
      date_occurred: '2026-05-09',
      status: 'open'
    },
    {
      user_id: user.id,
      type: 'found',
      title: 'Car Keys',
      description: 'Toyota keys with red keychain',
      category: 'keys',
      location: 'Gym Locker Room',
      date_occurred: '2026-05-12',
      status: 'open'
    },
    {
      user_id: user.id,
      type: 'lost',
      title: 'MacBook Pro',
      description: '15 inch MacBook with stickers',
      category: 'laptop',
      location: 'Engineering Building Room 204',
      date_occurred: '2026-05-08',
      status: 'open'
    },
    {
      user_id: user.id,
      type: 'found',
      title: 'Brown Leather Wallet',
      description: 'Contains cash and credit cards',
      category: 'wallet',
      location: 'Main Gate',
      date_occurred: '2026-05-13',
      status: 'open'
    }
  ]

  const { data, error } = await supabase.from('items').insert(sampleItems)
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('✅ Successfully added 6 sample items!')
  }
}

seed()
