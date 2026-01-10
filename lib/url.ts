/**
 * Get the base URL of the application
 * Automatically detects the current domain
 * Works in all environments: localhost, staging, production
 * 
 * @returns {string} The base URL (e.g., "https://yourdomain.com" or "http://localhost:3000")
 */
export const getBaseUrl = (): string => {
  // Check if we're on the client side
  if (typeof window !== 'undefined') {
    // Returns the origin (protocol + hostname + port)
    // Examples:
    // - http://localhost:3000
    // - https://kondangin.vercel.app
    // - https://yourdomain.com
    return window.location.origin
  }
  
  // Server-side fallback (for API routes, SSR, etc.)
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }
  
  // Default fallback
  return 'http://localhost:3000'
}

/**
 * Generate a guest invitation link
 * 
 * @param {string} guestSlug - The unique slug for the guest
 * @returns {string} Full invitation URL
 */
export const getInvitationLink = (guestSlug: string): string => {
  const baseUrl = getBaseUrl()
  return `${baseUrl}/?guest=${guestSlug}`
}

/**
 * Generate a WhatsApp invitation message with link
 * 
 * @param {string} guestName - Name of the guest
 * @param {string} guestSlug - The unique slug for the guest
 * @returns {string} Formatted WhatsApp message
 */
export const getWhatsAppMessage = (guestName: string, guestSlug: string): string => {
  const link = getInvitationLink(guestSlug)
  
  return `The Wedding of Sam & Eli 

Dear ${guestName},

You are invited! Dengan penuh sukacita, kami mengundang kamu untuk hadir di hari bahagia kami.

Akses undangan digital kami di sini untuk info lengkapnya:

${link}

Terima kasih atas doa dan dukungannya. We look forward to celebrating with you!

Best regards, Sam & Eli`
}

/**
 * Generate WhatsApp URL with pre-filled message
 * 
 * @param {string} phoneNumber - WhatsApp number (format: 628xxx)
 * @param {string} guestName - Name of the guest
 * @param {string} guestSlug - The unique slug for the guest
 * @returns {string} WhatsApp URL
 */
export const getWhatsAppUrl = (
  phoneNumber: string,
  guestName: string,
  guestSlug: string
): string => {
  const message = getWhatsAppMessage(guestName, guestSlug)
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
}
