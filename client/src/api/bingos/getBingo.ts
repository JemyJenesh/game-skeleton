import { axios } from "client/utils/api";
import { useQuery } from "react-query";
import { Bingo } from "typings/Bingo";

export async function getBingo({
  bingoId,
}: {
  bingoId: string;
}): Promise<Bingo> {
  const response = await axios.get(`/api/bingos/${bingoId}`);
  return response.data;
}

export function useBingo({ bingoId }: { bingoId: string }) {
  return useQuery({
    queryKey: ["bingos", bingoId],
    queryFn: () => getBingo({ bingoId }),
  });
}
