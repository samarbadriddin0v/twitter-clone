import fetcher from "@/lib/fetcher";
import useSWR from "swr";

const useUsers = (limit: number) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/users?limit=${limit}`,
    fetcher
  );

  return {
    users: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export default useUsers;
