import api from "./axios";

export const getProducts = async (params = {}) => {
  const response = await api.get("/products", {
    params,
  });

  return response.data;
};

export const getRelatedProducts = async (slug, limit = 4) => {
  const response = await api.get(`/products/${slug}/related`, {
    params: { limit },
  });

  return response.data;
};

export const getFeaturedProducts = async (limit = 4) => {
  const response = await api.get("/products/featured", {
    params: { limit },
  });

  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);

  return response.data;
};
