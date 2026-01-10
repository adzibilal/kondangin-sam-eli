# RSVP & Voice Wishes - Setup Guide

This project has been successfully configured to store RSVP and voice wishes data using Firebase Firestore and Cloudinary.

## 🎯 What Has Been Implemented

### 1. Database & Storage

- **Firebase Firestore** - NoSQL database for storing RSVP and wishes data
- **Cloudinary** - Cloud storage for audio files

### 2. Features Implemented

- ✅ Audio recording in browser using MediaRecorder API
- ✅ Upload audio to Cloudinary
- ✅ Save RSVP data to Firestore
- ✅ Save voice wishes to Firestore
- ✅ Real-time audio playback with progress bars
- ✅ Loading and error states
- ✅ Form validation
- ✅ Success notifications

### 3. Files Created

#### Configuration Files

- `lib/firebase.ts` - Firebase configuration and initialization
- `lib/cloudinary.ts` - Cloudinary helper functions

#### Type Definitions

- `types/index.ts` - TypeScript interfaces for RSVP and Wish data

#### API Routes

- `app/api/rsvp/route.ts` - POST endpoint for RSVP submissions
- `app/api/wishes/route.ts` - GET and POST endpoints for wishes
- `app/api/upload-audio/route.ts` - POST endpoint for audio uploads

#### Updated Components

- `components/sections/RSVPSection.tsx` - Now submits to Firebase
- `components/sections/WishesSection.tsx` - Recording, uploading, and playback

## 🔧 Setup Instructions

### Step 1: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing one)
3. Enable Firestore Database:
   - Go to "Firestore Database" in the sidebar
   - Click "Create database"
   - Choose "Start in production mode" (or test mode for development)
   - Select a location closest to your users

4. Get your Firebase configuration:
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click the web icon (</>)
   - Copy the configuration values

### Step 2: Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Go to Dashboard
4. Note your **Cloud Name**
5. Create an Upload Preset:
   - Go to Settings → Upload
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Set signing mode to "Unsigned"
   - Set folder to "voice-wishes" (optional)
   - Save and copy the preset name

### Step 3: Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Step 4: Install Dependencies

Dependencies have already been installed. If you need to reinstall:

```bash
npm install
```

### Step 5: Run the Development Server

```bash
npm run dev
```

## 📊 Database Structure

### Firestore Collections

#### `rsvps` Collection

```typescript
{
  id: string(auto - generated)
  name: string
  attendance: 'yes' | 'no'
  guestCount: number
  submittedAt: timestamp
  guestParam: string
}
```

#### `wishes` Collection

```typescript
{
  id: string (auto-generated)
  name: string
  audioUrl: string (Cloudinary URL)
  duration: string
  createdAt: timestamp
  guestParam: string
}
```

## 🎨 Features Overview

### RSVP Section

- Guests can confirm attendance (Yes/No)
- Guest name is auto-filled from URL parameter
- Data is saved to Firebase Firestore
- Loading states during submission
- Success and error notifications

### Voice Wishes Section

- Record voice messages directly in browser
- Preview recording before submitting
- Audio is uploaded to Cloudinary
- Wish data is saved to Firestore with audio URL
- Display all wishes with playback controls
- Real-time progress bars during playback
- Responsive design

## 🔐 Security Notes

1. **Firestore Security Rules**: Before going to production, set up proper security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all wishes
    match /wishes/{document} {
      allow read: if true;
      allow create: if request.auth != null || true; // Adjust based on your auth needs
      allow update, delete: if false;
    }

    // Allow read access to all RSVPs (or restrict as needed)
    match /rsvps/{document} {
      allow read: if true;
      allow create: if request.auth != null || true; // Adjust based on your auth needs
      allow update, delete: if false;
    }
  }
}
```

2. **Cloudinary**: The upload preset should be "unsigned" for client-side uploads, but you can add restrictions in Cloudinary dashboard (file size, format, etc.)

## 📱 Browser Compatibility

Audio recording requires:

- Modern browsers (Chrome, Firefox, Safari, Edge)
- HTTPS connection (or localhost for development)
- Microphone permissions

## 🚀 Free Tier Limits

### Firebase Firestore

- 1 GB storage
- 50,000 document reads per day
- 20,000 document writes per day
- 20,000 document deletes per day

### Cloudinary

- 25 GB storage
- 25 GB bandwidth per month
- 25 GB transformations per month

## 🐛 Troubleshooting

### Recording not working

- Check browser permissions for microphone
- Ensure you're on HTTPS (or localhost)
- Check browser console for errors

### Firebase errors

- Verify all environment variables are set correctly
- Check Firestore security rules
- Ensure Firestore is enabled in Firebase Console

### Cloudinary upload errors

- Verify cloud name and upload preset
- Check upload preset is set to "unsigned"
- Ensure file size is within limits

## 📝 Next Steps

1. Set up environment variables
2. Test RSVP submission
3. Test voice recording and submission
4. Configure Firestore security rules
5. Add rate limiting if needed
6. Consider adding authentication for admin access
7. Monitor usage in Firebase and Cloudinary dashboards

## 🎉 You're All Set!

The implementation is complete. Just add your Firebase and Cloudinary credentials to `.env.local` and you're ready to go!
