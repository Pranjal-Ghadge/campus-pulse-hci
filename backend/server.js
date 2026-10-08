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
const Comment = require("./models/Comment");
const Notification = require("./models/Notification");
const Department = require("./models/Department");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();

app.use(cors());
app.use(express.json());

const databaseReady = connectDB();

const ensureDemoStaffAccount = async () => {
  const email = "staff@campuspulse.com";
  const existingAccount = await User.findOne({ email });
  if (existingAccount) {
    if (existingAccount.role !== "staff") {
      console.warn(`Demo staff account ${email} already exists with a different role; leaving it unchanged.`);
    }
    return;
  }

  const password = await bcrypt.hash("Staff@123", 12);
  try {
    await User.create({
      name: "Campus Pulse Staff",
      email,
      password,
      role: "staff",
      department: "General",
    });
    console.log(`Demo staff account created: ${email}`);
  } catch (error) {
    if (error.code === 11000) return;
    throw error;
  }
};

const appReady = databaseReady.then(ensureDemoStaffAccount);

app.get("/", (req, res) => {
  res.json({
    message: "Campus Pulse backend is running",
  });
});

const formatUser = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department || null,
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

const authenticate = async (req, res, next) => {
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

const requireStudent = (req, res, next) => {
  if (req.user?.role !== "student") {
    return res.status(403).json({ message: "Student access is required." });
  }
  return next();
};

const requireStaff = (req, res, next) => {
  if (!["staff", "admin"].includes(req.user?.role)) {
    return res.status(403).json({ message: "Staff access is required." });
  }
  if (req.user.role === "staff" && !req.user.department) {
    return res.status(403).json({ message: "A department must be assigned to your staff account." });
  }
  return next();
};

const waitForDatabase = async (req, res, next) => {
  try {
    await appReady;
    return next();
  } catch (error) {
    console.error("Database connection is unavailable:", error.message);
    return res.status(503).json({ message: "Campus Pulse is temporarily unable to reach the database." });
  }
};

app.use("/api", waitForDatabase);

app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password, role: requestedRole } = req.body || {};
  const role = requestedRole === undefined ? "student" : requestedRole;
  console.log("Signup role received:", role);
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
  if (!["student", "staff"].includes(role)) {
    return res.status(400).json({ message: "Choose either a student or staff account type." });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      department: role === "staff" ? "General" : null,
    });
    console.log("User created:", user.email, user.role);
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

app.get("/api/auth/me", authenticate, (req, res) => {
  return res.json({ user: formatUser(req.user) });
});

app.patch("/api/auth/me", authenticate, async (req, res) => {
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
  submitted: "Submitted",
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

const formatIssue = (issue, currentUserId, comments = issue.comments || []) => {
  const createdAt = issue.createdAt || new Date();
  const status = issue.status || "submitted";
  const supporters = issue.supporters || [];

  return {
    _id: String(issue._id),
    databaseId: String(issue._id),
    id: issue.trackingId || String(issue._id),
    trackingId: issue.trackingId || String(issue._id),
    title: issue.title,
    description: issue.description,
    type: issue.type,
    category: issue.category,
    subcategory: issue.subcategory,
    location: issue.specificLocation
      ? `${issue.location} · ${issue.specificLocation}`
      : issue.location,
    specificLocation: issue.specificLocation,
    status: statusLabels[status] || status,
    statusCode: status,
    statusText: statusMessages[status] || status,
    assignedDepartment: issue.assignedDepartment || issue.assignedDepartmentId?.name || null,
    assignedTo: issue.assignedTo
      ? {
          id: String(issue.assignedTo._id || issue.assignedTo),
          name: issue.assignedTo.name,
          email: issue.assignedTo.email,
        }
      : null,
    assignedAt: issue.assignedAt,
    resolvedAt: issue.resolvedAt,
    resolutionNote: issue.resolutionNote || "",
    timeline: (issue.timeline || []).map((event) => ({
      id: String(event._id),
      action: event.action,
      status: event.status,
      note: event.note,
      actor: event.actor?.name || "Campus Pulse staff",
      createdAt: event.createdAt,
    })),
    comments: comments.map((comment) => ({
      id: String(comment._id),
      text: comment.text,
      user: comment.user?.name || "Campus Pulse user",
      role: comment.user?.role || "student",
      createdAt: comment.createdAt,
    })),
    reporter: issue.isAnonymous
      ? null
      : issue.reportedBy
        ? {
            name: issue.reportedBy.name,
            email: issue.reportedBy.email,
          }
        : null,
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

app.post("/api/issues", authenticate, requireStudent, async (req, res) => {
  console.log("POST /api/issues received");
  console.log("User:", req.user);
  console.log("Issue data:", req.body);

  const {
    title,
    description,
    type,
    category,
    subcategory,
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
          subcategory: typeof subcategory === "string" && subcategory.trim()
            ? subcategory.trim()
            : null,
          location: location.trim(),
          specificLocation: typeof specificLocation === "string" ? specificLocation.trim() : null,
          isAnonymous: isAnonymous === true,
          reportedBy: req.user._id,
          timeline: [{ actor: req.user._id, action: "Issue submitted", status: "submitted" }],
        });
        break;
      } catch (error) {
        if (error.code !== 11000 || attempt === 4) throw error;
      }
    }

    console.log("Issue saved:", issue._id);
    return res.status(201).json({
      success: true,
      issue: formatIssue(issue, req.user._id),
    });
  } catch (error) {
    console.error("Issue creation failed:", error);
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    const message = process.env.NODE_ENV === "production"
      ? "Unable to submit the issue right now. Please try again."
      : error.message || "Unable to submit the issue right now. Please try again.";
    return res.status(statusCode).json({ message });
  }
});

