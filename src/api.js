import axios from "axios";

const BASE_URLS = {
  PROD: "https://toilet-paper-app.herokuapp.com",
  STAGING: "http://covid-maps-staging.herokuapp.com",
  LOCAL: "http://localhost:5000",
};

export async function query(params) {
  const response = await axios.get(`${BASE_URLS.PROD}/v2/query`, { params });
  return response.data;
}

export async function submit(data) {
  const response = await axios.post(`${BASE_URLS.PROD}/v1/update`, data);
  return response.data;
}
