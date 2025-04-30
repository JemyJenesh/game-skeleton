import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getBingo, getUno } from "../utils/api";

export function useUno() {
  const { id } = useParams();
  const navigate = useNavigate();
  const query = useQuery({
    queryKey: ["unos", id],
    queryFn: () => getUno(id!),
    onSuccess: (data) => {
      if (!data) {
        navigate("/");
      }
    },
  });

  return query;
}

export function useBingo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const query = useQuery({
    queryKey: ["bingos", id],
    queryFn: () => getBingo(id!),
    onSuccess: (data) => {
      if (!data) {
        navigate("/");
      }
    },
  });

  return query;
}