app.get("/api/issues", authenticate, requireStudent, async (req, res) => {
  try {
    const issues = await Issue.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });
    return res.json({ issues: issues.map((issue) => formatIssue(issue, req.user._id)) });
  } catch (error) {
    console.error("Issue list request failed:", error);
    return res.status(500).json({ message: "Unable to load issues right now. Please try again." });
  }
});

app.get("/api/issues/my", authenticate, requireStudent, async (req, res) => {
  try {
    const issues = await Issue.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });
    return res.json({ issues: issues.map((issue) => formatIssue(issue, req.user._id)) });
  } catch (error) {
    console.error("Student issue list request failed:", error);
    return res.status(500).json({ message: "Unable to load issues right now. Please try again." });
  }
});

app.get("/api/issues/:id", authenticate, requireStudent, async (req, res) => {
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

    await issue.populate([
      { path: "reportedBy", select: "name email" },
      { path: "assignedTo", select: "name email" },
      { path: "timeline.actor", select: "name" },
    ]);
    const comments = await Comment.find({ issue: issue._id })
      .populate("user", "name role")
      .sort({ createdAt: 1 });
    return res.json({ issue: formatIssue(issue, req.user._id, comments) });
  } catch (error) {
    console.error("Issue detail request failed:", error);
    return res.status(500).json({ message: "Unable to load this issue right now. Please try again." });
  }
});

app.get("/api/staff/issues", authenticate, requireStaff, async (req, res) => {
  try {
    const { status, category, department, search } = req.query;
    const query = {};
    const staffDepartment = req.user.department;
    if (status) query.status = status;
    if (category) query.category = category;
    if (department) query.assignedDepartment = String(department);
    if (search) {
      query.$or = [
        { title: { $regex: String(search), $options: "i" } },
        { trackingId: { $regex: String(search), $options: "i" } },
        { location: { $regex: String(search), $options: "i" } },
      ];
    }
    const issues = await Issue.find(query)
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });
    return res.json({
      issues: issues.map((issue) => formatIssue(issue, req.user._id)),
      department: staffDepartment,
    });
  } catch (error) {
    console.error("Staff issue list request failed:", error);
    return res.status(500).json({ message: "Unable to load staff issues right now." });
  }
});

app.get("/api/staff/users", authenticate, requireStaff, async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["staff", "admin"] },
    }).select("name email department");
    return res.json({ users: users.map((user) => formatUser(user)) });
  } catch (error) {
    console.error("Staff directory request failed:", error);
    return res.status(500).json({ message: "Unable to load the staff directory." });
  }
});

app.get("/api/staff/issues/:id", authenticate, requireStaff, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("reportedBy", "name email")
      .populate("assignedTo", "name email")
      .populate("timeline.actor", "name");
    if (!issue) return res.status(404).json({ message: "Issue not found." });
    const comments = await Comment.find({ issue: issue._id })
      .populate("user", "name role")
      .sort({ createdAt: 1 });
    return res.json({ issue: formatIssue(issue, req.user._id, comments) });
  } catch (error) {
    console.error("Staff issue detail request failed:", error);
    return res.status(500).json({ message: "Unable to load this issue right now." });
  }
});

