# Settings Management Feature

## 📋 Summary
Created a settings management system with database storage for customizable WhatsApp invitation message template.

## ✨ Features

### 1. **Settings Database**
New Firestore collection: `settings`

**Structure:**
```typescript
{
  id: string,              // Document ID (same as key)
  key: string,             // Setting identifier (e.g., "whatsapp_message")
  value: string,           // Setting value (the message template)
  description: string,     // Optional description
  updatedAt: Timestamp    // Last update time
}
```

### 2. **Admin Settings Page**
New admin menu: `/admin/settings`

**Features:**
- ✅ Edit WhatsApp message template
- ✅ Placeholder support: `{name}` and `{link}`
- ✅ Quick insert buttons for placeholders
- ✅ Live character count
- ✅ Preview with sample data
- ✅ Save/Reset functionality
- ✅ Default template included

### 3. **Dynamic Message Template**
Messages now pulled from database instead of hardcoded.

**Flow:**
```
Admin edits template → Saves to DB → Used in WhatsApp invitations
```

## 🎯 How It Works

### Template Placeholders

**Available Placeholders:**
- `{name}` - Replaced with guest's name
- `{link}` - Replaced with invitation link

**Example Template:**
```
The Wedding of Sam & Eli 

Dear {name},

You are invited! Dengan penuh sukacita, kami mengundang kamu untuk hadir di hari bahagia kami.

Akses undangan digital kami di sini untuk info lengkapnya:

{link}

Terima kasih atas doa dan dukungannya. We look forward to celebrating with you!

Best regards, Sam & Eli
```

**Result for John Doe:**
```
The Wedding of Sam & Eli 

Dear John Doe,

You are invited! Dengan penuh sukacita, kami mengundang kamu untuk hadir di hari bahagia kami.

Akses undangan digital kami di sini untuk info lengkapnya:

https://yourdomain.com/?guest=abc-123

Terima kasih atas doa dan dukungannya. We look forward to celebrating with you!

Best regards, Sam & Eli
```

## 🔧 Implementation

### 1. **Types** (`types/index.ts`)

```typescript
export interface SettingsData {
  id?: string
  key: string
  value: string
  description?: string
  updatedAt?: Timestamp | Date
}

export interface InvitationMessageSettings {
  whatsappMessage: string
}
```

### 2. **API Routes**

#### `POST /api/admin/settings`
Save or update a setting

**Request:**
```json
{
  "key": "whatsapp_message",
  "value": "Template text with {name} and {link}",
  "description": "WhatsApp invitation message template"
}
```

**Response:**
```json
{
  "message": "Setting updated successfully",
  "key": "whatsapp_message",
  "value": "..."
}
```

#### `GET /api/admin/settings/[key]`
Fetch a specific setting

**Example:** `GET /api/admin/settings/whatsapp_message`

**Response:**
```json
{
  "id": "whatsapp_message",
  "key": "whatsapp_message",
  "value": "Template text...",
  "description": "WhatsApp invitation message template",
  "updatedAt": {...}
}
```

### 3. **Updated URL Helper** (`lib/url.ts`)

**Before:**
```typescript
export const getWhatsAppMessage = (
  guestName: string, 
  guestSlug: string
): string => {
  // Hardcoded template
  return `The Wedding of Sam & Eli...`
}
```

**After:**
```typescript
export const getWhatsAppMessage = (
  guestName: string, 
  guestSlug: string,
  customTemplate?: string  // ← New parameter
): string => {
  const link = getInvitationLink(guestSlug)
  
  // Use custom template if provided
  if (customTemplate) {
    return customTemplate
      .replaceAll('{name}', guestName)
      .replaceAll('{link}', link)
  }
  
  // Fallback to default
  return getDefaultWhatsAppMessageTemplate(guestName, link)
}
```

### 4. **Guests Page Integration**

**Fetches template on load:**
```typescript
const [whatsappMessageTemplate, setWhatsappMessageTemplate] = useState<string | undefined>()

useEffect(() => {
  fetchGuests()
  fetchWhatsAppMessageTemplate()  // ← Fetch custom template
}, [])

const fetchWhatsAppMessageTemplate = async () => {
  try {
    const response = await fetch('/api/admin/settings/whatsapp_message')
    if (response.ok) {
      const data = await response.json()
      setWhatsappMessageTemplate(data.value)
    }
  } catch (error) {
    console.error('Error fetching WhatsApp template:', error)
  }
}
```

**Uses template when sending:**
```typescript
const handleSendWhatsApp = (guest: GuestData) => {
  const whatsappUrl = getWhatsAppUrl(
    guest.whatsapp, 
    guest.name, 
    guest.slug, 
    whatsappMessageTemplate  // ← Pass custom template
  )
  window.open(whatsappUrl, '_blank')
}
```

## 📁 Files Created/Modified

### New Files:
1. ✅ `app/admin/settings/page.tsx` - Settings management page
2. ✅ `app/api/admin/settings/route.ts` - Settings API (GET all, POST save)
3. ✅ `app/api/admin/settings/[key]/route.ts` - Get specific setting

### Modified Files:
4. ✅ `types/index.ts` - Added `SettingsData` interface
5. ✅ `lib/url.ts` - Support for custom templates
6. ✅ `components/admin/AdminNav.tsx` - Added Settings menu
7. ✅ `app/admin/guests/page.tsx` - Fetch & use custom template

