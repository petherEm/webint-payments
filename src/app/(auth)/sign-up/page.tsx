"use client";

import { CountrySelectField } from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import { Button } from "@/components/ui/button";
import { signUpWithEmail } from "@/lib/actions/auth.actions";
import {
  INVESTMENT_GOALS,
  PREFERRED_INDUSTRIES,
  RISK_TOLERANCE_OPTIONS,
} from "@/lib/constants";
import { sign } from "crypto";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  country: string;
  investmentGoals: string;
  riskTolerance: string;
  preferredIndustry: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      country: "US",
      investmentGoals: "Growth",
      riskTolerance: "Medium",
      preferredIndustry: "Technology",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: SignUpFormData) => {
    // Handle form submission
    try {
      const result = await signUpWithEmail(data);
      if (result.success) router.push("/");
    } catch (error) {
      console.error("Error during sign up:", error);
      toast.error("Sign up failed. Please try again.", {
        description:
          error instanceof Error ? error.message : "Failed to sign up",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 bg-[#050505]">
      <div className="w-full max-w-2xl">
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 shadow-lg relative overflow-hidden">
          {/* Green gradient accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/3 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent" />

          <div className="mb-8 text-center relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2">
              Sign up & Personalize
            </h1>
            <p className="text-gray-400 text-sm">
              Create your account and customize your investment preferences
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
            <InputField
              name="fullName"
              label="Full Name"
              placeholder="John Doe"
              register={register}
              error={errors.fullName}
              validation={{ required: true, minLength: 2 }}
            />
            <InputField
              name="email"
              label="Email"
              placeholder="john.doe@example.com"
              register={register}
              error={errors.email}
              validation={{ required: true, pattern: /^\S+@\S+$/ }}
            />
            <InputField
              name="password"
              label="Password"
              placeholder="Enter a strong password"
              type="password"
              register={register}
              error={errors.password}
              validation={{ required: true, minLength: 8 }}
            />
            <CountrySelectField
              name="country"
              label="Country"
              control={control}
              error={errors.country}
              required
            />
            <SelectField
              name="investmentGoals"
              label="Investment Goals"
              placeholder="Select your investment goal"
              options={INVESTMENT_GOALS}
              control={control}
              error={errors.investmentGoals}
              required
            />
            <SelectField
              name="riskTolerance"
              label="Risk Tolerance"
              placeholder="Select your risk tolerance"
              options={RISK_TOLERANCE_OPTIONS}
              control={control}
              error={errors.riskTolerance}
              required
            />
            <SelectField
              name="preferredIndustry"
              label="Preferred Industry"
              placeholder="Select your preferred industry"
              options={PREFERRED_INDUSTRIES}
              control={control}
              error={errors.preferredIndustry}
              required
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 h-12 bg-gradient-to-b from-green-400 to-green-500 hover:from-green-500 hover:to-green-400 text-gray-950 font-semibold rounded-xl shadow-lg disabled:opacity-50 transition-all"
            >
              {isSubmitting
                ? "Creating Account..."
                : "Start Your Investing Journey"}
            </Button>

            <FooterLink
              text="Already have an account?"
              linkText="Sign in"
              href="/sign-in"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