const findStaffIssue = async (id, staff) => {
  const issue = await Issue.findById(id);
  if (!issue) return { error: { status: 404, message: "Issue not found." } };
  return { issue };
};

const notifyReporter = async (issue, title, message, type = "progress") => {
  await Notification.create({
    user: issue.reportedBy,
    issue: issue._id,
    title,
    message,
    type,
  });
};

app.put("/api/staff/issues/:id/status", authenticate, requireStaff, async (req, res) => {
  try {
    const { issue, error } = await findStaffIssue(req.params.id, req.user);
    if (error) return res.status(error.status).json({ message: error.message });
    const { status } = req.body || {};
    const transitions = {
      submitted: ["under_review"],
      under_review: ["in_progress"],
      reopened: ["under_review", "in_progress"],
      in_progress: ["under_review"],
      resolved: ["reopened"],
    };
    if (!transitions[issue.status]?.includes(status)) {
      return res.status(400).json({ message: "That issue status transition is not allowed." });
    }
    const note = typeof req.body?.note === "string" ? req.body.note.trim() : "";
    if (status === "reopened" && !note) {
      return res.status(400).json({ message: "Add a reason before reopening this issue." });
    }
    issue.status = status;
    issue.timeline.push({
      actor: req.user._id,
      action: `Status changed to ${statusLabels[status]}`,
      status,
      note,
    });
    await issue.save();
    await notifyReporter(
      issue,
      "Issue status updated",
      status === "reopened"
        ? `Your issue ${issue.trackingId} has been reopened.`
        : `Your issue ${issue.trackingId} is now ${statusLabels[status]}.`,
      status === "reopened" ? "action" : "progress"
    );
    return res.json({ success: true, issue: formatIssue(issue, req.user._id) });
  } catch (error) {
    console.error("Staff status update failed:", error);
    return res.status(500).json({ message: "Unable to update issue status." });
  }
});

app.put("/api/staff/issues/:id/assign", authenticate, requireStaff, async (req, res) => {
  try {
    const { issue, error } = await findStaffIssue(req.params.id, req.user);
    if (error) return res.status(error.status).json({ message: error.message });
    const assignedToId = req.body?.assignedTo || req.user._id;
    const assignee = await User.findOne({
      _id: assignedToId,
      role: { $in: ["staff", "admin"] },
    });
    if (!assignee) {
      return res.status(400).json({ message: "Choose a staff member in your department." });
    }
    const department = assignee.department
      ? await Department.findOne({ name: assignee.department, isActive: true })
      : null;
    issue.assignedTo = assignee._id;
    issue.assignedDepartment = assignee.department || req.user.department || null;
    issue.assignedDepartmentId = department?._id || null;
    issue.assignedAt = new Date();
    const statusChanged = issue.status === "submitted";
    if (statusChanged) issue.status = "under_review";
    issue.timeline.push({
      actor: req.user._id,
      action: `Assigned to ${assignee.name}`,
      status: issue.status,
    });
    if (statusChanged) {
      issue.timeline.push({
        actor: req.user._id,
        action: "Status changed to Under Review",
        status: "under_review",
      });
    }
    await issue.save();
    await notifyReporter(
      issue,
      statusChanged ? "Issue under review" : "Issue assigned",
      statusChanged
        ? `Your issue ${issue.trackingId} is now Under Review and has been assigned${issue.assignedDepartment ? ` to ${issue.assignedDepartment}` : ""}.`
        : `Your issue ${issue.trackingId} has been assigned${issue.assignedDepartment ? ` to ${issue.assignedDepartment}` : ""}.`
    );
    await issue.populate("assignedTo", "name email");
    return res.json({ success: true, issue: formatIssue(issue, req.user._id) });
  } catch (error) {
    console.error("Issue assignment failed:", error);
    return res.status(500).json({ message: "Unable to assign this issue." });
  }
});

