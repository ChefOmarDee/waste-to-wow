// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import openai from '../Utils/openai';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

const completion = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: "what is something random that I can make that uses"+req.body.materialList,
  max_tokens: 2048
});

console.log(completion.data.choices[0].text);

  res.status(200).json({ name: 'John Doe' })
}
