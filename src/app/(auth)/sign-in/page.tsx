"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import FooterLink from "@/components/forms/FooterLink";
import { useRouter } from "next/navigation";
import { signInWithEmail } from "@/lib/actions/auth.actions";
import { toast } from "sonner";

type SignInFormData = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const result = await signInWithEmail(data);
      if (result.success) router.push("/");
    } catch (e) {
      console.error(e);
      toast.error("Sign in failed", {
        description: e instanceof Error ? e.message : "Failed to sign in.",
      });
    }
    console.log("[v0] Sign in data:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-2xl">
        <div className="bg-muted border border-border rounded-2xl p-8 md:p-12 shadow-lg">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Sign in to access your finance dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <InputField
              name="email"
              label="Email"
              placeholder="contact@example.com"
              register={register}
              error={errors.email}
              validation={{
                required: "Email is required",
                pattern: {
                  value: /^\w+@\w+\.\w+$/,
                  message: "Invalid email format",
                },
              }}
            />

            <InputField
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
              register={register}
              error={errors.password}
              validation={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              }}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-8 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-accent/20"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>

            <FooterLink
              text="Don't have an account?"
              linkText="Create an account"
              href="/sign-up"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
