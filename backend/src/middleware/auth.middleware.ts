import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

export interface AuthUser {
    id: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}

/**
 * Verify JWT token and attach user to request
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

/**
 * Role-based authorization — only allow specified roles
 */
export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated.' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden. Insufficient permissions.' });
        }

        next();
    };
};

/** Shorthand: require ADMIN role */
export const requireAdmin = authorize('ADMIN');

/** Shorthand: require ADMIN or STAFF */
export const requireStaff = authorize('ADMIN', 'STAFF');
