require('dotenv').config()
const express = require("express");
const app = express();
const cors = require('cors');
// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_CHECKOUT_SESSION_SECRET_KEY);

// const allowedOrigins = [process.env.FRONTEND_ORIGIN];
// const corsOptions = {
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//   };
  
//   app.use(cors(corsOptions));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT"],
    credentials: true,
  })
);



app.use(express.static("public"));
app.use(express.json());


app.post("/create-checkout-session",async(req,res)=>{
  const {products} = req.body;
 
  const lineItems = products.map((product)=>({
      price_data:{
          currency:"inr",
          product_data:{
              name:product.title,
              images:[product.image]
          },
          unit_amount:product.price * 100,
      },
      quantity:product.Quantity
  }));

  try{
    const session = await stripe.checkout.sessions.create({
      payment_method_types:["card"],
      line_items:lineItems,
      mode:"payment",
      success_url:process.env.FRONTEND_SUCCESS_URL,
      cancel_url:process.env.FRONTEND_CANCEL_URL,
  });
  }catch(err){
    return res.json(err.message)
  }
 

  res.json({id:session.id})

})

app.listen(4242, () => console.log("Node server listening on port 4242!"));