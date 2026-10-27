"use client"

import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { BookOpen } from "lucide-react"
import { LoginFormType } from "@/app/(app)/admin/(auth)/login/loginForm"
import { userLogin } from "@/app/actions/user/auth"

export default function AdminLoginForm() {
  const form = useForm<LoginFormType>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormType) {
    await userLogin(data);
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-teal-700 to-emerald-900 p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 size-96 rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="relative flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <BookOpen className="size-5" />
          </span>
          <span className="font-serif text-xl font-semibold">Bookshelf</span>
        </div>

        <div className="relative max-w-md space-y-4">
          <h1 className="font-serif text-4xl font-semibold leading-tight">
            Every great story starts with a single page.
          </h1>
          <p className="text-primary-foreground/80">
            Sign in to pick up where you left off and access your library anywhere.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground lg:hidden">
              <BookOpen className="size-5" />
            </span>
            <h2 className="font-serif text-3xl font-semibold tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to log in to your account.
            </p>
          </div>

          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Email Field */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="login-email"
                      type="email"
                      className="h-11"
                      aria-invalid={fieldState.invalid}
                      placeholder="name@example.com"
                      autoComplete="email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Password Field */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="login-password"
                      type="password"
                      className="h-11"
                      aria-invalid={fieldState.invalid}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  )
}
