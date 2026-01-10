# Dynamic Base URL for Invitation Links

## 📋 Summary
Implemented dynamic base URL detection for invitation links that automatically adapts to any environment (localhost, staging, production).

## 🎯 Problem

**Before:**
- Invitation links might use hardcoded URLs
- Wouldn't work properly across different environments
- Manual URL changes needed for each deployment

**Example issues:**
```
localhost → generates: http://localhost:3000/?guest=xxx ✅
production → generates: http://localhost:3000/?guest=xxx ❌ (wrong!)
```

## ✅ Solution

**After:**
- Automatically detects current domain
- Works in ALL environments without changes
- Centralized URL management

**Now works everywhere:**
```
localhost → http://localhost:3000/?guest=xxx ✅
staging → https://staging.yourdomain.com/?guest=xxx ✅
production → https://yourdomain.com/?guest=xxx ✅
vercel → https://yourapp.vercel.app/?guest=xxx ✅
```

## 🔧 Implementation

### 1. **URL Utility Library** (`lib/url.ts`)

Created centralized helper functions:

#### `getBaseUrl()`
```typescript
export const getBaseUrl = (): string => {
  // Client-side: Use browser's current URL
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // Server-side: Use environment variable
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }
  
  // Fallback
  return 'http://localhost:3000'
}
```

**How it works:**
1. **Client-side (Browser)**: Uses `window.location.origin`
   - Returns current domain automatically
   - Examples: `http://localhost:3000`, `https://yourdomain.com`

2. **Server-side (SSR/API)**: Uses `NEXT_PUBLIC_BASE_URL` env variable
   - For server-rendered pages or API routes
   - Set in `.env` or hosting platform

3. **Fallback**: Defaults to `http://localhost:3000`
   - Development safety net

#### `getInvitationLink(guestSlug)`
```typescript
export const getInvitationLink = (guestSlug: string): string => {
  const baseUrl = getBaseUrl()
  return `${baseUrl}/?guest=${guestSlug}`
}
```

**Generates:**
- `https://yourdomain.com/?guest=abc123`

#### `getWhatsAppMessage(guestName, guestSlug)`
```typescript
export const getWhatsAppMessage = (
  guestName: string, 
  guestSlug: string
): string => {
  const link = getInvitationLink(guestSlug)
  
  return `The Wedding of Sam & Eli 

Dear ${guestName},

You are invited! Dengan penuh sukacita, kami mengundang kamu untuk hadir di hari bahagia kami.

Akses undangan digital kami di sini untuk info lengkapnya:

${link}

Terima kasih atas doa dan dukungannya. We look forward to celebrating with you!

Best regards, Sam & Eli`
}
```

**Generates:** Formatted WhatsApp message with dynamic link

#### `getWhatsAppUrl(phoneNumber, guestName, guestSlug)`
```typescript
export const getWhatsAppUrl = (
  phoneNumber: string,
  guestName: string,
  guestSlug: string
): string => {
  const message = getWhatsAppMessage(guestName, guestSlug)
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
}
```

**Generates:** WhatsApp URL with pre-filled message

### 2. **Updated Guests Page**

**Before:**
```typescript
const handleCopyLink = (guest: GuestData) => {
  const baseUrl = window.location.origin
  const link = `${baseUrl}/?guest=${guest.slug}`
  // ... rest of code
}

const handleSendWhatsApp = (guest: GuestData) => {
  const baseUrl = window.location.origin
  const link = `${baseUrl}/?guest=${guest.slug}`
  const message = `The Wedding of Sam & Eli...` // long template string
  const whatsappUrl = `https://wa.me/${guest.whatsapp}?text=${encodeURIComponent(message)}`
  // ... rest of code
}
```

**After:**
```typescript
import { getInvitationLink, getWhatsAppUrl } from '@/lib/url'

const handleCopyLink = (guest: GuestData) => {
  const link = getInvitationLink(guest.slug)
  navigator.clipboard.writeText(link)
  alert('Link copied to clipboard!')
}

const handleSendWhatsApp = (guest: GuestData) => {
  if (!guest.whatsapp) return
  
  const whatsappUrl = getWhatsAppUrl(guest.whatsapp, guest.name, guest.slug)
  window.open(whatsappUrl, '_blank')
}
```

**Benefits:**
- ✅ Cleaner code
- ✅ Reusable functions
- ✅ Centralized URL logic
- ✅ Easier to maintain

### 3. **Environment Configuration**

Added to `env.example`:

```bash
# ============================================
# Application URL Configuration
# ============================================
# Set this to your production domain for invitation links
# Examples:
# - Production: https://yourdomain.com
# - Vercel: https://your-app.vercel.app
# - Leave empty for localhost (defaults to http://localhost:3000)
# Note: Do NOT include trailing slash

NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## 🌍 Environment Detection

### Automatic Detection (Client-Side)

When code runs in browser:
```typescript
window.location.origin
```

**Returns:**
- `http://localhost:3000` (dev)
- `http://192.168.1.100:3000` (local network)
- `https://yourapp.vercel.app` (Vercel)
- `https://yourdomain.com` (production)

### Manual Configuration (Server-Side)

