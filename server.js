require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const stripe = require("stripe")(
  process.env.STRIPE_CHECKOUT_SESSION_SECRET_KEY
);

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

app.use(express.static("public"));
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  const { products, URLs } = req.body;
  const lineItems = products.map((product) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: product.title,
        images: [product.image],
      },
      unit_amount: product.price * 100,
    },
    quantity: product.Quantity,
  }));

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: URLs.success,
      cancel_url: URLs.cancel,
    });
  } catch (err) {
    return res.json(err.message);
  }
  res.json({ id: session.id });
});

app.listen(4242, () => console.log("Node server listening on port 4242!"));
