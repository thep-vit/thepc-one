const express = require("express")
const cors = require("cors")
const cookieParser = require('cookie-parser')
const path = require('path')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const mongoose = require('mongoose')
const passport = require("passport")

const apiRouter = require("./routes/api")
const indexRouter = require("./routes/index")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

const viewPath = path.join(__dirname, "./views");

//DB Config
const dbKey = "mongodb+srv://Abhinav123:Abhinav123@thepc-one.miqgj.mongodb.net/THEPC-One?retryWrites=true&w=majority"
mongoose.connect(dbKey,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(()=> {
    console.log("MONGO DB CONNECTED!")
}).catch((e)=>console.log("Cannot Connect to Mongo",e))

//View Engine
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set("views", viewPath);
app.use(express.static("public"))

app.use(express.urlencoded({ extended:false }));
app.use(cookieParser())

app.use(session({
	secret: 'THISISASESSIONSECRET',
	saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 60000 }
}))

//Passport Setup
app.use(passport.initialize())
app.use(passport.session())

app.use("/",indexRouter)
// app.use("/auth",authRouter)
// app.use("/users",userRouter)
app.use("/api",apiRouter)

app.listen(PORT, () => {
    console.log(`Server up and running on port: ${PORT}.`);
})