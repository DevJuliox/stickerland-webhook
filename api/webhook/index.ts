import type { VercelRequest, VercelResponse } from '@vercel/node'

const token = process.env.TOKEN

export default function (req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const mode = req.query['hub.mode']
    const challenge = req.query['hub.challenge']
    const verifyToken = req.query['hub.verify_token']
  
    if (mode === 'subscribe' && verifyToken == token) {
      res.send(challenge)
    } else {
      res.status(403).end()
    }
  }

  if (req.method === 'POST') {
    const body = req.body

    if (body.field !== 'messages') {
      res.status(400).end()
    }
    console.log(JSON.stringify(body, null, 2))
    res.status(200).end()
  }
}