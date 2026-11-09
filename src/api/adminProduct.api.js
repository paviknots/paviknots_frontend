import api from "./axios";

export const getAdminProducts = async (params = {}) => {
  const response = await api.get("/paviknots/admin/products", {
    params: {
      page: params.page ?? 1,
      search: params.search ?? "",
      category: params.category ?? "ALL",
      status: params.status ?? "ALL",
    },
  });

  return response.data;
};

export const getAdminProductById = async (id) => {
  const response = await api.get(
    `/paviknots/admin/products/${encodeURIComponent(id)}`,
  );
  return response.data;
};

export const createProduct = async (formData) => {
  const response = await api.post("/products", formData);
  return response.data;
};

//This is for changing isActive
export const updateAdminProductStatus = async (id, status) => {
  const response = await api.patch(
    `/paviknots/admin/products/${encodeURIComponent(id)}/status`,
    { status },
  );
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(
    `/products/${encodeURIComponent(id)}`,
    productData,
  );
  return response.data;
};

export const addProductImages = async (id, images) => {
  const formData = new FormData();
  images.forEach((image) => {
    formData.append("images", image);
  });
  const response = await api.post(
    `/products/${encodeURIComponent(id)}/images`,
    formData,
  );
  return response.data;
};

export const deleteProductImage = async (productId, imageId) => {
  const response = await api.delete(
    `/products/${encodeURIComponent(productId)}/images/${encodeURIComponent(imageId)}`,
  );
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${encodeURIComponent(id)}`);
  return response.data;
};
