/*
  Browser Notification API utility.

  This file handles:
  - checking browser support
  - asking permission
  - detecting keywords
  - showing popup notifications
*/

const KEYWORDS = ["cricket", "science"];

/*
  Check whether post text contains important keywords.

  Match should be case-insensitive:
  "Cricket", "CRICKET", "science" all should work.
*/
export function containsNotificationKeyword(text: string) {
  const lowerText = text.toLowerCase();

  return KEYWORDS.some((keyword) => lowerText.includes(keyword));
}

/*
  Ask browser notification permission.

  Browser can return:
  - granted
  - denied
  - default
*/
export async function requestBrowserNotificationPermission() {
  if (!("Notification" in window)) {
    return "unsupported";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  const permission = await Notification.requestPermission();

  return permission;
}

/*
  Show browser popup notification.

  This only works if:
  - browser supports Notification API
  - user gave permission
*/
export function showKeywordBrowserNotification(tweetText: string) {
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission !== "granted") {
    return;
  }

  new Notification("miniX keyword tweet", {
    body: tweetText,
    icon: "/favicon.ico",
  });
}