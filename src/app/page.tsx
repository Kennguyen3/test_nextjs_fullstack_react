// src/app/login/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import RootLayout from "../components/RootLayout"; // Adjust the import path as needed
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { notification, Spin } from "antd";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/movie-list");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error: any) {
      notification.error({
        message: "Login Failed",
        description: error?.response?.data?.message || "An error occurred while trying to log in. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RootLayout>
      <div className="flex flex-col items-center pt-56 max-md:pt-24">
        <div className="text-6xl font-semibold leading-none max-md:text-4xl">Sign in</div>
        <div className="mt-10">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-[300px] rounded-xl bg-cyan-900 px-4 py-3 text-white max-md:pr-5"
          />
        </div>
        <div className="mt-6">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-[300px] rounded-xl bg-cyan-900 px-4 py-3 text-white max-md:pr-5"
          />
        </div>
        <div className="mt-6 flex w-[300px] items-center justify-center gap-2">
          <div className="flex h-[18px] w-[18px] items-center justify-center rounded-md bg-cyan-900">
            <input type="checkbox" id="remember-me" className="custom-checkbox" />
          </div>
          <label htmlFor="remember-me" className="text-white">
            Remember me
          </label>
        </div>
        <button
          onClick={handleLogin}
          className={`mt-6 gap-1.5 rounded-xl bg-emerald-400 px-32 py-4 text-base font-bold ${
            isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? <Spin /> : "Login"}
        </button>
      </div>
    </RootLayout>
  );
};

export default Login;
