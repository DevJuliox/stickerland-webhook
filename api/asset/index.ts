import { VercelRequest, VercelResponse } from '@vercel/node'

const api_key = process.env.CLOUDINARY_API_KEY
const api_secret = process.env.CLOUDINARY_API_SECRET

export default async function (req: VercelRequest, res: VercelResponse): Promise<VercelResponse> {
  if (req.method === 'GET') {
    const endpoint = 'https://api.cloudinary.com/v1_1/jhormanrus/resources/image/upload?prefix=stickerland'
    const headers = new Headers()
    const base64Credentials = btoa(`${api_key}:${api_secret}`)
    headers.append('Authorization', `Basic ${base64Credentials}`)

    const assets = await fetch(endpoint, {
      method: 'GET',
      headers: headers
    }).then(res => res.json())
      .catch(err => console.error(err))

    return res.status(200).json(assets)
  }
  
  return res.status(400).end()
}