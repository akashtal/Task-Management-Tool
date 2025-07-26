import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/drizzle';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  if (req.method === 'GET') {
    try {
      const allUsers = await db.select({
        id: users.id,
        email: users.email,
        role: users.role,
        approved: users.approved,
        createdAt: users.createdAt,
      }).from(users);

      res.status(200).json({ users: allUsers });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'PATCH') {
    const { userId, approved } = req.body;

    try {
      await db.update(users).set({ approved }).where(eq(users.id, userId));
      res.status(200).json({ message: 'User approval status updated' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
