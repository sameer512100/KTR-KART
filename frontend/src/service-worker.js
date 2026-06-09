/* global self */
/* Service worker for KTR-KART — handles precache plus push notifications */

import { precacheAndRoute } from 'workbox-precaching';

// Injected precache manifest will replace self.__WB_MANIFEST during build
precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener('message', (event) => {
  // Workbox or VitePWA may use this; noop for now
});

self.addEventListener('push', (event) => {
  try {
    const payload = event.data ? event.data.json() : { title: 'KTR-KART', body: 'You have a new notification' };
    const title = payload.title || 'KTR-KART';
    const options = {
      body: payload.body || '',
      icon: '/pwa-icon.svg',
      badge: '/pwa-icon.svg',
      data: payload.data || {}
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (e) {
    // fallback
    const title = 'KTR-KART';
    const options = { body: 'New activity', icon: '/pwa-icon.svg' };
    event.waitUntil(self.registration.showNotification(title, options));
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data && event.notification.data.url ? event.notification.data.url : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl || client.url === new URL(targetUrl, self.location).toString()) {
          return client.focus();
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});
