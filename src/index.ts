import express from 'express'
import mongoose from 'mongoose'
import jwt from "jsonwebtoken"
import { UserModel } from './db'
import dotenv from 'dotenv'
import validateUser from './middleware'

dotenv.config()

const app=express()
app.use(express.json())

app.get('/',(req,res)=>{
    res.json({messeage: "everything is correct"})
})

app.post('/api/v1/signup',(req,res)=>{
    //zod validation +hash the password 
    console.log('inside post method')
    const {username,password}=req.body
    UserModel.create({username,password})
    res.json({messeage:'user has signed up'})
})
app.post('/api/v1/signin',validateUser,(req,res)=>{
  res.json({messeage : 'outside of post singin method'})

})
app.post('/api/v1/content',(req,res)=>{

})
app.post('/api/v1/brain/share',(req,res)=>{

})
app.post('/api/v1/brain/:sharelink',(req,res)=>{

})


app.listen(process.env.PORT,async()=>{

  try {
   await mongoose.connect(`${process.env.DATABASE_URL}`)
    console.log(`App is listenin on port ${process.env.PORT}`)

  } catch (error) {
    console.log('something is wrong')
  }
    
})
