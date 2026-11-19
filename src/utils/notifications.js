export function notificationOrderId(response) {
  return response?.notification?.request?.content?.data?.orderId || null;
}
