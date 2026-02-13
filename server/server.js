// server.js
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
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body && Object.keys(req.body).length > 0 ? req.body : '');
  next();
});

// ================== MODELS ==================
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "User" },
});

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  image: { type: String, default: null },
});

const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  stock: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  images: [String],
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: Array,
  totalAmount: Number,
  status: String,
  createdAt: { type: Date, default: Date.now },
});
const OrderModel = mongoose.model("Order", OrderSchema);

const UserModel = mongoose.model("User", UserSchema);
const CategoryModel = mongoose.model("Category", CategorySchema);
const ProductModel = mongoose.model("Product", ProductSchema);

// ================== JWT SECRET ==================
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// ================== MONGODB ==================
const username = "Mahmoud";
const password = "123";

const connectDB = async () => {
  try {
    const connectionString = `mongodb+srv://${username}:${password}@cluster0.ncnppey.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0`;
    await mongoose.connect(connectionString);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

// ================== AUTH MIDDLEWARE ==================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

// ================== ROUTES ==================

// Health
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// ================== AUTH ROUTES ==================

// Register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      role: role || "User",
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify token (keep user logged in on page reload)
app.get("/verifyToken", authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.userId).select("name email role");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================== CATEGORY ROUTES ==================

// Create Category (with optional image upload)
app.post("/createCategory", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { name, parentCategory } = req.body;
    if (!name) return res.status(400).json({ error: "Category name is required" });

    const existing = await CategoryModel.findOne({ name });
    if (existing) return res.status(400).json({ error: "Category already exists" });

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const category = new CategoryModel({
      name,
      parentCategory: parentCategory || null,
      image: imagePath
    });

    const savedCategory = await category.save();
    res.status(201).json({ message: "Category created successfully", category: savedCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Categories (include image so frontend can show category images)
app.get("/categories", async (req, res) => {
  try {
    const categories = await CategoryModel.find()
      .select("name parentCategory image")
      .lean();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================== PRODUCT ROUTES ==================

// Create Product
app.post("/createProduct", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { title, description, price, stock, category } = req.body;
    if (!title || !description || price === undefined || stock === undefined || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const categoryExists = await CategoryModel.findById(category);
    if (!categoryExists) return res.status(400).json({ error: "Invalid category ID" });

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const productDB = new ProductModel({
      title,
      description,
      price,
      stock,
      category,
      images: imagePath ? [imagePath] : [],
      sellerId: req.user.userId
    });

    const savedProduct = await productDB.save();
    res.status(201).json({ message: "Product created successfully", product: savedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Products (optional filter by category)
app.get("/products", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await ProductModel.find(filter).populate("category");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================== ADMIN ROUTES ==================

// Admin stats (users, sellers, products, categories counts)
app.get("/admin/stats", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Admin only" });
    }
    const [usersCount, sellersCount, productsCount, categoriesCount] = await Promise.all([
      UserModel.countDocuments({ role: "User" }),
      UserModel.countDocuments({ role: "Seller" }),
      ProductModel.countDocuments(),
      CategoryModel.countDocuments(),
    ]);
    res.status(200).json({
      usersCount,
      sellersCount,
      productsCount,
      categoriesCount,
      adminsCount: await UserModel.countDocuments({ role: "Admin" }),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: list customers (all users who are not Admin/Seller) – real data from DB
app.get("/admin/users", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "Admin") return res.status(403).json({ error: "Admin only" });
    // Include User, user, or any role that is not Admin/Seller (customers)
    const users = await UserModel.find({
      $or: [
        { role: "User" },
        { role: { $exists: false } },
        { role: null },
        { role: "" },
        { role: "user" },
        { role: "Customer" },
        { role: "customer" },
      ],
    })
      .select("name email _id role")
      .lean();
    const withStats = await Promise.all(
      users.map(async (u) => {
        const orders = await OrderModel.find({ customerId: u._id }).lean();
        const numberOfPurchases = orders.length;
        const totalPrice = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
        return { ...u, numberOfPurchases, totalPrice };
      })
    );
    res.status(200).json(withStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: add a new customer (user with role User)
app.post("/admin/users", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "Admin") return res.status(403).json({ error: "Admin only" });
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }
    const existing = await UserModel.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      role: "User",
    });
    await user.save();
    res.status(201).json({
      message: "Customer added successfully",
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: list sellers – real data from DB
app.get("/admin/sellers", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "Admin") return res.status(403).json({ error: "Admin only" });
    const sellers = await UserModel.find({ role: "Seller" }).select("name email _id").lean();
    const withStats = await Promise.all(
      sellers.map(async (s) => {
        const productsCount = await ProductModel.countDocuments({ sellerId: s._id });
        return { ...s, productsCount };
      })
    );
    res.status(200).json(withStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: list admins – real data from DB
app.get("/admin/admins", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "Admin") return res.status(403).json({ error: "Admin only" });
    const admins = await UserModel.find({ role: "Admin" }).select("name email _id role").lean();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================== START SERVER ==================
const startServer = async () => {
  await connectDB();
  app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
  });
};

startServer();
