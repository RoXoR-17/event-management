"use server";

import {
  sendNotification as sendWebPushNotification,
  setVapidDetails,
  type PushSubscription,
} from "web-push";

setVapidDetails(
  "mailto:sharoroxor@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

let subscription: PushSubscription | null = null;

export async function subscribeUser(sub: PushSubscription) {
  subscription = sub;
  return { success: true };
}

export async function unsubscribeUser() {
  subscription = null;
  return { success: true };
}

export async function sendNotification({ title = "", body = "" }) {
  if (!subscription) {
    throw new Error("No subscription available");
  }

  try {
    await sendWebPushNotification(subscription, JSON.stringify({ title, body, icon: "/icon.png" }));
    return { success: true };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}
