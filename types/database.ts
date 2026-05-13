export type Item = {
  id: string
  user_id: string
  type: 'lost' | 'found'
  title: string
  description: string | null
  category: 'wallet' | 'id_card' | 'phone' | 'keys' | 'bag' | 'laptop' | 'other'
  location: string
  date_occurred: string
  image_url: string | null
  status: 'open' | 'claimed' | 'resolved'
  contact_info: string | null
  created_at: string
  updated_at: string
}

export type Claim = {
  id: string
  item_id: string
  claimer_id: string
  message: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
  created_at: string
}
