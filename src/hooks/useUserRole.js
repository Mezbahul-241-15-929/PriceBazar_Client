import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useUserRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const email = user?.email;

  const { data: role, roleLoading, isError, refetch } = useQuery({
    queryKey: ["userRole", email],
    enabled: !!email, // only run when email exists
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${email}/role`);
      return res.data.role;
    },
  });

  return { role, roleLoading, isError, refetch };
};

export default useUserRole;