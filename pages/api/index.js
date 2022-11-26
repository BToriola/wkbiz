import { create } from "apisauce";
import { BASE_URL } from "../../utils/constants";

export const api = create({
  baseURL: `${BASE_URL}`,
  headers: { Accept: "application/json" },
});
