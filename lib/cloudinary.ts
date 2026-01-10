export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
}

export const uploadAudioToCloudinary = async (
  audioBlob: Blob
): Promise<string> => {
  const formData = new FormData()
  formData.append('file', audioBlob)
  formData.append('upload_preset', cloudinaryConfig.uploadPreset!)
  formData.append('resource_type', 'video') // Cloudinary treats audio as video resource type

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error('Failed to upload audio to Cloudinary')
  }

  const data = await response.json()
  return data.secure_url
}
