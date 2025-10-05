"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import * as z from "zod";

export const AuthFormSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(40, { message: "Password must be at most 40 characters" }),
});

interface AuthFormProps {
  type: "login" | "register",
  onSubmit: (formData: z.infer<typeof AuthFormSchema>) => void | Promise<void>,
};

export default function AuthForm({ type, onSubmit }: AuthFormProps) {
  const form = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  return (
    <div className="flex flex-col items-center p-8">
      <div className="flex flex-col space-y-4 w-full pb-8">
        <span className="text-xl font-semibold">
          {type === "login" ?
            "Login to your account" : "Register a new account"}
        </span>
        <span className="text-sm text-muted-foreground">
          {type === "login" ?
            "Enter your email below to login to your account" :
            "Enter your email below to create a new account"}
        </span>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="me@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            {type === "login" ? "Login" : "Sign up"}
          </Button>
        </form>
      </Form>
    </div>
  )
}