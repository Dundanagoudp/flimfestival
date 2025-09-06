import apiClient from "@/apiClient";
import { Workshop, WorkshopResponse } from "@/types/workShopTypes";

const BASE = "/workshop";

export async function getWorkshops(): Promise<Workshop[]> {
    try{
         const response = await apiClient.get<WorkshopResponse | Workshop[]>(`${BASE}/getWorkshop`);
        const payload = response.data as any;
        return Array.isArray(payload) ? payload as Workshop[] : payload.data;
    }
    catch(error: any){
        console.error("Error fetching workshops:", error);
        throw new Error(error?.response?.data?.message || error?.message || "Failed to fetch workshops");
    }
};