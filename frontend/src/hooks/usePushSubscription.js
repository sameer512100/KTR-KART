import { useState, useEffect } from "react";
import { API_BASE } from "../context/AuthContext";

export const usePushSubscription = (token) => {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState(typeof Notification !== "undefined" ? Notification.permission : "default");

  useEffect(() => {
    setSupported("serviceWorker" in navigator && "PushManager" in window && typeof Notification !== "undefined");
  }, []);

  const subscribe = async (vapidPublicKey) => {
    if (!supported) throw new Error("Push not supported");
    if (Notification.permission === "denied") throw new Error("Permission denied");

    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    });

    // send to backend
    await fetch(`${API_BASE}/api/push/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(sub)
    });

    setPermission(Notification.permission);
    return sub;
  };

  const unsubscribe = async (endpoint) => {
    await fetch(`${API_BASE}/api/push/unsubscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ endpoint })
    });
  };

  return { supported, permission, subscribe, unsubscribe };
};

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default usePushSubscription;