app.post("/api/staff/issues/:id/comments", authenticate, requireStaff, async (req, res) => {
  try {
    const { issue, error } = await findStaffIssue(req.params.id, req.user);
    if (error) return res.status(error.status).json({ message: error.message });
    const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
    if (!text || text.length > 2000) {
      return res.status(400).json({ message: "Enter a comment of up to 2,000 characters." });
    }
    const comment = await Comment.create({ issue: issue._id, user: req.user._id, text });
    issue.commentsCount += 1;
    issue.timeline.push({ actor: req.user._id, action: "Staff update added", status: issue.status, note: text });
    await issue.save();
    await notifyReporter(
      issue,
      "New issue update",
      `Staff added an update to your issue ${issue.trackingId}.`,
      "update"
    );
    await comment.populate("user", "name role");
    return res.status(201).json({
      success: true,
      comment: {
        id: String(comment._id),
        text: comment.text,
        user: comment.user.name,
        role: comment.user.role,
        createdAt: comment.createdAt,
      },
    });
  } catch (error) {
    console.error("Staff comment creation failed:", error);
    return res.status(500).json({ message: "Unable to add this update." });
  }
});

app.put("/api/staff/issues/:id/resolve", authenticate, requireStaff, async (req, res) => {
  try {
    const { issue, error } = await findStaffIssue(req.params.id, req.user);
    if (error) return res.status(error.status).json({ message: error.message });
    const resolutionNote = typeof req.body?.resolutionNote === "string"
      ? req.body.resolutionNote.trim()
      : "";
    if (issue.status !== "in_progress" || !resolutionNote) {
      return res.status(400).json({
        message: "Move the issue to In Progress and record the action taken before resolving it.",
      });
    }
    issue.status = "resolved";
    issue.resolvedAt = new Date();
    issue.resolutionNote = resolutionNote;
    issue.timeline.push({
      actor: req.user._id,
      action: "Issue resolved",
      status: "resolved",
      note: resolutionNote,
    });
    await issue.save();
    await notifyReporter(
      issue,
      "Issue resolved",
      `Your issue ${issue.trackingId} has been resolved.`,
      "resolved"
    );
    return res.json({ success: true, issue: formatIssue(issue, req.user._id) });
  } catch (error) {
    console.error("Issue resolution failed:", error);
    return res.status(500).json({ message: "Unable to resolve this issue." });
  }
});

app.put("/api/issues/:id/reopen", authenticate, requireStudent, async (req, res) => {
  try {
    const issue = await Issue.findOne({ _id: req.params.id, reportedBy: req.user._id });
    if (!issue) return res.status(404).json({ message: "Issue not found." });
    if (issue.status !== "resolved") {
      return res.status(400).json({ message: "Only resolved issues can be reopened." });
    }
    const note = typeof req.body?.note === "string" ? req.body.note.trim() : "";
    if (!note) return res.status(400).json({ message: "Explain why the issue needs another review." });
    issue.status = "reopened";
    issue.timeline.push({ actor: req.user._id, action: "Issue reopened by student", status: "reopened", note });
    await issue.save();
    await notifyReporter(issue, "Issue reopened", `Your issue ${issue.trackingId} has been reopened.`, "action");
    return res.json({ success: true, issue: formatIssue(issue, req.user._id) });
  } catch (error) {
    console.error("Issue reopen failed:", error);
    return res.status(500).json({ message: "Unable to reopen this issue." });
  }
});

app.get("/api/notifications", authenticate, requireStudent, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate("issue", "trackingId title")
      .sort({ createdAt: -1 });
    return res.json({
      notifications: notifications.map((notification) => ({
        id: String(notification._id),
        title: notification.title,
        message: notification.message,
        type: notification.type,
        unread: !notification.isRead,
        issueId: notification.issue?.trackingId || "",
        databaseIssueId: notification.issue?._id ? String(notification.issue._id) : null,
        createdAt: notification.createdAt,
      })),
    });
  } catch (error) {
    console.error("Notification list request failed:", error);
    return res.status(500).json({ message: "Unable to load notifications." });
  }
});

app.put("/api/notifications/:id/read", authenticate, requireStudent, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: "Notification not found." });
    return res.json({ success: true });
  } catch (error) {
    console.error("Notification read update failed:", error);
    return res.status(500).json({ message: "Unable to update notification." });
  }
});

app.put("/api/notifications/read-all", authenticate, requireStudent, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    return res.json({ success: true });
  } catch (error) {
    console.error("Mark all notifications as read failed:", error);
    return res.status(500).json({ message: "Unable to update notifications." });
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