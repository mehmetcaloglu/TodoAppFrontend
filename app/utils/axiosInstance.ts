import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const axiosInstance = axios.create({
  baseURL: "YOUR_BACKEND_URL",
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const router = useRouter();
    if (error.response.status === 401) {
      Cookies.remove("token");
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
