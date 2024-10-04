import { Cupon } from "./Cupon";

export interface ApiResponse {
    result: Cupon[];
    isSuccess: boolean;
    message: string;
}