import api from "./axios";

export const getAdminCategories = async (params = {}) => {
  const response = await api.get("/paviknots/admin/categories", {
    params: {
      search: params.search ?? "",
      status: params.status ?? "ALL",
    },
  });

  return response.data;
};

export const getAdminCategoryById = async (id) => {
  const response = await api.get(
    `/paviknots/admin/categories/${encodeURIComponent(id)}`,
  );

  return response.data;
};

export const createCategory = async (formData) => {
  const response = await api.post("/paviknots/admin/categories", formData);

  return response.data;
};

export const updateCategory = async (id, formData) => {
  const response = await api.put(
    `/paviknots/admin/categories/${encodeURIComponent(id)}`,
    formData,
  );
  return response.data;
};

export const updateCategoryStatus = async (id, status) => {
  const response = await api.patch(
    `/paviknots/admin/categories/${encodeURIComponent(id)}/status`,
    { status },
  );

  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(
    `/paviknots/admin/categories/${encodeURIComponent(id)}`,
  );

  return response.data;
};
