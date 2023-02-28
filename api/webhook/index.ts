import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { Webhook } from '../../src/types/message'

const token = process.env.TOKEN

export default async function (req: VercelRequest, res: VercelResponse): Promise<VercelResponse> {
  if (req.method === 'GET') {
    const mode = req.query['hub.mode']
    const challenge = req.query['hub.challenge']
    const verifyToken = req.query['hub.verify_token']
  
    if (mode === 'subscribe' && verifyToken == token) {
      return res.send(challenge)
    }
    return res.status(403).end()
  }

  if (req.method === 'POST') {
    console.log(JSON.stringify(req.body, null, 2))

    const body = (req.body as Webhook).entry[0].changes[0]
    const phone_number_id = body.value.metadata.phone_number_id

    if (body.field !== 'messages' || !body.value.messages) {
      return res.status(400).end()
    }

    for (const message of body.value.messages) {
      if (message.type !== 'text') {
        return res.status(400).end()
      }
      
      const { text: { body: text } } = message

      if (text !== 'hola') {
        return res.status(400).end()
      }

      await fetch(`https://graph.facebook.com/v16.0/${phone_number_id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: message.from,
          type: 'sticker',
          sticker: {
            link: 'https://www.tyntec.com/sites/default/files/2020-07/tyntec_rocket_sticker_512px_001_.webp'
          }
        })
      }).catch(err => console.error(err))
        .finally(() => {
          return res.status(200).end()
        })
    }
  }

  return res.status(400).end()
}