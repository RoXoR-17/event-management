"use client";

import { useEffect, useState } from "react";

import { sendNotification, subscribeUser, unsubscribeUser } from "@/utils/actions/notification";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export default function usePushNotification() {
  const userVisibleOnly = true;
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>();

  useEffect(() => {
    async function registerServiceWorker() {
      setIsSupported(true);
      const registrationOptions: RegistrationOptions = { scope: "/", updateViaCache: "none" };
      const registration = await navigator.serviceWorker.register("/sw.js", registrationOptions);
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    }

    if ("serviceWorker" in navigator && "PushManager" in window) {
      registerServiceWorker();
    }
  }, []);

  async function subscribeToPush() {
    if (!isSupported) return;

    const registration = await navigator.serviceWorker.ready;
    const applicationServerKey = urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!);
    const sub = await registration.pushManager.subscribe({ userVisibleOnly, applicationServerKey });
    setSubscription(sub);
    const serializedSub = JSON.parse(JSON.stringify(sub));
    await subscribeUser(serializedSub);
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  // async function sendTestNotification() {
  //   if (subscription) {
  //     await sendNotification({
  //       title: "Test Notification Title",
  //       body: "Test Notification Body Message",
  //     });
  //   }
  // }

  return {
    subscription,
    subscribeToPush,
    unsubscribeFromPush,
    sendNotification,
  };
}
