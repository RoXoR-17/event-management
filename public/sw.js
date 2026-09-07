self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("my-cache").then(function (cache) {
      return cache.addAll(["/logo.png"]).then(() => self.skipWaiting());
    }),
  );
});

let ignore = { image: 1, audio: 1, video: 1, style: 1, font: 1, manifest: 1 };

self.addEventListener("fetch", function (event) {
  let { request, clientId } = event;
  let { url, destination } = request;

  if (clientId && !ignore[destination]) {
    event.waitUntil(
      self.clients
        .get(clientId)
        .then((client) => client?.postMessage({ fetchUrl: url, dest: destination })),
    );
  }

  event.respondWith(
    caches
      .match(request)
      .then(function (response) {
        if (response) return response;
        return fetch(request).catch((error) => console.error(error)) || {};
      })
      .catch((error) => console.error(error)),
  );
});

self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/icon.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  console.info("Notification click received");
  event.notification.close();
  event.waitUntil(clients.openWindow("https://event-management-ecru-nu.vercel.app/home"));
});
