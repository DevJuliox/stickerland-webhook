import { VercelRequest, VercelResponse } from '@vercel/node'

const api_key = process.env.CLOUDINARY_API_KEY
const api_secret = process.env.CLOUDINARY_API_SECRET

const allowCors = fn => async (req, res) => {
  const allowedOrigins = ['https://stickerland.vercel.app']
  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }
    return await fn(req, res)
  }
  res.status(403).end()
}

async function asset (req: VercelRequest, res: VercelResponse): Promise<VercelResponse> {
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

export default allowCors(asset)