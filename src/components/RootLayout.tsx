"use client";
import React from "react";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => (
  <div className="flex min-h-screen flex-col items-center justify-between bg-background text-center text-sm text-white">
    {children}
    <img
      alt=""
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/28e64ecf0fdebe471ddd694dbd5e5d6843c88d73702d91789d2b04d32e2b5ef7?"
      className="aspect-[12.99] w-full object-contain max-md:max-w-full"
      style={{ alignSelf: "flex-end" }}
    />
  </div>
);

export default RootLayout;
