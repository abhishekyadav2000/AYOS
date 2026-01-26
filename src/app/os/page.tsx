import type { Metadata } from "next";
import { Windows11OS } from "@/features/os/Windows11OS";

export const metadata: Metadata = {
  title: "Welcome to Abhishek OS",
  description: "Windows 11-style desktop environment for Abhishek Yadav. Explore projects, resume, and connect.",
};

export default function AYOSPage() {
  return <Windows11OS />;
}
