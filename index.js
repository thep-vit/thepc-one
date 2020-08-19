const express = require("express")
const cors = require("cors")
const cookieParser = require('cookie-parser')
const path = require('path')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')

const userRouter = require("./routes/users")
const indexRouter = require("./routes/index")

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())

const viewPath = path.join(__dirname, "./views");

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

app.use("/",indexRouter)
app.use("/users",userRouter)

app.listen(PORT, () => {
    console.log(`Server up and running on port: ${PORT}.`);
})