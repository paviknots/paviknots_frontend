import api from "./axios";

export const getAdminDashboard = async () => {
  const response = await api.get("/paviknots/admin/dashboard");
  return response.data;
};

export const getAdminOrders = async (params = {}) => {
  const response = await api.get("/paviknots/admin/orders/getAdminOrders", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      search: params.search ?? "",
      orderStatus: params.orderStatus ?? "ALL",
      paymentStatus: params.paymentStatus ?? "ALL",
    },
  });
  return response.data;
};

export const updateAdminOrderStatus = async (orderId, status) => {
  const response = await api.patch(
    `/paviknots/admin/orders/${orderId}/status`,
    {
      status,
    },
  );

  return response.data;
};

export const getAdminOrderDetails = async (orderNumber) => {
  const response = await api.get(
    `/paviknots/admin/orders/${encodeURIComponent(orderNumber)}`,
  );

  return response.data;
};
