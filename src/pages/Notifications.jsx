import React, { useState } from "react";

function Notifications() {
  const [activeFilter, setActiveFilter] = useState("All");

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "progress",
      title: "Your issue is being investigated",
      message:
        "Library Wi-Fi Connectivity Problem has been assigned to the IT department.",
      time: "10 minutes ago",
      group: "Today",
      unread: true,
      issueId: "CP-1024",
      icon: "📋",
    },
    {
      id: 2,
      type: "support",
      title: "Your issue reached 100 supporters",
      message:
        "More students are reporting the same Library Wi-Fi problem.",
      time: "1 hour ago",
      group: "Today",
      unread: true,
      issueId: "CP-1024",
      icon: "👥",
    },
    {
      id: 3,
      type: "action",
      title: "Resolution needs your verification",
      message:
        "The AC issue in Room 204 has been marked as resolved. Please confirm whether the problem has been fixed.",
      time: "3 hours ago",
      group: "Today",
      unread: true,
      issueId: "CP-1018",
      icon: "✓",
      action: true,
    },
    {
      id: 4,
      type: "update",
      title: "Your suggestion is under review",
      message:
        "Your suggestion for additional charging points in the library is being reviewed.",
      time: "Yesterday",
      group: "Earlier",
      unread: false,
      issueId: "CP-0997",
      icon: "💡",
    },
    {
      id: 5,
      type: "community",
      title: "An issue you supported was updated",
      message:
        "The water dispenser maintenance issue has been assigned to Facilities.",
      time: "Yesterday",
      group: "Earlier",
      unread: false,
      issueId: "CP-1009",
      icon: "🔔",
    },
    {
      id: 6,
      type: "resolved",
      title: "Issue resolved",
      message:
        "The classroom AC issue you reported has been resolved.",
      time: "2 days ago",
      group: "Earlier",
      unread: false,
      issueId: "CP-1018",
      icon: "🎉",
    },
  ]);

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "Unread") {
      return notification.unread;
    }

    if (activeFilter === "Issues") {
      return (
        notification.type === "progress" ||
        notification.type === "resolved" ||
        notification.type === "action"
      );
    }

    if (activeFilter === "Updates") {
      return (
        notification.type === "support" ||
        notification.type === "community" ||
        notification.type === "update"
      );
    }

    return true;
  });

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const getIconStyle = (type) => {
    if (type === "action") {
      return "bg-amber-50 text-amber-600";
    }

    if (type === "resolved") {
      return "bg-emerald-50 text-emerald-600";
    }

    if (type === "support") {
      return "bg-violet-50 text-violet-600";
    }

    return "bg-sky-50 text-sky-600";
  };

  const renderNotification = (notification) => (
    <div
      key={notification.id}
      onClick={() => markAsRead(notification.id)}
      className={`group relative rounded-2xl border p-5 transition ${
        notification.unread
          ? "border-sky-100 bg-sky-50/50"
          : "border-gray-200 bg-white"
      } hover:border-sky-200 hover:shadow-sm`}
    >
      <div className="flex gap-4">

        {/* Icon */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${getIconStyle(
            notification.type
          )}`}
        >
          {notification.icon}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-3">

            <div>
              <div className="flex items-center gap-2">

                <h3
                  className={`text-sm ${
                    notification.unread
                      ? "font-semibold text-slate-900"
                      : "font-medium text-slate-800"
                  }`}
                >
                  {notification.title}
                </h3>

                {notification.unread && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                )}

              </div>

              <p className="mt-1 text-xs text-gray-400">
                Issue #{notification.issueId}
              </p>
            </div>

            <span className="shrink-0 text-xs text-gray-400">
              {notification.time}
            </span>

          </div>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            {notification.message}
          </p>

          {/* Action */}
          {notification.action && (
            <div className="mt-4 flex flex-wrap gap-2">

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  markAsRead(notification.id);
                }}
                className="rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-600"
              >
                Verify Resolution
              </button>

              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition hover:bg-gray-50"
              >
                View Issue
              </button>

            </div>
          )}

          {/* Normal view button */}
          {!notification.action && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                markAsRead(notification.id);
              }}
              className="mt-3 text-xs font-semibold text-sky-600 hover:text-sky-700"
            >
              View Issue →
            </button>
          )}

        </div>
      </div>
    </div>
  );

  const todayNotifications = filteredNotifications.filter(
    (notification) => notification.group === "Today"
  );

  const earlierNotifications = filteredNotifications.filter(
    (notification) => notification.group === "Earlier"
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="mb-2 text-sm font-medium text-sky-600">
              Stay Updated
            </p>

            <h1 className="text-3xl font-bold text-slate-900">
              Notifications
            </h1>

            <p className="mt-2 text-slate-500">
              Updates about your issues and the campus community.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="w-fit rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-sky-200 hover:text-sky-600"
            >
              Mark all as read
            </button>
          )}

        </div>

        {/* Notification Summary */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-sky-100 bg-sky-50 p-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl shadow-sm">
              🔔
            </div>

            <div>
              <p className="font-semibold text-slate-800">
                {unreadCount === 0
                  ? "You're all caught up!"
                  : `${unreadCount} unread notification${
                      unreadCount > 1 ? "s" : ""
                    }`}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                We'll let you know when something important changes.
              </p>
            </div>

          </div>

          <div className="text-left sm:text-right">
            <p className="text-2xl font-bold text-sky-600">
              {notifications.length}
            </p>

            <p className="text-xs text-gray-500">
              total notifications
            </p>
          </div>

        </div>

        {/* Filters */}
        <div className="mb-7 flex gap-2 overflow-x-auto pb-1">

          {["All", "Unread", "Issues", "Updates"].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeFilter === filter
                  ? "bg-sky-500 text-white"
                  : "border border-gray-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-600"
              }`}
            >
              {filter}

              {filter === "Unread" && unreadCount > 0 && (
                <span
                  className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${
                    activeFilter === filter
                      ? "bg-white/20 text-white"
                      : "bg-sky-50 text-sky-600"
                  }`}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          ))}

        </div>

        {/* Today */}
        {todayNotifications.length > 0 && (
          <section className="mb-8">

            <div className="mb-3 flex items-center gap-3">
              <h2 className="text-sm font-semibold text-slate-800">
                Today
              </h2>

              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="space-y-3">
              {todayNotifications.map(renderNotification)}
            </div>

          </section>
        )}

        {/* Earlier */}
        {earlierNotifications.length > 0 && (
          <section>

            <div className="mb-3 flex items-center gap-3">
              <h2 className="text-sm font-semibold text-slate-800">
                Earlier
              </h2>

              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="space-y-3">
              {earlierNotifications.map(renderNotification)}
            </div>

          </section>
        )}

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-2xl">
              🔔
            </div>

            <h2 className="font-semibold text-slate-900">
              No notifications here
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              You're all caught up for this filter.
            </p>

          </div>
        )}

      </div>
    </div>
  );
}

export default Notifications;