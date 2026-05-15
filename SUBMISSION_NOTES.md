# Submission Notes

## Known Issues

### Current Bugs
- **Claim notifications**: Users don't get notified when items are claimed - must manually check My Items
- **Rate limiting**: No protection against spam claims
- **Image validation**: Accepts any file type, should restrict to images only
- **Claim message validation**: No minimum character requirement

### Edge Cases Not Handled
- **Simultaneous approvals**: No locking mechanism if owner approves multiple claims at once
- **Deleted users**: Claims orphan if user deletes account
- **Old items**: No auto-archival of items from months/years ago

### What I Would Fix First
1. Email notifications via SendGrid when claims submitted
2. Rate limiting - max 3 active claims per user
3. Reporting system for fake posts
4. Claim message quality - enforce 20-character minimum

## Testing Notes
- **Tested on**: Chrome, Safari (mobile), Firefox
- **Performance**: Sub-second page loads on Vercel
- **Mobile**: Fully responsive

## What Evaluators Should Know
- **Live site**: https://campus-lost-found-indol.vercel.app
- **Test accounts**: Create any email/password (no verification)
- **Seeded data**: 6 sample items for demo
- **Best tested**: Two browser windows to simulate two users
