import api from "./axios";

export const getAdminPromotions = async () => {
  const response = await api.get("/paviknots/admin/promotions");
  return response.data;
};


export const getAdminPromotionById = async (promotionId) => {
  const response = await api.get(`/paviknots/admin/promotions/${promotionId}`);
  return response.data;
};

// Create a promotion
export const createAdminPromotion = async (promotionData) => {
  const response = await api.post("/paviknots/admin/promotions", promotionData);
  return response.data;
};

// Update a promotion
export const updateAdminPromotion = async (promotionId, promotionData) => {
  const response = await api.patch(
    `/paviknots/admin/promotions/${promotionId}`,
    promotionData,
  );
  return response.data;
};

// Delete a promotion
export const deleteAdminPromotion = async (promotionId) => {
  const response = await api.delete(
    `/paviknots/admin/promotions/${promotionId}`,
  );
  return response.data;
};
