import axios from "axios";

export async function query() {
  const response = await axios.get(
    "https://toilet-paper-app.herokuapp.com/v0/query"
  );
  return response.data;
}

export async function submit(data) {
  const response = await axios.post(
    "https://toilet-paper-app.herokuapp.com/v0/update",
    data
  );
  return response.data;
}

export async function ip() {
  const response = await axios.get(
    "http://ipinfo.io/json?token=737774ee26668f"
  );
  return response.data;
}
