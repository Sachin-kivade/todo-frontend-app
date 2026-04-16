export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",   // 🔥 MUST
    Authorization: `Bearer ${token}`,
  };
};