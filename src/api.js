import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export async function query(params) {
  const response = await axios.get(`${BASE_URL}/v2/query`, { params });
  return response.data;
}

export async function submit(data) {
  const response = await axios.post(`${BASE_URL}/v1/update`, data);
  return response.data;
}
