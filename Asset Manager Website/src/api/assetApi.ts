import axios from "axios";
import CookieService from "../service/cookieService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const cookieService = new CookieService();

export const getAllAssets = async (status: string) => {
    try {
        const token = await cookieService.getCookie("access_token");
        const response = await axios.get(
            `${API_BASE_URL}/assets/get-assets?status=${status}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching assets:", error);
        throw error;
    }
};
