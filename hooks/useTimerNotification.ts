import { Keyboard } from "react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

export const onSubmitNotification = (
  seconds: number,
  title: string,
  body: string
) => {
  Keyboard.dismiss();
  const schedulingOptions = {
    content: {
      title,
      body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      color: "blue",
    },
    trigger: {
      seconds: seconds,
    },
  };
  // Notifications show only when app is not active.
  // (ie. another app being used or device's screen is locked)
  Notifications.scheduleNotificationAsync(schedulingOptions);
};

export const handleNotification = () => {
  console.warn("ok! got your notif");
};

export const askNotification = async () => {
  // We need to ask for Notification permissions for ios devices
  const { status } = await await Notifications.requestPermissionsAsync();
  if (Constants.isDevice && status === "granted")
    console.log("Notification permissions granted.");
};
