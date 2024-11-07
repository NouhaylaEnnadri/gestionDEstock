const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override"); // Used for overriding POST to DELETE

const app = express();
const db = new sqlite3.Database("./database.db");

// Set EJS as the view engine
app.set("view engine", "ejs");

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"))); // Serve static files like CSS

// Method Override middleware for DELETE requests
app.use(methodOverride('_method'));

// Session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Create products table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL
    )
  `);
});

// Create users table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `);
});

// Routes

// Home Route (Displays products)
app.get("/", (req, res) => {
  db.all("SELECT * FROM products", (err, products) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Error retrieving products");
    }
    res.render("index", {
      userId: req.session.userId,
      products: products,
    });
  });
});

// Login Route (GET)
app.get("/login", (req, res) => {
  res.render("login");
});

// Login Route (POST)
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, user) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Error logging in");
      }
      if (user) {
        req.session.userId = user.id; // Store user session
        res.redirect("/");
      } else {
        res.send("Invalid credentials");
      }
    }
  );
});

// Register Route (GET)
app.get("/register", (req, res) => {
  res.render("register");
});

// Register Route (POST)
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password],
    (err) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Error registering");
      }
      res.redirect("/login");
    }
  );
});

// Add Product Route (GET)
app.get("/add-product", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  res.render("add-product");
});

// Add Product Route (POST)
app.post("/add-product", (req, res) => {
  const { name, quantity, price } = req.body;
  db.run(
    "INSERT INTO products (name, quantity, price) VALUES (?, ?, ?)",
    [name, quantity, price],
    (err) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Error adding product");
      }
      res.redirect("/");
    }
  );
});

// Logout Route
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Delete Product Route (POST)
app.post("/delete-product/:id", (req, res) => {
  const productId = req.params.id;

  db.run("DELETE FROM products WHERE id = ?", [productId], function (err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Error deleting product");
    }

    // Redirect to the homepage (product list) after deletion
    res.redirect("/");
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
