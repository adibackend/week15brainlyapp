import express from 'express'
import mongoose from 'mongoose'
import jwt from "jsonwebtoken"
import { ContentModel, UserModel } from './db'
import { jwtauth, userSignInSchemaa } from './middleware'
import dotenv from 'dotenv'
import { validate } from './middleware'
import { LinkModel } from './db'
import { random } from './utils'
import { comparepassword, hashpassword } from './utils'
import { contentSchema } from './middleware'
import cors from "cors"
dotenv.config()
const app = express()
app.use(express.json())
app.use(cors());

app.get('/', (req, res) => {
  res.json({ messeage: "everything is correct" })
})

app.post('/api/v1/signup', validate(userSignInSchemaa), async (req, res) => {
  //zod validation +hash the password 
  const { username, password } = req.body
  const pass = await hashpassword(password)
  await UserModel.create({ username, password: pass })
  res.json({ messeage: 'user has signed up' })
})

app.post('/api/v1/signin', validate(userSignInSchemaa), async (req, res) => {
  const {username,password}=req.body
  
  const user = await UserModel.findOne({ username})

  if (!user) {
   res.status(403).json({
      message: "Incorrect credentials",
    });
  }

  const isPasswordValid = await comparepassword(password, user?.password as string);

  if (!isPasswordValid) {
    res.status(403).json({
      message: "Incorrect credentials",
    });
  }

  const sign = jwt.sign({ id: user?._id }, process.env.JWT_PASSWORD as string);

  res.json({ token: sign });
})

app.post('/api/v1/content', validate(contentSchema), jwtauth, async (req, res) => {
  const link = req.body.link;
  const type = req.body.type;
  const title = req.body.title;
  await ContentModel.create({
    link,
    type,
    title,
    userId: req.userId,
    tags: []
  })

  res.json({
    message: "Content added"
  })
})

app.get("/api/v1/content", jwtauth, async (req, res) => {

  const userId = req.userId;
  const content = await ContentModel.find({
    userId: userId
  }).populate("userId", "username")
  console.log(content)
  res.json({
    content
  })
})


app.post('/api/v1/brain/share', jwtauth, async (req, res) => {
  const share = req.body.share;
  const contentId = req.body.contentId
  try {
    if (share) {
      const existingLink = await LinkModel.findOne({ userId: req.userId, contentId });
      if (existingLink) {
        res.json({ hash: existingLink.hash });
      }
      const hash = random(10);
      const newLink = await LinkModel.create({
        hash,
        userId: req.userId,
        contentId
      });

      res.json({ hash: newLink.hash });
    } else {
      // If `share` is false, delete the existing link
      const deletedLink = await LinkModel.findOneAndDelete({ userId: req.userId, contentId });

      if (deletedLink) {
        res.json({ message: "Link removed" });
      }

      res.status(404).json({ message: "No link found to remove" });
    }
  } catch (error) {
    console.error("Error in sharing content:", error);
    res.status(500).json({ message: "An error occurred", error });
  }
})

interface Iuser{
  username:string,

}
interface Icontent{
  title:string,
  link:string,
  type:string
}
app.get('/api/v1/brain/:sharelink', async (req, res) => {
  const hash = req.params.sharelink;
  try {
    // Validate the hash parameter
    if (!hash || hash.length !== 10) {
      res.status(400).json({
        message: "Invalid or missing share link",
      });
    }

    // Find the link using the hash
    const link = await LinkModel.findOne({ hash }).populate('userId',"username").populate('contentId',"title type link");

    if (!link) {
      res.status(404).json({
        message: "Share link not found",
      });
    }

    // Fetch the content associated with the userId
    // const content = await ContentModel.findOne({ _id: link?.contentId });
    // const {userId:Iuser, contentId}=link
    const user:Iuser=link?.userId as Iuser
    const content:Icontent=link?.contentId as Icontent
    
    // Fetch the user details
    // const user = await UserModel.findOne({ _id: link?.userId });
    if (!user) {
      res.status(404).json({
        message: "User not found. This should not happen.",
      });
    }
    console.log(user,link)
    // Return the user's username and content
    res.json({
      user,
      content
    });
  } catch (error) {
    console.error("Error fetching share link:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }

})

app.listen(process.env.PORT, async () => {

  try {
    console.log(`${process.env.PORT}`)
    await mongoose.connect(`${process.env.DATABASE_URL}`)
    console.log(`App is listenin on port ${process.env.PORT}`)

  } catch (error) {
    console.log('something is wrong')
  }

})
