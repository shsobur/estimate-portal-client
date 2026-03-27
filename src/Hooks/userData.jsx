// File path__
import useAxios from "./Axios";
import { AuthContext } from "../Context/AuthContext";

// From react__
import { useContext } from "react";

// Package__
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NProgress from "nprogress";

const useUserData = () => {
  const api = useAxios();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Fetch user data by email__
  const fetchUserData = async (email) => {
    if (!email) throw new Error("Email is required to fetch profile");
    try {
      NProgress.start();
      const { data } = await api.get(`/user-api/users/email/${email}`);
      return data;
    } finally {
      NProgress.done();
    }
  };

  // React Query: fetch and cache profile__
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile", user?.email],
    queryFn: () => fetchUserData(user.email),
    enabled: !!user?.email,
    staleTime: 1000 * 60 * 5,
  });

  // Mutation: update profile section by section (PATCH)__
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedFields) => {
      if (!user?.email) throw new Error("Email missing");
      const { data } = await api.patch(
        `/user-api/update-profile/${user.email}`,
        updatedFields
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profile", user?.email]);
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateProfileMutation.mutate,
  };
};

export default useUserData;
