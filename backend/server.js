const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomInt } = require("crypto");
const path = require("path");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const Issue = require("./models/Issue");
const User = require("./models/User");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();

app.use(cors());
app.use(express.json());

const databaseReady = connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "Campus Pulse backend is running",
  });
});

const formatUser = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
});

const createAuthToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }
  return jwt.sign({}, process.env.JWT_SECRET, {
    subject: String(user._id),
    expiresIn: "7d",
  });
};

const requireAuth = async (req, res, next) => {
  const authorization = req.get("authorization") || "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";

  if (!token) {
    return res.status(401).json({ message: "Please log in to continue." });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured.");
    return res.status(500).json({ message: "Authentication is temporarily unavailable." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof payload !== "object" || typeof payload.sub !== "string") {
      return res.status(401).json({ message: "Your session is invalid. Please log in again." });
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: "Your account is no longer available. Please log in again." });
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Your session has expired. Please log in again." });
    }
    console.error("Authentication verification failed:", error);
    return res.status(500).json({ message: "Unable to verify your session right now." });
  }
};

const waitForDatabase = async (req, res, next) => {
  try {
    await databaseReady;
    return next();
  } catch (error) {
    console.error("Database connection is unavailable:", error.message);
    return res.status(503).json({ message: "Campus Pulse is temporarily unable to reach the database." });
  }
};

app.use("/api", waitForDatabase);

app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body || {};
  const normalizedName = typeof name === "string" ? name.trim() : "";
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!normalizedName || normalizedName.length > 100) {
    return res.status(400).json({ message: "Enter your name (up to 100 characters)." });
  }
  if (!emailPattern.test(normalizedEmail) || normalizedEmail.length > 254) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }
  if (typeof password !== "string" || password.length < 8 || password.length > 128) {
    return res.status(400).json({ message: "Choose a password between 8 and 128 characters." });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      role: "student",
    });
    return res.status(201).json({
      message: "Account created successfully. Please log in.",
      user: formatUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Please check your name, email, and password." });
    }
    console.error("Account signup failed:", error);
    return res.status(500).json({ message: "Unable to create your account right now. Please try again." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!email || !password) {
    return res.status(400).json({ message: "Enter your email and password." });
  }
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured.");
    return res.status(500).json({ message: "Authentication is temporarily unavailable." });
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }

    const token = createAuthToken(user);
    return res.json({ token, user: formatUser(user) });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ message: "Unable to log in right now. Please try again." });
  }
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  return res.json({ user: formatUser(req.user) });
});

app.patch("/api/auth/me", requireAuth, async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  if (!name || name.length > 100) {
    return res.status(400).json({ message: "Enter your name (up to 100 characters)." });
  }

  try {
    req.user.name = name;
    await req.user.save();
    return res.json({ user: formatUser(req.user) });
  } catch (error) {
    console.error("Profile update failed:", error);
    return res.status(500).json({ message: "Unable to save your profile right now. Please try again." });
  }
});

const statusLabels = {
  submitted: "Reported",
  under_review: "Under Review",
  in_progress: "In Progress",
  resolved: "Resolved",
  reopened: "Reopened",
};

const statusMessages = {
  submitted: "Submitted successfully",
  under_review: "Being reviewed",
  in_progress: "Work is in progress",
  resolved: "Resolved",
  reopened: "Reopened for review",
};

const formatUpdatedTime = (date) => {
  const minutes = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatIssue = (issue, currentUserId) => {
  const createdAt = issue.createdAt || new Date();
  const status = issue.status || "submitted";
  const supporters = issue.supporters || [];

  return {
    databaseId: String(issue._id),
    id: issue.trackingId || String(issue._id),
    trackingId: issue.trackingId || String(issue._id),
    title: issue.title,
    description: issue.description,
    type: issue.type,
    category: issue.category,
    location: issue.specificLocation
      ? `${issue.location} · ${issue.specificLocation}`
      : issue.location,
    specificLocation: issue.specificLocation,
    status: statusLabels[status] || status,
    statusText: statusMessages[status] || status,
    affected: supporters.length + 1,
    supportedByCurrentUser: supporters.some(
      (supporter) => String(supporter) === String(currentUserId)
    ),
    updated: formatUpdatedTime(issue.updatedAt || createdAt),
    date: new Date(createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    anonymous: issue.isAnonymous,
    hasPhoto: false,
  };
};

app.post("/api/issues", requireAuth, async (req, res) => {
  const {
    title,
    description,
    type,
    category,
    location,
    specificLocation,
    isAnonymous,
  } = req.body || {};

  const allowedTypes = ["problem", "improvement", "safety", "question", "appreciation"];
  if (
    typeof description !== "string" ||
    description.trim().length < 10 ||
    !allowedTypes.includes(type) ||
    typeof category !== "string" ||
    !category.trim() ||
    typeof location !== "string" ||
    !location.trim()
  ) {
    return res.status(400).json({ message: "Please provide a valid issue type, category, description, and location." });
  }

  try {
    let issue;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const trackingId = `CP-${new Date().getFullYear()}-${String(randomInt(0, 100000)).padStart(5, "0")}`;
      try {
        issue = await Issue.create({
          trackingId,
          title: typeof title === "string" && title.trim()
            ? title.trim()
            : description.trim().slice(0, 50),
          description: description.trim(),
          type,
          category: category.trim(),
          location: location.trim(),
          specificLocation: typeof specificLocation === "string" ? specificLocation.trim() : null,
          isAnonymous: isAnonymous === true,
          reportedBy: req.user._id,
        });
        break;
      } catch (error) {
        if (error.code !== 11000 || attempt === 4) throw error;
      }
    }

    return res.status(201).json({ issue: formatIssue(issue, req.user._id) });
  } catch (error) {
    console.error("Issue creation failed:", error);
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    const message = process.env.NODE_ENV === "production"
      ? "Unable to submit the issue right now. Please try again."
      : error.message || "Unable to submit the issue right now. Please try again.";
    return res.status(statusCode).json({ message });
  }
});

app.get("/api/issues", requireAuth, async (req, res) => {
  try {
    const issues = await Issue.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });
    return res.json({ issues: issues.map((issue) => formatIssue(issue, req.user._id)) });
  } catch (error) {
    console.error("Issue list request failed:", error);
    return res.status(500).json({ message: "Unable to load issues right now. Please try again." });
  }
});

app.get("/api/issues/:id", requireAuth, async (req, res) => {
  try {
    const issueIdentity = mongoose.isValidObjectId(req.params.id)
      ? { _id: req.params.id }
      : { trackingId: req.params.id };
    const issue = await Issue.findOne({
      ...issueIdentity,
      reportedBy: req.user._id,
    });

    if (!issue) {
      return res.status(404).json({ message: "Issue not found." });
    }

    return res.json({ issue: formatIssue(issue, req.user._id) });
  } catch (error) {
    console.error("Issue detail request failed:", error);
    return res.status(500).json({ message: "Unable to load this issue right now. Please try again." });
  }
});

app.use((error, req, res, next) => {
  console.error("API request failed:", error);
  return res.status(error.status || 500).json({ message: "The server could not complete this request." });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;