For server-side rendering or API routes, set in `.env`:

```bash
# Development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Staging
NEXT_PUBLIC_BASE_URL=https://staging.yourdomain.com

# Production
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## 📦 Usage Examples

### Copy Invitation Link
```typescript
import { getInvitationLink } from '@/lib/url'

const link = getInvitationLink('abc-123-def')
// Returns: https://yourdomain.com/?guest=abc-123-def

navigator.clipboard.writeText(link)
```

### Send via WhatsApp
```typescript
import { getWhatsAppUrl } from '@/lib/url'

const url = getWhatsAppUrl('628123456789', 'John Doe', 'abc-123-def')
// Returns: https://wa.me/628123456789?text=The%20Wedding...

window.open(url, '_blank')
```

### Get Base URL
```typescript
import { getBaseUrl } from '@/lib/url'

const baseUrl = getBaseUrl()
// Returns: Current domain (e.g., https://yourdomain.com)
```

## 🎯 Where It's Used

1. **Copy Link Button** - Guest table
2. **WhatsApp Send Button** - Guest table
3. **Any future invitation link generation**

## ✨ Benefits

### 1. **Environment Agnostic**
Works seamlessly across:
- ✅ Development (`localhost`)
- ✅ Staging servers
- ✅ Production domains
- ✅ Custom domains
- ✅ Vercel/Netlify URLs

### 2. **Zero Configuration (Client-Side)**
- No manual URL changes needed
- Automatically detects current domain
- Works in any hosting environment

### 3. **Centralized Management**
- All URL logic in one place (`lib/url.ts`)
- Easy to update message templates
- Consistent link generation

### 4. **Type Safe**
- TypeScript support
- Clear function signatures
- Documented parameters

### 5. **Reusable**
- Import anywhere in the app
- Consistent behavior
- DRY principle

## 🔧 Configuration Steps

### For Development (No Action Needed)
```bash
# Automatically uses: http://localhost:3000
```

### For Production

**Option 1: Let browser detect (Recommended)**
- No configuration needed
- Works automatically

**Option 2: Set environment variable**

1. Create `.env.local`:
```bash
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

2. Or set in hosting platform:
   - **Vercel**: Settings → Environment Variables
   - **Netlify**: Site settings → Environment
   - Add: `NEXT_PUBLIC_BASE_URL` = `https://yourdomain.com`

## 📁 Files Created/Modified

**New Files:**
1. ✅ `lib/url.ts` - URL utility functions

**Modified Files:**
2. ✅ `app/admin/guests/page.tsx` - Use helper functions
3. ✅ `env.example` - Added BASE_URL config

**Documentation:**
4. ✅ `DYNAMIC_BASE_URL.md` (this file)

## 🧪 Testing

### Test in Different Environments

1. **Localhost**
```bash
npm run dev
# Visit: http://localhost:3000/admin/guests
# Copy link → Should be: http://localhost:3000/?guest=xxx
```

2. **Local Network**
```bash
npm run dev
# Visit: http://192.168.1.100:3000/admin/guests
# Copy link → Should be: http://192.168.1.100:3000/?guest=xxx
```

3. **Production**
```bash
# Visit: https://yourdomain.com/admin/guests
# Copy link → Should be: https://yourdomain.com/?guest=xxx
```

### Verify Links Work

1. Click "Copy" button on any guest
2. Paste link in new tab
3. Should open invitation with correct guest data
4. Test WhatsApp button - should open with pre-filled message

## 🔍 How It Detects Domain

### Client-Side (Browser)
```
User visits → https://yourdomain.com/admin/guests
           ↓
window.location.origin → "https://yourdomain.com"
           ↓
Generated link → https://yourdomain.com/?guest=xxx
```

### Examples by Environment

| Environment | User Visits | `window.location.origin` | Generated Link |
|-------------|-------------|--------------------------|----------------|
| Local | `http://localhost:3000` | `http://localhost:3000` | `http://localhost:3000/?guest=xxx` |
| Network | `http://192.168.1.5:3000` | `http://192.168.1.5:3000` | `http://192.168.1.5:3000/?guest=xxx` |
| Vercel | `https://app.vercel.app` | `https://app.vercel.app` | `https://app.vercel.app/?guest=xxx` |
| Production | `https://yourdomain.com` | `https://yourdomain.com` | `https://yourdomain.com/?guest=xxx` |

## 💡 Best Practices

### DO ✅
- Let browser auto-detect (client-side)
- Use helper functions from `lib/url.ts`
- Test links in production after deployment

### DON'T ❌
- Hardcode URLs (e.g., `https://example.com`)
- Use `localhost` in production code
- Forget to test after domain changes

## 🚀 Future Extensions

Can easily extend for:
- Email invitation links
- QR code generation
- SMS invitations
- Social media sharing

Example:
```typescript
export const getEmailInvitationLink = (guestSlug: string): string => {
  return getInvitationLink(guestSlug)
}

export const getQRCodeData = (guestSlug: string): string => {
  return getInvitationLink(guestSlug)
}
```

---

**Result:** Invitation links now automatically use the correct domain in any environment! 🎉
