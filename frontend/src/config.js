const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001/api"
    : "https://mern-syncbridge.onrender.com/api";

export default BASE_URL;