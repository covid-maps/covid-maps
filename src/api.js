import axios from "axios";

// coming from .env files
// you can setup a new .env.local file to override these vars locally
const BASE_URL = process.env.REACT_APP_BASE_URL;
export async function query(params) {
  const response = await axios.get(`${BASE_URL}/v2/query`, { params });
  return response.data;
}

export async function queryByStoreId(params) {
  const response = await axios.get(`${BASE_URL}/v2/queryByStoreId`, { params });
  return response.data;
}

export async function submit(data) {
  const response = await axios.post(`${BASE_URL}/v1/update`, data);
  return response.data;
}

export const submitVote = async data => {
  const response = await axios.post(`${BASE_URL}/v1/vote`, data);
  return response.data;
};

export const deleteVote = async data => {
  const response = await axios.delete(`${BASE_URL}/v1/vote`, { data });
  return response.data;
};
