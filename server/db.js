const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL ||
    "postgres://db_sjjh_user:80zyC9ctrH0qZcxzRgS3WBasP2wD8Rpp@dpg-coj6uddjm4es73a45310-a.ohio-postgres.render.com/db_sjjh?ssl=1" //"postgres://localhost/acme_auth_store_db"
);
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT || "supersecretpassword";

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS carts_products;
    DROP TABLE IF EXISTS carts;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
    CREATE TABLE products(
      id UUID PRIMARY KEY,
      name VARCHAR(20),
      quantity INT DEFAULT 10
    );
    CREATE TABLE carts(
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      CONSTRAINT unique_user_id UNIQUE (user_id)
    );
    CREATE TABLE carts_products(
      id UUID PRIMARY KEY,
      carts_id UUID REFERENCES carts(id) NOT NULL,
      product_id UUID REFERENCES products(id),
      quantity INT NOT NULL 
    )
  `;
  await client.query(SQL);
};
const createUser = async ({ username, password }) => {
  const SQL = `
    INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    username,
    await bcrypt.hash(password, 5),
  ]);
  return response.rows[0];
};

const createProduct = async ({ name }) => {
  const SQL = `
    INSERT INTO products(id, name) VALUES($1, $2) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

const createCart = async ({ user_id }) => {
  const SQL = `
    INSERT INTO carts(id, user_id) VALUES($1, $2) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id]);
  return response.rows[0];
};

const destroyCart = async ({ user_id, id }) => {
  const SQL = `
    DELETE FROM carts WHERE user_id=$1 AND id=$2
  `;
  await client.query(SQL, [user_id, id]);
};

const authenticate = async (data) => {
  const SQL = `
  SELECT id, username, password FROM users WHERE username=$1;
  `;
  const response = await client.query(SQL, [data.username]);
  if (
    (!response.rows.length ||
      (await bcrypt.compare(data.password, response.rows[0].password))) ===
    false
  ) {
    const error = Error("User not found 1");
    error.status = 400;
    throw error;
  }
  if (response.rows[0]) {
    const token = jwt.sign({ id: response.rows[0].id }, secret, {
      expiresIn: "6hr",
    });
    console.log(token);
    return { token: token, userID: response.rows[0].id };
  } else {
    const error = Error("User not found 2");
    error.status = 400;
    throw error;
  }
};

const findUserWithToken = async (id) => {
  const SQL = `
    SELECT id, username FROM users WHERE id=$1;
  `;
  const response = await client.query(SQL, [id]);
  if (!response.rows.length) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  return response.rows[0];
};

const fetchUsers = async () => {
  const SQL = `
    SELECT id, username FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchProducts = async () => {
  const SQL = `
    SELECT * FROM products;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchProduct = async (id) => {
  const SQL = `
    SELECT * FROM products WHERE id=$1;
  `;
  const response = await client.query(SQL, [id]);
  console.log(id);
  console.log(response.rows);
  return response.rows;
};

const fetchCart = async (user_id) => {
  const SQL = `
    SELECT * FROM carts where user_id = $1;
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows[0];
};

const fetchCartProducts = async (cart_id) => {
  const SQL = `
    SELECT * FROM carts_products cp INNER JOIN products p ON cp.product_id = p.id WHERE cp.carts_id=$1;
  `;
  const response = await client.query(SQL, [cart_id]);
  return response.rows;
};

const createCartProducts = async (cart_id, product_id, quantity) => {
  const SQL = ` INSERT INTO carts_products(id, carts_id, product_id, quantity ) VALUES($1, $2, $3, $4) RETURNING *`;
  const response = await client.query(SQL, [
    uuid.v4(),
    cart_id,
    product_id,
    quantity,
  ]);
  return response.rows;
};

const removeProduct = async (product_id) => {
  const SQL = `DELETE FROM products WHERE id=$1`;
  const response = await client.query(SQL, [product_id]);
  return response;
};

const removeCartProduct = async (cart_id, product_id) => {
  const SQL = `DELETE FROM carts_products WHERE carts_id=;$1 AND product_id=$2 LIMIT 1`;
  const response = await client.query(SQL, [cart_id, product_id]);
  return response;
};

const checkout = async (cart_id) => {
  const SQL = `DELETE FROM carts_products WHERE carts_id=$1`;
  const response = await client.query(SQL, [cart_id]);
  return response;
};

module.exports = {
  client,
  checkout,
  createTables,
  createUser,
  createProduct,
  removeProduct,
  fetchUsers,
  fetchProduct,
  fetchProducts,
  fetchCart,
  fetchCartProducts,
  createCart,
  destroyCart,
  authenticate,
  findUserWithToken,
  createCartProducts,
  removeCartProduct,
};
