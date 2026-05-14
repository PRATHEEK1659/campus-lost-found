# Decisions Log - Campus Lost & Found

## Assumptions I made

1. **Students have email addresses** - Used email/password auth instead of phone numbers, assuming college emails are universal
2. **One photo sufficient** - Assumed single image captures enough detail vs. complexity of multi-upload UI
3. **Manual approval is acceptable** - Didn't automate matching because false positives would be worse than manual review
4. **Postgres over NoSQL** - Assumed relational data (items → claims → users) needs referential integrity
5. **Public browsing allowed** - Anyone can view items without login, only claiming requires auth (lowers barrier to reunion)

## Trade-offs

| Choice | Alternative | Why I picked this |
|--------|-------------|-------------------|
| **Supabase** | Custom Express + Postgres | Zero backend code, instant auth/storage/database in one SDK. 80% faster development. |
| **Email/password auth** | Magic links, OAuth | Simpler UX than OAuth, more reliable than magic links (no email delivery issues in demo). |
| **Manual claim approval** | Automatic matching | Manual approval gives control to owners, prevents false positives, builds trust. |
| **Single photo upload** | Multiple images | Reduced complexity for MVP, most items identifiable from one good photo. |
| **Client-side filtering** | Server-side search | Faster UX for small datasets (<100 items), simpler code, still scalable to server-side later. |
| **Tailwind CSS** | Custom CSS/Styled Components | Rapid prototyping, consistent design system, smaller bundle size. |

## What I de-scoped and why

- **Email notifications** - Would need SendGrid/Resend integration + template design. Core flow works without it; can add post-MVP.
- **Image similarity matching** - Perceptual hashing (pHash/ImageHash) would take 3+ hours to implement properly. Manual browse + text search is 80% effective in 20% of time.
- **In-app chat** - Would require WebSocket infrastructure (Pusher/Ably) or long-polling. Contact info sharing via approved claims is sufficient for v1.
- **Admin dashboard** - Not in requirements. Trust + reporting system would be needed for production but not demo.

## What I'd do differently with another day

- **Add image similarity suggestions** - When posting a lost item, scan found items and suggest visual matches using pHash
- **Implement claim notifications** - Email + in-app alerts when items are claimed
- **Build mobile apps** - React Native with 80% code reuse from web
- **Add geolocation** - Auto-suggest location based on user's current position
- **Create matching algorithm** - Score items based on category + location + date proximity and surface likely matches

## Technical decisions worth highlighting

**Database schema:** Used PostgreSQL with Row Level Security instead of API middleware for auth. RLS policies enforce "users can only update their own items" at database level, preventing auth bypass bugs.

**File storage:** Supabase Storage with public bucket for images. Decided against CDN (Cloudinary) to keep stack simple, though would add in production for optimization.

**State management:** React hooks (useState/useEffect) instead of Redux/Zustand. App state is simple enough that prop drilling isn't an issue; adding global state would be premature optimization.

**Claim flow UX:** Chose modal popup for claims instead of separate page to reduce friction. User stays in browse context, sees item while writing claim message.

**Session handling:** Used Supabase SSR package with middleware for proper cookie management across client/server components, avoiding common Next.js 14 App Router auth pitfalls.
