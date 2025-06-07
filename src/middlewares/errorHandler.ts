import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: "Unauthorized - Please login first" });
    }
    next();
};