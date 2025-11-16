import { useQuery } from "@tanstack/react-query";
import { getBonggongs } from "../apis/bonggong";

export function useBonggongs() {
  return useQuery({
    queryKey: ["bonggongs"],
    queryFn: getBonggongs,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}
