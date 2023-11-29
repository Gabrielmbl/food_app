const express = require('express');
const bodyParser = require('body-parser');

const cors = require ("cors")
const cookieParser = require("cookie-parser")

require("dotenv").config();


// create express app
const app = express();

// Setup server port
const port = process.env.PORT || 4001;

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Apply CORS middleware 
app.use(
  cors({
      origin: '*', //["http://localhost:3000","http://localhost:3001"],
      method: ["GET", "POST"],
      credentials : true,
  })
);


// Serve files from a directory (e.g., 'public')
app.use(express.static('public'));


// define a root route
app.get('/', (req, res) => {
  res.send("Hello World");
});


// Require [user] routes
const userRoutes = require('./src/routes/user.routes')
const menuRoutes = require('./src/routes/menu.routes')
const orderRoutes = require('./src/routes/order.routes')
const meal_planRoutes = require('./src/routes/meal_plan.routes')
const menu_orderRoutes = require('./src/routes/menu_order.routes')

app.use(cookieParser());

// using as middleware
app.use('/api/users', userRoutes)
app.use('/api/menus', menuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/meal_plan', meal_planRoutes)
app.use('/api/meal_order', menu_orderRoutes)

// listen for requests
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);  
});


app.use((req,res,next)=>{
  res.set('Cache-Control','no-store')
  next()
})


