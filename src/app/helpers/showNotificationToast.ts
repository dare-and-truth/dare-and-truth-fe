"use client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Check, X, MessageSquare, Heart, Bell, Eye, Clock } from "lucide-react"

// Define notification types
type NotificationType = "friendRequest" | "comment" | "like" | "reminder"

interface Notification {
  id: string
  type: NotificationType
  senderName: string
  content?: string
  postId?: string
  timestamp?: string
}

// Function to show toast based on notification type
export function showNotificationToast(notification: Notification) {
  switch (notification.type) {
    case "friendRequest":
      showFriendRequestToast(notification)
      break
    case "comment":
      showCommentToast(notification)
      break
    case "like":
      showLikeToast(notification)
      break
    case "reminder":
      showReminderToast(notification)
      break
  }
}

// Friend Request Toast
function showFriendRequestToast(notification: Notification) {
  const handleAccept = (id: string) => {
    // Replace with your accept function
    console.log(`Accepted friend request from ${id}`)
    toast.success(`You are now friends with ${notification.senderName}`)
  }

  const handleReject = (id: string) => {
    // Replace with your reject function
    console.log(`Rejected friend request from ${id}`)
    toast.error("Friend request rejected")
  }

  toast(
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="bg-blue-100 p-2 rounded-full">
          <Check className="h-4 w-4 text-blue-600" />
        </div>
        <p>
          <span className="font-semibold">{notification.senderName}</span> sent you a friend request
        </p>
      </div>
      <div className="flex gap-2 mt-2">
        <Button size="sm" className="flex items-center gap-1" onClick={() => handleAccept(notification.id)}>
          <Check className="h-4 w-4" />
          Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => handleReject(notification.id)}
        >
          <X className="h-4 w-4" />
          Reject
        </Button>
      </div>
    </div>,
    {
      duration: 10000,
    },
  )
}

// Comment Toast
function showCommentToast(notification: Notification) {
  const handleView = (id: string) => {
    // Replace with your view function
    console.log(`Viewing comment ${id}`)
    toast.success("Navigating to comment")
  }

  const handleDismiss = () => {
    toast.dismiss()
  }

  toast(
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="bg-green-100 p-2 rounded-full">
          <MessageSquare className="h-4 w-4 text-green-600" />
        </div>
        <p>
          <span className="font-semibold">{notification.senderName}</span> commented on your post
        </p>
      </div>
      {notification.content && <p className="text-sm bg-gray-100 p-2 rounded-md">{notification.content}</p>}
      <div className="flex gap-2 mt-2">
        <Button size="sm" className="flex items-center gap-1" onClick={() => handleView(notification.id)}>
          <Eye className="h-4 w-4" />
          View
        </Button>
        <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={handleDismiss}>
          <X className="h-4 w-4" />
          Dismiss
        </Button>
      </div>
    </div>,
    {
      duration: 8000,
    },
  )
}

// Like Toast
function showLikeToast(notification: Notification) {
  const handleView = (id: string) => {
    // Replace with your view function
    console.log(`Viewing post ${id}`)
    toast.success("Navigating to post")
  }

  const handleDismiss = () => {
    toast.dismiss()
  }

  toast(
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="bg-red-100 p-2 rounded-full">
          <Heart className="h-4 w-4 text-red-600" />
        </div>
        <p>
          <span className="font-semibold">{notification.senderName}</span> liked your post
        </p>
      </div>
      <div className="flex gap-2 mt-2">
        <Button
          size="sm"
          className="flex items-center gap-1"
          onClick={() => handleView(notification.postId || notification.id)}
        >
          <Eye className="h-4 w-4" />
          View Post
        </Button>
        <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={handleDismiss}>
          <X className="h-4 w-4" />
          Dismiss
        </Button>
      </div>
    </div>,
    {
      duration: 5000,
    },
  )
}

// Reminder Toast
function showReminderToast(notification: Notification) {
  const handleView = (id: string) => {
    // Replace with your view function
    console.log(`Viewing reminder ${id}`)
    toast.success("Viewing reminder details")
  }

  const handleSnooze = (id: string) => {
    // Replace with your snooze function
    console.log(`Snoozing reminder ${id}`)
    toast.success("Reminder snoozed for 1 hour")
  }

  toast(
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="bg-purple-100 p-2 rounded-full">
          <Bell className="h-4 w-4 text-purple-600" />
        </div>
        <p>
          <span className="font-semibold">Reminder:</span> {notification.content}
        </p>
      </div>
      <div className="flex gap-2 mt-2">
        <Button size="sm" className="flex items-center gap-1" onClick={() => handleView(notification.id)}>
          <Eye className="h-4 w-4" />
          View
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => handleSnooze(notification.id)}
        >
          <Clock className="h-4 w-4" />
          Snooze
        </Button>
      </div>
    </div>,
    {
      duration: 15000,
    },
  )
}

