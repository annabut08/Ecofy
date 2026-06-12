import api from "./api";

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const companyApi = {
  getCompany: (id) =>
    api.get(`/client-companies/${id}`, {
      headers: getHeaders(),
    }),

  updateCompany: (id, data) =>
    api.put(`/client-companies/${id}`, data, {
      headers: getHeaders(),
    }),

  registerCompany: (data) =>
    api.post(`/client-companies/register`, data),

  getRequests: () =>
    api.get(`/requests/`, {
      headers: getHeaders(),
    }),

  createRequest: (data) =>
    api.post(`/requests/`, data, {
      headers: getHeaders(),
    }),

  deleteRequest: (id) =>
    api.delete(`/requests/${id}`, {
      headers: getHeaders(),
    }),

  getStatistics: (dateFrom, dateTo) =>
    api.get(`/requests/statistics`, {
      headers: getHeaders(),
      params: {
        ...(dateFrom && { date_from: dateFrom }),
        ...(dateTo && { date_to: dateTo }),
      },
    }),

  getOrganizations: () =>
    api.get(`/organizations/`, {
      headers: getHeaders(),
    }),
};