## 🎨 Settings Page UI

### Header Section
```
┌─────────────────────────────────────┐
│ Settings                            │
│ Manage application settings         │
└─────────────────────────────────────┘
```

### Settings Card
```
┌─────────────────────────────────────────────────┐
│ [⚙️] WhatsApp Invitation Message               │
│     Customize the message template sent via WA  │
├─────────────────────────────────────────────────┤
│ ℹ️ Available Placeholders:                     │
│   {name} - Guest's name                         │
│   {link} - Invitation link                      │
│                                                 │
│ [Insert {name}] [Insert {link}]                │
│                                                 │
│ ┌─────────────────────────────────────────┐   │
│ │ Textarea with template                  │   │
│ │ (12 rows, monospace font)               │   │
│ └─────────────────────────────────────────┘   │
│ 245 characters                                  │
│                                                 │
│ [💾 Save Changes] [Reset to Default]          │
└─────────────────────────────────────────────────┘
```

### Preview Section
```
┌─────────────────────────────────────┐
│ Preview                             │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ The Wedding of Sam & Eli        │ │
│ │                                 │ │
│ │ Dear John Doe,                  │ │
│ │ ...                             │ │
│ └─────────────────────────────────┘ │
│ Preview with sample data            │
└─────────────────────────────────────┘
```

## 🎯 User Flow

### 1. Edit Template
```
Admin → Settings → Edit message → Click "Insert {name}" → Edit more → Save
```

### 2. Template Usage
```
Guest page → Click WhatsApp button → Opens WA with custom message
```

### 3. Fallback Behavior
```
If no custom template → Use default template
If DB error → Use default template
Always works! ✅
```

## ✨ Features Breakdown

### Quick Insert Buttons
- Click "Insert {name}" or "Insert {link}"
- Inserts at cursor position
- Maintains cursor position after insert
- Makes editing easier

### Live Character Count
- Shows character count as you type
- Helps manage message length
- WhatsApp has limits (~4096 chars)

### Preview
- Shows how message looks with real data
- Sample: John Doe + sample link
- Updates as you edit
- Instant feedback

### Reset Function
- One-click reset to default
- Confirmation dialog
- Prevents accidental loss

### Save Feedback
- Success message (green)
- Error message (red)
- Auto-dismiss after 3 seconds
- Loading state on button

## 🔄 Message Flow

```
┌────────────────────────┐
│ Admin edits template   │
│ in Settings page       │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ Saves to Firestore     │
│ collection: settings   │
│ key: whatsapp_message  │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ Guests page fetches    │
│ template on load       │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ User clicks WhatsApp   │
│ button for guest       │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ Generate message with  │
│ custom template        │
│ Replace {name} {link}  │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ Open WhatsApp with     │
│ personalized message   │
└────────────────────────┘
```

## 💡 Usage Examples

### Customize Message
1. Go to `/admin/settings`
2. Edit the WhatsApp message template
3. Use `{name}` where you want guest's name
4. Use `{link}` where you want invitation link
5. Click "Save Changes"

### Use Different Languages
```
Undangan Pernikahan Sam & Eli

Yth. {name},

Kami mengundang Anda untuk hadir di pernikahan kami.

Link undangan: {link}

Terima kasih!
```

### Shorter Template
```
Hi {name}! 

You're invited to Sam & Eli's wedding! 🎉

Details: {link}

See you there!
```

### Formal Template
```
Dear {name},

We cordially invite you to the wedding celebration of Sam & Eli.

Please RSVP via: {link}

With warm regards,
The Wedding Committee
```

## 🔒 Security & Best Practices

### Validation
- ✅ Required fields checked
- ✅ Key must be provided
- ✅ Value must be provided
- ✅ Description is optional

### Database
- ✅ Uses Firestore merge for updates
- ✅ Timestamps automatically added
- ✅ Key as document ID (easy lookup)

### Fallback
- ✅ Always has default template
- ✅ Works even if DB fails
- ✅ No breaking errors

### Client-Side
- ✅ Loading states
- ✅ Error handling
- ✅ Success feedback
- ✅ Confirmation for reset

## 🚀 Future Enhancements

Possible additions:
- Email templates
- SMS templates
- Multiple language templates
- Template variables (date, time, venue)
- Template preview with actual guest data
- Template history/versioning
- Rich text editor
- Template categories

## 📊 Database Structure

### Firestore Collection: `settings`

```
settings/
├── whatsapp_message
│   ├── key: "whatsapp_message"
│   ├── value: "Template text with {name} and {link}..."
│   ├── description: "WhatsApp invitation message template"
│   └── updatedAt: Timestamp(...)
│
└── [future settings]
    ├── email_template
    ├── sms_template
    └── etc...
```

## ✅ Checklist

- ✅ Settings database schema defined
- ✅ Settings API routes created
- ✅ Settings admin page built
- ✅ Template placeholders implemented
- ✅ Quick insert buttons added
- ✅ Preview functionality working
- ✅ Save/Reset functions working
- ✅ URL helpers updated
- ✅ Guests page integrated
- ✅ Admin nav menu updated
- ✅ Default template provided
- ✅ Fallback mechanism in place
- ✅ No linting errors

---

**Result:** WhatsApp invitation messages are now fully customizable through the admin settings page! 🎉⚙️
