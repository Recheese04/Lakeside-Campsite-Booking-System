import { Request, Response, NextFunction } from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    // JWT validation logic
    next();
};

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // RBAC logic
        next();
    };
};
