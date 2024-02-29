// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js")

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
  apiKey: "AIzaSyARcLufTeUZbGue0-k9iZJVxmKlp0l0HQU",
  authDomain: "freebees-24743.firebaseapp.com",
  projectId: "freebees-24743",
  storageBucket: "freebees-24743.appspot.com",
  messagingSenderId: "1084271040061",
  appId: "1:1084271040061:web:91df1dc11b58f5a4807c54",
  measurementId: "G-6Z61GFCN05",
}

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.

const app = firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging(app)

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// Keep in mind that FCM will still show notification messages automatically
// and you should use data messages for custom notifications.
// For more info see:
// https://firebase.google.com/docs/cloud-messaging/concept-options

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload)
  // Customize notification here
  const Title = payload.data.title
  const Options = {
    body: payload.data.body,
    icon: "/images/SMOR-192.png",
  }

  self.registration.showNotification(Title, Options)
})

self.addEventListener("notificationclick", function (event) {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
      if (clientList.length > 0) {
        let client = clientList[0]
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i]
          }
        }
        return client.focus()
      }
      return clients.openWindow("/")
    })
  )
})
