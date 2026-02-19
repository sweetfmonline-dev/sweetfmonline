"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageCircle, Send, User, Clock } from "lucide-react";

interface Comment {
  id: string;
  article_slug: string;
  author_name: string;
  content: string;
  created_at: string;
}

interface CommentsSectionProps {
  articleSlug: string;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function CommentsSection({ articleSlug }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(articleSlug)}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (e) {
      console.warn("Failed to load comments:", e);
    } finally {
      setLoading(false);
    }
  }, [articleSlug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (name.trim().length < 2) {
      setError("Please enter your name (at least 2 characters).");
      return;
    }
    if (content.trim().length < 3) {
      setError("Comment must be at least 3 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          article_slug: articleSlug,
          author_name: name.trim(),
          content: content.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to post comment. Please try again.");
        return;
      }

      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setContent("");
      setSuccess("Comment posted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-sweet-red" />
        <h2 className="text-lg font-bold text-charcoal">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h2>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <div className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={100}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-charcoal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sweet-red/20 focus:border-sweet-red transition-colors bg-white"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            maxLength={2000}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-charcoal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sweet-red/20 focus:border-sweet-red transition-colors resize-none bg-white"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {content.length}/2000
            </span>
            <button
              type="submit"
              disabled={submitting || !name.trim() || !content.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 bg-sweet-red text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">{success}</p>
          )}
        </div>
      </form>

      {/* Comments List */}
      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="px-6 py-8 text-center">
            <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-sweet-red rounded-full animate-spin" />
            <p className="text-sm text-gray-400 mt-2">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <MessageCircle className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-sweet-red/10 text-sweet-red flex items-center justify-center">
                  <span className="text-xs font-bold">{getInitials(comment.author_name)}</span>
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-charcoal">
                      {comment.author_name}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {timeAgo(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
