# Campus Lost & Found Portal

**Live Demo:** https://campus-lost-found-indol.vercel.app  
**GitHub Repo:** https://github.com/PRATHEEK1659/campus-lost-found  
**Demo Video:** [Add Loom/YouTube link here after recording]

## What this is

A web application for college students to post lost and found items with photos, search and filter by category/type, claim items, and connect with each other to reunite lost belongings with their owners. Built with Instagram-level UX polish per the brief requirement.

## How to run locally

1. Clone the repository:
```bash
   git clone https://github.com/PRATHEEK1659/campus-lost-found.git
   cd campus-lost-found
```

2. Install dependencies:
```bash
   npm install
```

3. Create `.env.local` file with Supabase credentials:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

4. Run the development server:
```bash
   npm run dev
```

5. Open http://localhost:3000

## Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS - for fast development, built-in routing, and modern React patterns
- **Backend:** Supabase (PostgreSQL + Auth + Storage) - complete backend in one SDK, zero API code needed
- **Deployment:** Vercel - seamless Next.js deployment with auto-deploy from GitHub
- **Icons:** Lucide React - lightweight, consistent icon set

## Key Features

✅ **Post Lost/Found Items** with photo upload, category, location, and date  
✅ **Browse & Search** with filters (All/Lost/Found) and text search  
✅ **Claim System** - users can claim items with messages, owners approve/reject  
✅ **Authentication** - email/password auth with session management  
✅ **My Items Dashboard** - manage your posts, see claims, approve connections  
✅ **Status Management** - mark items as resolved when reunited  
✅ **Mobile Responsive** - works seamlessly on all devices  

## What's NOT done

- **Email notifications** - Planned for v2 when matches/claims occur
- **Image similarity matching** - Would use perceptual hashing (pHash library) for automated matching suggestions
- **In-app messaging** - Currently users approve claims and share contact info; real-time chat would enhance privacy
- **Multiple image uploads** - Limited to one photo per item for MVP scope

## In production, I would also add

- **Rate limiting** on posting to prevent spam (using Upstash Redis)
- **Image optimization** with sharp/next-image automatic compression
- **Advanced search** with date range, distance radius, and combined filters
- **Analytics dashboard** to track reunion success rates and user engagement
- **Reporting system** for inappropriate content with admin moderation queue
- **Push notifications** via Firebase Cloud Messaging for mobile users
