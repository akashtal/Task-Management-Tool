"use client";

import {
  ToastProvider,
  ToastViewport,
} from "@radix-ui/react-toast";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <ToastProvider>
      <SonnerToaster richColors position="top-right" />
      <ToastViewport />
    </ToastProvider>
  );
}
