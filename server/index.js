const { error } = require("console");
const cors = require("cors");
const {
  client,
  checkout,
  createTables,
  createUser,
  createProduct,
  createCart,
  fetchUsers,
  fetchProduct,
  fetchProducts,
  fetchCart,
  fetchCartProducts,
  destroyCart,
  authenticate,
  findUserWithToken,
  createCartProducts,
  removeCartProduct,
  removeProduct,
} = require("./db");
const express = require("express");
const app = express();
app.use(cors());
app.use(express.json());
const jwt = require("jsonwebtoken");
const secret = process.env.JWT || "supersecretpassword";

//TODO: To be called to check if a user is logged in before processing the request and sending a response
async function isLoggedIn(req, res, next) {
  try {
    console.log(req.user);
    if (req.user.admin) {
      const result = await createProduct(req.user_id, req.name, req.quantity);
      res.status(201).send(result);
    }
  } catch (ex) {
    next(ex);
  }

  //find the user based on the request token ie findUserWithToken

  //if there is a user returned, call next() to process the request
  next();

  //otherwise call next with an error (next(new Error("user not found")))
}

//TODO: To be called to check if a user is an admin, before processing a request and sending a response on admin only routes
async function isAdmin(req, res, next) {
  if (req.user && req.user.admin) {
    next();
  }
  //check that the user info on the request indicates they are an admin
  //if admin
  //otherwise call next with an error( new Error("user is not admin"))
  else {
    const error = new Error("user is not admin");
    error.status = 403;
    next(error);
  }
}
//for deployment only
const path = require("path");
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);
app.use(
  "/assets",
  express.static(path.join(__dirname, "../client/dist/assets"))
);

app.post("/api/auth/login", async (req, res, next) => {
  try {
    res.send(await authenticate(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/auth/register", async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    await createCart({ user_id: user.id });
    res.send(user);
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/auth/validate", async (req, res, next) => {
  console.log(req.headers.authorization);
  const valid = jwt.verify(req.headers.authorization, secret);
  if (!valid) {
    res.status(401).send("invalid token");
  }
  res.send("valid token");
});

app.get("/api/auth/me", async (req, res, next) => {
  try {
    res.send(await findUserWithToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/users", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/users/:id/carts", async (req, res, next) => {
  try {
    const cart = await fetchCart(req.params.id);
    res.send(await fetchCartProducts(cart.id));
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/users/:id/carts", async (req, res, next) => {
  try {
    res.status(201).send(
      await createCart({
        user_id: req.params.id,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

//TODO:  add item to card is LoggedIn
app.post("/api/users/:user_id/carts/:id", async (req, res) => {
  try {
    const { user_id, id } = req.params;
    const { productID, quantity } = req.body;

    if (!productID || !quantity) {
      return res
        .status(400)
        .json({ message: "Product ID or quantity missing" });
    }

    const cart = await fetchCart(user_id);
    console.log(cart);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await createCartProducts(cart.id, productID, quantity);

    res.json({ message: "Items added to the cart" });
  } catch (ex) {
    console.error("Error processing request:", ex);
    res.status(500).json({ message: "Error occurred" });
  }
});

//destroy carted_products (ie remove from cart)

app.delete("/api/users/:user_id/carts/:id", async (req, res, next) => {
  try {
    await destroyCart({ user_id: req.params.user_id, id: req.params.id });
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/users/:user_id/carts/:product_id", async (req, res, next) => {
  try {
    const cart = await fetchCart(req.params.user_id);
    await removeCartProduct(cart.id, req.params.product_id);
    res.send(await fetchCartProducts(cart.id));
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/users/:user_id/checkout", async (req, res, next) => {
  try {
    const cart = await fetchCart(req.params.user_id);
    const cartProducts = await fetchCartProducts(cart.id);

    if (cartProducts.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    await checkout(cart.id);

    res.json({ message: "Checkout successful" });
  }
  catch (ex) {
    next(ex);
  }
});

app.get("/api/products", async (req, res, next) => {
  try {
    res.send(await fetchProducts());
  } catch (ex) {
    next(ex);
  }
});

//TODO add route to create products (ADMIN ONLY)
app.post("/api/products", async (req, res, next) => {
  try {
    //check the request body for product data
    const result = await createProducts(req.body.product);

    //call createProduct with product data as parameters to add to database

    //send the response
    res.send(result);
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/products/:id", async (req, res, next) => {
  try {
    res.send(await fetchProduct(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

//TODO add route to delete products (ADMIN ONLY)
app.delete("/api/products/:id", async (req, res, next) => {
  try {
    //check the request body for product data
    const result = await removeProduct(req.params.id);

    //send the response
    res.send(result);
  } catch (ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.status || 500)
    .send({ error: err.message ? err.message : err });
});

const init = async () => {
  const port = process.env.PORT || 3000;
  await client.connect();
  console.log("connected to database");

   await createTables();
   console.log("tables created");

   const [moe, lucy, ethyl, curly, foo, bar, bazz, quq, fip] = await Promise.all(
    [
  
      createProduct({ name: "butterfly" }),
      createProduct({ name: "Happy" }),
      createProduct({ name: "joy" }),
      createProduct({ name: "Diamond" }),
      createProduct({ name: "Pink" }),
    ]
  );

  // console.log(await fetchUsers());
  // console.log(await fetchProducts());

  // console.log(await fetchCart(moe.id));
  // const favoritcart = await createCart({
  //   user_id: moe.id,
  // });
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
