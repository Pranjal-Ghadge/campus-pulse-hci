const mongoose = require("mongoose");

const issueEventSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      default: null,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

const issueSchema = new mongoose.Schema(
  {
    trackingId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "problem",
        "improvement",
        "safety",
        "question",
        "appreciation",
      ],
      default: "problem",
    },

    category: {
      type: String,
      required: true,
    },

    subcategory: {
      type: String,
      default: null,
    },

    location: {
      type: String,
      required: true,
    },

    specificLocation: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "submitted",
        "under_review",
        "in_progress",
        "resolved",
        "reopened",
      ],
      default: "submitted",
    },

    isAnonymous: {
      type: Boolean,
      default: false,
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedDepartment: {
      type: String,
      default: null,
    },

    assignedDepartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    assignedAt: {
      type: Date,
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    resolutionNote: {
      type: String,
      default: "",
      trim: true,
    },

    timeline: {
      type: [issueEventSchema],
      default: [],
    },

    supporters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    commentsCount: {
      type: Number,
      default: 0,
    },

    verificationStatus: {
      type: String,
      enum: [
        "not_required",
        "pending",
        "verified",
        "rejected",
      ],
      default: "not_required",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Issue", issueSchema);