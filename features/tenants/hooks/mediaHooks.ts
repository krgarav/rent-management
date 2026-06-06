import { useMutation } from '@tanstack/react-query'
import { uploadMedia } from '../api/uploadMedia.service'

export const useUploadMedia = () => {
    return useMutation({
        mutationFn: (file: File) => uploadMedia(file),

        onSuccess: (url) => {
            console.log('Upload success:', url)
        },

        onError: (error) => {
            console.error('Upload failed:', error)
        },
    })
}