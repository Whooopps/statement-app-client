import { useLocation } from "react-router";
import queryString from "query-string";

function useQueryParams() {
  const location = useLocation();
  return queryString.parse(location.pathname);
}

export default useQueryParams;
