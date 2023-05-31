import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    })

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).end();
  }
}