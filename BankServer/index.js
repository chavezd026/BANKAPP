//Server Creation

//Import express
const express = require('express')

const dataService = require('./services/dataService')

//import jsonwebtoken

const jwt = require('jsonwebtoken')

//import cors

const cors = require('cors')

//Create an App using express

const app = express()

app.use(express.json())

//give command to share data 

app.use(cors({
    origin:['http://localhost:4200','http://192.168.0.115:8080']
}))

// Create a port number

app.listen(3000,()=>{
    console.log('listening on port 3000');
})

//application middleware
const appMiddleware = ( req, res, next)=>{
    console.log("Application specific middleware");
    next();
}
app.use(appMiddleware)

//Router specific middleware
const jwtRouterMiddleware = (req,res,next)=>{
    try{
    console.log("Router specific middleware");
    const token=req.headers['x-access-token']
    const data=jwt.verify(token,'superkey2023');
    console.log(data);
    next();
    }
    catch{
        //422 - unprocessable entry
        res.status(422).json({
            statusCode:422,
            status:false,
            message:"Please login first"
        })
    }
}

//Resolving http requests

// app.get('/',(req,res)=>{
//     res.send('Get http request')
// })

// app.post('/',(req,res)=>{
//     res.send('Post http request')
// })

// app.put('/',(req,res)=>{
//     res.send('Put http request')
// })

// app.patch('/',(req,res)=>{
//     res.send('Patch http request')
// })

// app.delete('/',(req,res)=>{
//     res.send('Delete http request')
// })

//Api calls

//Register request

app.post('/register',(req,res)=>{
    dataService.reg(req.body.acno,req.body.username,req.body.password).then(
        result=>{
            res.status(result.statusCode).json(result)
        }
    )
    
    // if(result){
    //     res.send('register successful')
    //     console.log(req.body);
    // }
    // else{
    //     res.send('register failed')
    // }
})

//login request
app.post('/login',(req,res)=>{
    dataService.Login(req.body.acno,req.body.password).then(
        result=>{
            res.status(result.statusCode).json(result)
        }
    )
    
})
//deposit request
app.post('/deposit',jwtRouterMiddleware,(req,res)=>{
    dataService.deposit(req.body.acno,req.body.password,req.body.amount).then(
        result=>{
            res.status(result.statusCode).json(result)
        }
    )
})
//withdraw request
app.post('/withdraw',jwtRouterMiddleware,(req,res)=>{
    dataService.withdraw(req.body.acno,req.body.password,req.body.amount).then(
        result=>{
            res.status(result.statusCode).json(result)
        }
    )
})
//transaction request
app.post('/transaction',jwtRouterMiddleware,(req,res)=>{
    dataService.getTransaction(req.body.acno).then(
        result=>{
            res.status(result.statusCode).json(result)
        }
    )
})
//delete request
app.delete('/deleteAcc/:acno',(req,res)=>{
    dataService.deleteAcc(req.params.acno).then(
        result=>{
            res.status(result.statusCode).json(result)
        }
    )
})