import api from "./axios";

export const getOrderDetails = async (orderNumber) =>
  (await api.get(`/orders/${encodeURIComponent(orderNumber)}`)).data;

export const getMyOrders = async () =>
  (await api.get("/orders/my-orders")).data;

export const cancelOrder = async (orderId) => {
  const { data } = await api.patch(`/orders/${orderId}/cancel`);
  return data;
};

