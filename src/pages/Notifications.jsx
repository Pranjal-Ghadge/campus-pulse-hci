import React, { useEffect, useState } from "react";
import { FileText, Users, Check, Lightbulb, Bell, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";

function Notifications() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiRequest("/api/notifications")
      .then(({ notifications: loaded }) => {
        if (active) setNotifications((loaded || []).map((notification) => ({
          ...notification,
          icon: ({
            progress: FileText,
            support: Users,
            action: Check,
            update: Lightbulb,
            community: Bell,
            resolved: CheckCircle,
          })[notification.type] || Bell,
          time: new Date(notification.createdAt).toLocaleString(),
          group: new Date(notification.createdAt).toDateString() === new Date().toDateString()
            ? "Today"
            : "Earlier",
        })));
      })
      .catch((error) => {
        if (active) setLoadError(error.message || "Unable to load notifications.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, []);

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

  const markAsRead = async (id) => {
    try {
    await apiRequest(`/api/notifications/${encodeURIComponent(id)}/read`, { method: "PUT" });
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
    } catch (error) {
    setLoadError(error.message || "Unable to update this notification.");
    }
  };

  const markAllAsRead = async () => {
    try {
    await apiRequest("/api/notifications/read-all", { method: "PUT" });
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
    } catch (error) {
    setLoadError(error.message || "Unable to update notifications.");
    }
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
      role="group"
      tabIndex={0}
      aria-label={`${notification.unread ? "Unread" : "Read"} notification: ${notification.title}`}
      onClick={() => markAsRead(notification.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          markAsRead(notification.id);
        }
      }}
      className={`group relative rounded-2xl border p-5 transition ${
        notification.unread
          ? "border-sky-100 bg-sky-50/50"
          : "border-gray-200 bg-white"
      } hover:border-sky-200 hover:shadow-sm`}
    >
      <div className="flex gap-4">

        {/* Icon */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${getIconStyle(
            notification.type
          )}`}
        >
          <notification.icon size={20} />
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
                  <span role="img" aria-label="Unread" className="h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                )}

              </div>

              <p className="mt-1 text-xs text-gray-400">
                Issue #{notification.issueId}
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                {notification.unread ? "Unread" : "Read"}
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
                  if (notification.databaseIssueId) navigate(`/issues/${encodeURIComponent(notification.databaseIssueId)}`);
                }}
                className="rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-600"
              >
                Verify Resolution
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (notification.databaseIssueId) navigate(`/issues/${encodeURIComponent(notification.databaseIssueId)}`);
                }}
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
                if (notification.databaseIssueId) navigate(`/issues/${encodeURIComponent(notification.databaseIssueId)}`);
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
    <div className="min-h-screen bg-gray-50 px-6 py-8 lg:px-10 pt-20 lg:pt-8 lg:ml-64">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="mb-2 text-sm font-medium text-sky-600">
              Stay Updated
            </p>

            <h1 className="text-2xl font-semibold text-slate-900">
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

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sky-600 shadow-sm">
              <Bell size={20} />
            </div>

            <div>
              <p aria-live="polite" className="font-semibold text-slate-800">
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
              aria-pressed={activeFilter === filter}
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

        {loadError && <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{loadError}</p>}

        {isLoading && <p role="status" className="mb-4 rounded-lg bg-white p-5 text-sm text-slate-500">Loading notifications...</p>}

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
        {filteredNotifications.length === 0 && !isLoading && !loadError && (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-sky-600">
              <Bell size={28} />
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