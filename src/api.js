import axios from "axios";

export async function query() {
  const response = await axios.get(
    "https://toilet-paper-app.herokuapp.com/v0/query"
  );
  return response.data;
}

export async function submit(data) {
  const response = await axios.post(
    "https://toilet-paper-app.herokuapp.com/v0/submit",
    data
  );
  return response.data;
}
