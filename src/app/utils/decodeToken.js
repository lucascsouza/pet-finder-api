import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export default async function decodeToken(req, res) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const [, token] = req.headers.authorization.split(' ');

    try {
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.APP_SECRET
      );

      return decoded.id;
    } catch (err) {
      return res.status(401).json({ error: 'Invalid Token.' });
    }
  }

  return false;
}
