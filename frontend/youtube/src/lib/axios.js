import axios from "axios";

// Point at your backend’s API root:
axios.defaults.baseURL = "http://localhost:8000/api";
axios.defaults.withCredentials = true;

export default axios;