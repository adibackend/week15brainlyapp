import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(18),
});

type User = z.infer<typeof userSchema>;

const validateUser = (req: Request, res: Response, next: NextFunction) => {
  try {

    console.log('inside of validate user middleware')
    userSchema.parse(req.body); 
    next();
  } catch (err) {
    res.status(400).json({ err });
  }
};

export default validateUser;
