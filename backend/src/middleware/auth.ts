import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { CustomError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    next(new CustomError('Not authorized to access this route', 401));
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env['JWT_SECRET']!) as { id: string };
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      next(new CustomError('User not found', 404));
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    next(new CustomError('Not authorized to access this route', 401));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new CustomError('User not authenticated', 401));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new CustomError(`User role ${req.user.role} is not authorized to access this route`, 403));
      return;
    }

    next();
  };
}; 