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
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#050505]">
      <div className="w-full max-w-2xl">
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 md:p-12 shadow-lg relative overflow-hidden">
          {/* Green gradient accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/3 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent" />

          <div className="mb-8 relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back
            </h1>
            <p className="text-gray-400">
              Sign in to access your finance dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
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
              className="w-full mt-8 h-12 bg-gradient-to-b from-green-400 to-green-500 hover:from-green-500 hover:to-green-400 text-gray-950 font-semibold rounded-xl shadow-lg disabled:opacity-50 transition-all"
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
