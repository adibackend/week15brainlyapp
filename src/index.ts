import express from 'express'
import mongoose from 'mongoose'
import jwt from "jsonwebtoken"
import { UserModel } from './db'

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
app.post('/api/v1/sigin',(req,res)=>{

})
app.post('/api/v1/content',(req,res)=>{

})
app.post('/api/v1/brain/share',(req,res)=>{

})
app.post('/api/v1/brain/:sharelink',(req,res)=>{

})




app.listen(4000,async()=>{

  try {

   await mongoose.connect('mongodb+srv://devi:mm@testdb.vvyj2.mongodb.net/?retryWrites=true&w=majority&appName=testdb')
    console.log('APP LISTENING ON PORT 4000')

  } catch (error) {
    console.log('something is wrong')
  }
    
})
