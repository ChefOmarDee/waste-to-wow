// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired } from '@auth0/nextjs-auth0';


 async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {Configuration, OpenAIApi}= require("openai")

  const configuration=new Configuration({
      apiKey:process.env.OPENAI_API_KEY,
  })
  const openai=new OpenAIApi(configuration);
  const completion = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: "what is something random that I can make that uses"+req.body.materialList,
  max_tokens: 2048
});
  res.status(200).send(completion.data.choices[0].text)
}
export default withApiAuthRequired(handler)