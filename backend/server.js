const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { randomBytes, randomInt } = require("crypto");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const Issue = require("./models/Issue");
const User = require("./models/User");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "Campus Pulse backend is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const developmentUserEmail = process.env.DEV_USER_EMAIL || "student@campus.edu";
let developmentUserPromise;

const getDevelopmentUser = () => {
  if (!developmentUserPromise) {
    developmentUserPromise = (async () => {
      const password = await bcrypt.hash(randomBytes(32).toString("hex"), 10);
      return User.findOneAndUpdate(
        { email: developmentUserEmail },
        {
          $setOnInsert: {
            name: "Student",
            password,
            role: "student",
          },
        },
        { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
      );
    })();
    developmentUserPromise.catch(() => {
      developmentUserPromise = null;
    });
  }
  return developmentUserPromise;
};

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

app.post("/api/issues", async (req, res) => {
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
    const developmentUser = await getDevelopmentUser();
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
          reportedBy: developmentUser._id,
        });
        break;
      } catch (error) {
        if (error.code !== 11000 || attempt === 4) throw error;
      }
    }

    return res.status(201).json({ issue: formatIssue(issue, developmentUser._id) });
  } catch (error) {
    console.error("Issue creation failed:", error);
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    return res.status(statusCode).json({ message: "Unable to submit the issue right now. Please try again." });
  }
});

app.get("/api/issues", async (req, res) => {
  try {
    const developmentUser = await getDevelopmentUser();
    const issues = await Issue.find({ reportedBy: developmentUser._id }).sort({ createdAt: -1 });
    return res.json({ issues: issues.map((issue) => formatIssue(issue, developmentUser._id)) });
  } catch (error) {
    console.error("Issue list request failed:", error);
    return res.status(500).json({ message: "Unable to load issues right now. Please try again." });
  }
});

app.get("/api/issues/:id", async (req, res) => {
  try {
    const developmentUser = await getDevelopmentUser();
    const issueIdentity = mongoose.isValidObjectId(req.params.id)
      ? { _id: req.params.id }
      : { trackingId: req.params.id };
    const issue = await Issue.findOne({
      ...issueIdentity,
      reportedBy: developmentUser._id,
    });

    if (!issue) {
      return res.status(404).json({ message: "Issue not found." });
    }

    return res.json({ issue: formatIssue(issue, developmentUser._id) });
  } catch (error) {
    console.error("Issue detail request failed:", error);
    return res.status(500).json({ message: "Unable to load this issue right now. Please try again." });
  }
});

app.use((error, req, res, next) => {
  console.error("API request failed:", error);
  return res.status(error.status || 500).json({ message: "The server could not complete this request." });
});