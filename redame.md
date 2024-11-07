
````markdown
# Gestion de Stock

A simple inventory management system built with **Node.js**, **Express**, **SQLite**, and **EJS** for the front end. This project allows users to log in, register, add products to an inventory, and view the products in the system.

## Features

- User authentication (Login and Register)
- Add and display products (product name, quantity, and price)
- Session management to keep track of logged-in users
- Responsive design with CSS animations (Customize it as needed)

## Project Structure

```
gestionDEstock/
├── db/
│   └── database.js            # Database setup and connection
├── public/
│   ├── css/
│   │   └── styles.css         # Stylesheet for the app
│   └── js/
│       └── app.js             # Optional JavaScript for additional client functionality
├── views/
│   ├── index.html             # Main page to view all products
│   └── add-product.html       # Form page to add a new product
├── server.js                  # Main server file
├── package.json               # Project dependencies and scripts
└── README.md                  # Project setup and instructions
```


## Technologies Used

- **Node.js** - Server-side JavaScript runtime
- **Express** - Web framework for Node.js
- **SQLite** - Database engine to store products and user data
- **EJS** - Templating engine to render dynamic HTML pages
- **CSS** - Custom styles with animations (modify as needed)

## Installation

Follow these steps to set up the project locally:

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/gestion-de-stock.git
cd gestion-de-stock
```
````

### 2. Install dependencies

Make sure you have **Node.js** installed. You can download it from [here](https://nodejs.org/).

Run the following command to install the required dependencies:

```bash
npm install
```

### 3. Set up the database

The SQLite database will be automatically created when the server starts. The database file is named `database.db`. The application will create the necessary tables for users and products upon startup.

### 4. Start the server

Run the following command to start the server:

```bash
node server.js
```

The application will be running on `http://localhost:3000`.

## Usage

- **Login**: Go to `/login` and enter your username and password. You can register a new user at `/register`.
- **Register**: Go to `/register` to create a new user account.
- **Add Product**: After logging in, you can add new products by visiting `/add-product`.
- **View Products**: On the homepage (`/`), you can view the products added to the inventory.

### Routes

- `/` - Home page that displays the products.
- `/login` - Login page.
- `/register` - Registration page for new users.
- `/add-product` - Page to add new products (accessible only to logged-in users).
- `/logout` - Log out the current user.

## Customization

You can customize the project by:

- Modifying the **CSS** for a more personalized design.
- Adding new routes or modifying the existing routes as per your requirements.
- Updating the database schema to include more features (e.g., product categories, user roles).

## Troubleshooting

If you encounter issues, ensure that:

- You have **Node.js** and **npm** installed.
- The database file (`database.db`) is created in your project directory.
- You have installed the required dependencies by running `npm install`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```

### Key Sections in the `README.md`:

1. **Project Overview**: A brief explanation of the project and its features.
2. **Technologies Used**: A list of technologies that power the app.
3. **Installation**: Step-by-step guide on how to set up the project on your local machine.
4. **Usage**: Details about how to use the app once it’s running.
5. **Customization**: Suggestions for personalizing the project.
6. **Troubleshooting**: Common issues that could arise and their solutions.

```
