import { initializeApp } from "firebase/app";
import "firebase/messaging";

const firebaseConfig = {
    //TODO Add Firebase Config.
};
const firebaseApp = initializeApp(firebaseConfig)
const messaging = firebaseApp.messaging()
messaging.usePublicVapidKey(firebaseConfig.vapidId)

const setupMessagingWithServiceWorker = (registration) => {
    messaging.useServiceWorker(registration)
}

export { messaging, setupMessagingWithServiceWorker }