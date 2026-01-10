/**
 * Get the base URL of the application
 * Automatically detects the current domain
 * Works in all environments: localhost, staging, production
 *
 * @returns {string} The base URL (e.g., "https://yourdomain.com" or "http://localhost:3000")
 */
export const getBaseUrl = (): string => {
  // Check if we're on the client side
  if (globalThis.window !== undefined) {
    // Returns the origin (protocol + hostname + port)
    // Examples:
    // - http://localhost:3000
    // - https://kondangin.vercel.app
    // - https://yourdomain.com
    return globalThis.window.location.origin
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
 * Get default WhatsApp invitation message template
 *
 * @param {string} guestName - Name of the guest
 * @param {string} link - Full invitation link
 * @returns {string} Default WhatsApp message
 */
export const getDefaultWhatsAppMessageTemplate = (
  guestName: string,
  link: string
): string => {
  return `The Wedding of Sam & Eli 

Dear ${guestName},

You are invited! Dengan penuh sukacita, kami mengundang kamu untuk hadir di hari bahagia kami.

Akses undangan digital kami di sini untuk info lengkapnya:

${link}

Terima kasih atas doa dan dukungannya. We look forward to celebrating with you!

Best regards, Sam & Eli`
}

/**
 * Generate a WhatsApp invitation message with link
 * Supports custom message template with {name} and {link} placeholders
 *
 * @param {string} guestName - Name of the guest
 * @param {string} guestSlug - The unique slug for the guest
 * @param {string} [customTemplate] - Optional custom message template
 * @returns {string} Formatted WhatsApp message
 */
export const getWhatsAppMessage = (
  guestName: string,
  guestSlug: string,
  customTemplate?: string
): string => {
  const link = getInvitationLink(guestSlug)

  // If custom template provided, use it with placeholders
  if (customTemplate) {
    return customTemplate
      .replaceAll('{name}', guestName)
      .replaceAll('{link}', link)
  }

  // Otherwise use default template
  return getDefaultWhatsAppMessageTemplate(guestName, link)
}

/**
 * Generate WhatsApp URL with pre-filled message
 * Supports custom message template
 *
 * @param {string} phoneNumber - WhatsApp number (format: 628xxx)
 * @param {string} guestName - Name of the guest
 * @param {string} guestSlug - The unique slug for the guest
 * @param {string} [customTemplate] - Optional custom message template
 * @returns {string} WhatsApp URL
 */
export const getWhatsAppUrl = (
  phoneNumber: string,
  guestName: string,
  guestSlug: string,
  customTemplate?: string
): string => {
  const message = getWhatsAppMessage(guestName, guestSlug, customTemplate)
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
}
