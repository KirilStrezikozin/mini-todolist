"use client"

import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import AuthForm, { AuthFormSchema } from "@/components/auth-form";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();

  async function onSubmit(formData: z.infer<typeof AuthFormSchema>) {
    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.error) {
      toast.error("Wrong email or password");
    } else {
      router.push("/");
    }
  }

  return (
    <AuthForm type="login" onSubmit={onSubmit} />
  );
}