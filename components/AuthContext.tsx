"use client";

import Cookies from "js-cookie";
import React, { createContext, useContext, ReactNode, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/config/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/toast";
import { AxiosError } from "axios";

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signin: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  signup: ({
    email,
    password,
    confirm_password,
  }: {
    email: string;
    password: string;
    confirm_password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const { data } = await axios.get("/auth/me");
      return data.user as User;
    },
    retry: false,
    enabled: !!Cookies.get("access_token"),
  });

  const signinMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data } = await axios.post("/auth/signin", { email, password });

      const newAccess = data.tokens.access_token;
      const newRefresh = data.tokens.refresh_token;

      Cookies.set("access_token", newAccess);
      Cookies.set("refresh_token", newRefresh);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });

      addToast({
        title: "Login Successful",
        description: "You have successfully signed in.",
        color: "success",
      });

      const from = searchParams.get("from") || "/dashboard";
      router.push(from);
    },

    onError: (error) => {
      let message = "An error occurred, please try again!";
      if (error instanceof AxiosError) {
        message = error.response?.data.message || message;
      }
      addToast({
        title: "Login Failed",
        description: message,
        color: "danger",
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async ({
      email,
      password,
      confirm_password,
    }: {
      email: string;
      password: string;
      confirm_password: string;
    }) => {
      const { data } = await axios.post("/auth/signup", {
        email,
        password,
        confirm_password,
      });
      const newAccess = data.tokens.access_token;
      const newRefresh = data.tokens.refresh_token;
      Cookies.set("access_token", newAccess);
      Cookies.set("refresh_token", newRefresh);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });
      router.push("/dashboard");

      addToast({
        title: "Registration Complete",
        description: "Welcome! Your account has been created successfully.",
        color: "success",
      });
    },

    onError: (error) => {
      let message = "An error occured, please try again!";

      if (error instanceof AxiosError) {
        message = error.response?.data.message || message;
      }

      addToast({
        title: "Error creating user",
        description: message,
        color: "danger",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refresh_token = Cookies.get("refresh_token");
      await axios.post("/auth/logout", { refresh_token });
    },

    onSuccess: async () => {
      await queryClient.setQueryData(["authUser"], null);
      addToast({
        title: "Logged Out",
        description: "You have successfully signed out.",
        color: "success",
      });
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      router.push("/auth/login");
    },

    onError: (error) => {
      let message = "An error occurred while logging out.";
      if (error instanceof AxiosError) {
        message = error.response?.data.message || message;
      }

      addToast({
        title: "Logout Failed",
        description: message,
        color: "danger",
      });
    },
  });

  return (
    <Suspense>
      <AuthContext.Provider
        value={{
          user: data || null,
          loading:
            isLoading || signinMutation.isPending || signupMutation.isPending,
          signin: async ({ email, password }) =>
            signinMutation.mutateAsync({ email, password }),
          signup: async ({ email, password, confirm_password }) =>
            signupMutation.mutateAsync({ email, password, confirm_password }),
          logout: async () => logoutMutation.mutateAsync(),
          refetchUser,
        }}
      >
        {children}
      </AuthContext.Provider>
    </Suspense>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
