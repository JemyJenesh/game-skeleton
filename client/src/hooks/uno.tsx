import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getUno } from "../utils/api";

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
