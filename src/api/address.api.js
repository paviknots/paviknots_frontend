import api from "./axios";
export const getAddress = (id) => api.get(`/addresses/${id}`);

export const getAddresses = async () => {
  const response = await api.get("/addresses");
  return response.data;
};

export const createAddress = async (address) => {
  const response = await api.post("/addresses", address);
  return response.data;
};

export const updateAddress = async (id, address) => {
  const response = await api.put(`/addresses/${id}`, address);
  return response.data;
};

export const deleteAddress = async (id) => {
  const response = await api.delete(`/addresses/${id}`);
  return response.data;
};

export const setDefaultAddress = async (addressId) => {
  const response = await api.patch(`/addresses/${addressId}/default`);
  return response.data;
};