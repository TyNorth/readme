import { supabase } from 'src/boot/supabase'

const BUCKET_NAME = 'universe-banners'

/**
 * Upload a banner image to the universe-banners bucket.
 * @param {File} file - The image file
 * @param {string} universeId - The universe ID for pathing
 * @returns {Promise<string>} - The public URL of the uploaded banner
 */
export async function uploadUniverseBanner(file, universeId) {
  const fileExt = file.name.split('.').pop()
  const fileName = `banner.${fileExt}`
  const filePath = `${universeId}/${fileName}`

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
    cacheControl: '3600',
    upsert: true,
  })

  if (error) throw error

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

  return data.publicUrl
}

/**
 * Get the public URL of a banner if you know the filename.
 * @param {string} filePath - Path like 'universeId/image.jpg'
 */

// src/supabase/universeBanners.js

export function getUniverseBannerUrl(universeId) {
  const path = `${universeId}/banner.png`
  const { data, error } = supabase.storage.from('universe-banners').getPublicUrl(path)

  if (error || !data?.publicUrl) {
    console.warn(`No banner found for universe ${universeId}`, error)
    return null // or return a fallback image path like '/src/assets/images/default_banner.png'
  }

  return data.publicUrl || '/src/assets/images/default_banner.png'
}

/**
 * Delete a universe banner (optional cleanup utility)
 * @param {string} filePath - Path like 'universeId/image.jpg'
 */
export async function deleteUniverseBanner(filePath) {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath])

  if (error) throw error
}
