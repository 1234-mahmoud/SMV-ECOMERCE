const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();

// ================== MULTER CONFIG ==================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image"), false);
  }
};

const upload = multer({ storage, fileFilter });

// ================== MIDDLEWARE ==================
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// serve images
app.use("/uploads", express.static("uploads"));

// Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body && Object.keys(req.body).length > 0 ? req.body : '');
  next();
});

// ================== MODELS ==================
const ProductModel = require('./models/productSchema');
const UserModel = require('./models/userSchema');

// ================== JWT SECRET ==================
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// ================== MONGODB ==================
const username = "Mahmoud";
const password = "123";

const connectDB = async () => {
  try {
    const connectionString = `mongodb+srv://${username}:${password}@cluster0.ncnppey.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0`;
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(connectionString);
    console.log("Connected to MongoDB successfully");
    console.log(`Database: ecommerce`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

// ================== ROUTES ==================

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "Server is running", 
    status: "ok",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products", message: error.message });
  }
});

// ================== AUTH MIDDLEWARE ==================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

// ================== AUTH ROUTES ==================

// Register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        error: "Missing required fields", 
        required: ["name", "email", "password", "role"] 
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role
    });

    const savedUser = await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: savedUser._id, 
        email: savedUser.email, 
        role: savedUser.role 
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ 
      error: "Failed to register user", 
      message: error.message 
    });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email and password are required" 
      });
    }

    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check role if provided
    if (role && user.role !== role) {
      return res.status(403).json({ error: "Access denied. Invalid role." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ 
      error: "Failed to login", 
      message: error.message 
    });
  }
});

// Verify token endpoint
app.get("/verifyToken", authenticateToken, (req, res) => {
  res.status(200).json({
    valid: true,
    user: req.user
  });
});

// Create product (with image) --> single image only for each product
app.post("/createProduct", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { title, description, price, stock, category } = req.body;

    if (!title || !description || price === undefined || stock === undefined) {
      return res.status(400).json({ 
        error: "Missing required fields", 
        required: ["title", "description", "price", "stock","category"] 
      });
    }

    if (isNaN(price) || isNaN(stock)) {
      return res.status(400).json({ 
        error: "Price and stock must be valid numbers" 
      });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const productDB = new ProductModel({
      title,
      description,
      price,
      stock,
      category,
      images: imagePath ? [imagePath] : [],
    });

    const savedProduct = await productDB.save();
    console.log("Product saved successfully:", savedProduct._id);

    res.status(201).json({ 
      message: "Product created successfully", 
      product: savedProduct 
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ 
      error: "Failed to create product", 
      message: error.message 
    });
  }
});

// ================== START SERVER ==================
const startServer = async () => {
  await connectDB();
  
  app.listen(3000, () => {
    console.log("🚀 Server is running on http://localhost:3000");
  });
};

startServer();
