import api from "./axios";

export const getAddresses = async () => {
  const response = await api.get("/addresses");
  return response.data;
};

export const checkout = async (addressId, force) => {
  const response = await api.post("/orders/checkout", { addressId, force });

  return response.data;
};

// Verify Razorpay payment
export const verifyPayment = async (paymentData) => {
  const response = await api.post("/orders/verify-payment", paymentData);
  return response.data;
};

export const cancelCheckout = (orderId) => {
  return api.post("/orders/cancelcheckout", { orderId });
};

export const recoverCheckout = () => {
  return api.post("/orders/recovercheckout");
};
export const renewCheckoutLock = (checkoutId) => {
  return api.post("/orders/heartbeat", { checkoutId });
};
