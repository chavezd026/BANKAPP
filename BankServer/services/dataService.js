//import jsonwebtoken

const jwt = require('jsonwebtoken')

//import db.js

const db=require('./db')

// userDetails={
//     1000:{acno:1000,username:"Pranav",password:1000,balance:2000,transaction:[]},
//     1001:{acno:1001,username:"Abhinand",password:1001,balance:3000,transaction:[]},
//     1002:{acno:1002,username:"Adwaith",password:1002,balance:4000,transaction:[]}
//   }

  const reg=(acno,username,password)=>{
    return db.User.findOne({acno}).then( //asynchronous call
      user=>{
        if(user){
          return {
            status:false,
            statusCode:404,
            message:"User already exist"
          }
        }
        else{
          const newUser=new db.User({
            acno:acno,
            username:username,
            password:password,
            balance:0,
            transaction:[]
          })
          newUser.save()  //to save new data to mongodb
          return {
            status:true,
            statusCode:200,
            message:"Register successful"
          }
        }
      }
    )
    if(acno in userDetails){
      return {
        status:false,
        statusCode:404,
        message:"User already exist"
      }
    }
    else{
      userDetails[acno]={
        acno:acno,
        username:username,
        password:password,
        balance:0,
        transaction:[]
      }
      
      return {
        status:true,
        statusCode:200,
        message:"Register successful"
      }
    }
  }

   const Login=(acno,password)=>{
    return db.User.findOne({acno,password}).then(
      user=>{
        if(user){
          currentUser=user.username;
          currentAcno=acno;
          //token generate
          const token=jwt.sign({currentAcno:acno},'superkey2023')
          //superkey2023 will generate a key eg hfdgxydbegdbdbdh74grfh
          return {
          status:true,
          statusCode:200,
          message:"Login successful",
          token:token,
          currentUser:user.username,
          currentAcno:acno
          }
        }
        else{
          return {
              status:false,
              statusCode:404,
              message:"User not found"
            }
        }
      }
    )
  
    if(acno in userDetails){
      if(pswd==userDetails[acno]['password']){
        currentUser=userDetails[acno]['username'];
        currentAcno=acno;
        //token generate
        const token=jwt.sign({currentAcno:acno},'superkey2023')
        //superkey2023 will generate a key eg hfdgxydbegdbdbdh74grfh
        return {
        status:true,
        statusCode:200,
        message:"Login successful",
        token:token
      }
      }
      else{
        return {
          status:false,
          statusCode:404,
          message:"Password incorrect"
        }
      }
    }
    else{
      return {
          status:false,
          statusCode:404,
          message:"User not found"
        }
    }
  
   }

  const deposit=(acno,password,amt)=>{
    var amount=parseInt(amt)
    return db.User.findOne({acno,password}).then(
      user=>{
        if(user){
          if(password==user.password){
            user.balance+=amount;
            user.transaction.push({
              type:'Credit',
              amount
            })
            user.save();
            return{
            status:true,
            statusCode:200,
            message:`${amount} is credited and balance is ${user.balance}`
          }
          }
          else{
            return {
              status:false,
              statusCode:404,
              message:"Password incorrect"
            }
          }
        }
        else{
          return {
              status:false,
              statusCode:404,
              message:"invalid acc no."
            }
        }
        }
    )
    var amount=parseInt(amt)
    if(acno in userDetails){
      if(pswd==userDetails[acno]['password']){
        userDetails[acno]['balance']+=amount;
        userDetails[acno]['transaction'].push({
          type:'Credit',
          amount
        })
        return{
        status:true,
        statusCode:200,
        message:`${amount} is credited and balance is ${ userDetails[acno]['balance']}`
      }
      }
      else{
        return {
          status:false,
          statusCode:404,
          message:"Password incorrect"
        }
      }
    }
    else{
      return {
          status:false,
          statusCode:404,
          message:"invalid acc no."
        }
    }
  }

  const withdraw=(acno,password,amt)=>{
    var amount=parseInt(amt)
    return db.User.findOne({acno,password}).then(
      user=>{
        if(user){
          if(password==user.password){
            if(user.balance>amount){
              user.balance -= amount;
              user.transaction.push({
                type:'Debit',
                amount
              })
              user.save();
              return{
              status:true,
              statusCode:200,
              message:`${amount} is debited and balance is ${user.balance}`
          }
            }
          }
          else{
            return {
              status:false,
              statusCode:404,
              message:"Password incorrect"
            }
          }
        }
        else{
          return {
              status:false,
              statusCode:404,
              message:"invalid acc no."
            }
        }
      }
    )
    if(acno in userDetails){
      if(pswd==userDetails[acno]['password']){
        if(userDetails[acno]['balance']>amount){
          userDetails[acno]['balance']-=amount;
          userDetails[acno]['transaction'].push({
            type:'Debit',
            amount
          })
          return{
          status:true,
          statusCode:200,
          message:`${amount} is debited and balance is ${ userDetails[acno]['balance']}`
      }
        }
      }
      else{
        return {
          status:false,
          statusCode:404,
          message:"Password incorrect"
        }
      }
    }
    else{
      return {
          status:false,
          statusCode:404,
          message:"invalid acc no."
        }
    }
  }

  const getTransaction=(acno)=>{
    return db.User.findOne({acno}).then(
      user=>{
        if(user){
          return{
            status:true,
            statusCode:200,
            transaction:user.transaction
        }
        }
        else{
          return{
            status:false,
            statusCode:404,
            message:"User not found"
          }
        }
      }
    )
    return{
          status:true,
          statusCode:200,
          transaction:userDetails[acno]['transaction']
      }
  }

  const deleteAcc=(acno)=>{
    return db.User.deleteOne({acno}).then(
      user=>{
        if(user){
          return{
            status:true,
            statusCode:200,
            message:"Account deleted"
          }
        }
        else{
          return{
            status:false,
            statusCode:404,
            message:"User not found"
          }
        }
      }
    )
  }

  module.exports={
    reg,
    Login,
    deposit,
    withdraw,
    getTransaction,
    deleteAcc
  }