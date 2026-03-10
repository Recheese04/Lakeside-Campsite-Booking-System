import { Request, Response, NextFunction } from 'express';

// Authentication middleware for input validation

/**
 * Validate login request body
 */
export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    next();
};

/**
 * Validate registration request body
 */
export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'All fields (email, password, first name, last name) are required' });
    }

    next();
};
