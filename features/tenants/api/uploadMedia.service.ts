import { api } from "@/lib/axios"

export const uploadMedia = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post('users/upload-media', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data.media.url
}