const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const app = express();
const db = new sqlite3.Database("./database.db");

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"))); // Serve static files like CSS
app.use(methodOverride('_method'));

// Session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Create tables if they don't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)`);
  db.run(`CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, quantity INTEGER NOT NULL, price REAL NOT NULL)`);
});

// Routes

// Home Route
app.get("/", (req, res) => {
  db.all("SELECT * FROM products", (err, products) => {
    if (err) return res.status(500).send("Error retrieving products");
    res.render("index", { userId: req.session.userId, products });
  });
});

// Register Route (GET)
app.get("/register", (req, res) => {
  res.render("register");
});

// Register Route (POST)
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], (err) => {
    if (err) return res.status(500).send("Error registering user");
    res.redirect("/login");
  });
});

// Login Route (GET)
app.get("/login", (req, res) => {
  res.render("login");
});

// Login Route (POST)
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT id FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
    if (err || !row) return res.status(401).send("Invalid credentials");
    req.session.userId = row.id;
    res.redirect("/");
  });
});

// Logout Route
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// Add Product Route (GET)
app.get("/add-product", (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  res.render("add-product");
});

// Add Product Route (POST)
app.post("/add-product", (req, res) => {
  const { name, quantity, price } = req.body;
  db.run("INSERT INTO products (name, quantity, price) VALUES (?, ?, ?)", [name, quantity, price], (err) => {
    if (err) return res.status(500).send("Error adding product");
    res.redirect("/");
  });
});

// Edit Product Route (GET)
app.get("/edit-product/:id", (req, res) => {
  const productId = req.params.id;
  db.get("SELECT * FROM products WHERE id = ?", [productId], (err, product) => {
    if (err || !product) return res.status(404).send("Product not found");
    res.render("edit-product", { product });
  });
});

// Edit Product Route (PUT)
app.put("/edit-product/:id", (req, res) => {
  const productId = req.params.id;
  const { name, quantity, price } = req.body;
  db.run("UPDATE products SET name = ?, quantity = ?, price = ? WHERE id = ?", [name, quantity, price, productId], (err) => {
    if (err) return res.status(500).send("Error updating product");
    res.redirect("/");
  });
});

// Delete Product Route (DELETE)
app.delete("/delete-product/:id", (req, res) => {
  const productId = req.params.id;
  db.run("DELETE FROM products WHERE id = ?", [productId], (err) => {
    if (err) return res.status(500).send("Error deleting product");
    res.redirect("/");
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
