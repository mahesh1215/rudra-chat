// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");

// Initialize Firebase app in the SW
firebase.initializeApp({
  apiKey:            "AIzaSyAFbnl9zGGU8n3_t899of2imSpohCLrX9o",
  authDomain:        "sri-rudra-chat.firebaseapp.com",
  projectId:         "sri-rudra-chat",
  messagingSenderId: "188670520129",
  appId:             "1:188670520129:web:43b5d91158ae5cb379cfca0"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title, { body });
});
