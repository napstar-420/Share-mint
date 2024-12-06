import { z } from 'zod'

export const UploadSchema = z.object({
  file: z.instanceof(File),
  password: z.string().max(64).optional(),
  downloadsLeft: z.number().min(0),
  expirationTime: z.number().min(0),
})
