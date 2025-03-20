importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js');


firebase.initializeApp({
  apiKey: "AIzaSyCDUT83uff9HZWduaqjoTXmM9JWtFOSJtE",
  authDomain: "dodo-7e8cb.firebaseapp.com",
  projectId: "dodo-7e8cb",
  storageBucket: "dodo-7e8cb.firebasestorage.app",
  messagingSenderId: "955410173854",
  appId: "1:955410173854:web:9a101f2ec40af6bbb9d08f",
  measurementId: "G-KVSJZNGB2D"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/images/old-logo.png',
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});