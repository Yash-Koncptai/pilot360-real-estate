// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5050";
// const API_URL = import.meta.env.DEV ? "/api" : `${BASE_URL}/api`;

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5050",
});

export default api;