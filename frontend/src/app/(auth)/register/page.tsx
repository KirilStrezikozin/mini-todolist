"use client"

import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import AuthForm, { AuthFormSchema } from "@/components/auth-form";
import { toast } from "sonner";
import api from "@/lib/api/axios";

export default function Page() {
  const router = useRouter();

  async function onSubmit(formData: z.infer<typeof AuthFormSchema>) {
    try {
      await api({
        method: "post",
        url: "auth/register",
        data: {
          email: formData.email,
          password: formData.password,
        },
      });

      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) throw new Error(res.error);
    } catch (error) {
      toast.error("Email already registered");
      return;
    }

    router.push("/");
  }

  return (
    <AuthForm type="register" onSubmit={onSubmit} />
  );
}