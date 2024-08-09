// src/app/globals.tsx (or your main entry point file)
"use client";
import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import axios from "axios";
import { MovieProvider } from "@/context/MovieContext";

// Set the token from local storage when the app initializes
if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <html lang="en">
    <body>
      <AuthProvider>
        <MovieProvider>{children}</MovieProvider>
      </AuthProvider>
    </body>
  </html>
);

export default RootLayout;
