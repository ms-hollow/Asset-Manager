import axios from "axios";
import CookieService from "../service/cookieService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const cookieService = new CookieService();

export const rentAsset = async (
    assetId: string,
    startDate: Date,
    endDate: Date
) => {
    try {
        const token = await cookieService.getCookie("access_token");
        const response = await axios.post(
            `${API_BASE_URL}/rentals/rent-asset?assetId=${assetId}&borrowedStart=${startDate}&borrowedEnd=${endDate}`,
            {}, // POST body (empty)
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error renting asset:", error);
        throw error;
    }
};

export const getEmployeeRentals = async (employeeId?: string) => {
    try {
        const token = await cookieService.getCookie("access_token");
        const response = await axios.get(
            `${API_BASE_URL}/rentals/get-employee-rentals?employeeId=${
                employeeId || ""
            }`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching rentals:", error);
        throw error;
    }
};

export const putRentalStatus = async (rentalId: string, newStatus: string) => {
    try {
        const token = await cookieService.getCookie("access_token");
        const response = await axios.put(
            `${API_BASE_URL}/rentals/update-rental?id=${rentalId}&status=${newStatus}`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating rental status:", error);
        throw error;
    }
};
