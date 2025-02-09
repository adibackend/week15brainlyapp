import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()


declare global {
  namespace Express {
    interface Request {
      userId?: string; 
    }
  }
}

export const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(18),
});

export const contentSchema = z.object({
  link: z.string().url(),
  type: z.string().nonempty(),
  title: z.string().nonempty(),
});

export const userSignInSchemaa=z.object({
  username:z.string().nonempty(),
  password : z.string().nonempty()
})
export const IUserr=z.object({
  username:z.string()
})

export const validate =
  (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction): void => {
      try {
        schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).json({ errors: error.errors });
          return;
        }
        next(error);
      }
    };



export const jwtauth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers['authorization'];
  const decoded = jwt.verify(header as string, process.env.JWT_PASSWORD as string)
  if (decoded) {
    if (typeof decoded === "string") {
      res.status(403).json({
        message: "You are not logged in"
      })
      return;
    }
    req.userId = (decoded as JwtPayload).id;
    next()
  } else {  
    res.status(403).json({
      message: "You are not logged in"
    })
  }
}