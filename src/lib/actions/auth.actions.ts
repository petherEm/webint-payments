"use server";

import { auth } from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";
import { headers } from "next/dist/server/request/headers";


export const signUpWithEmail = async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry }: SignUpFormData) => {


    try {
        const response = await auth.api.signUpEmail({
            body: { email, password, name: fullName }
        })

        if (response) {
            await inngest.send({
                name: "app/user.created",
                data: {
                    email,
                    name: fullName,
                    country,
                    investmentGoals,
                    riskTolerance,
                    preferredIndustry
                }
            })
        }

        return { success: true, message: "Sign up successful! Please check your email to verify your account." };

    } catch (error) {
       console.error("Error signing up with email:", error);
       return { success: false, message: "Sign up failed. Please try again." };
    }
}

export const signInWithEmail = async ({ email, password }: SignInFormData) => {


    try {
        const response = await auth.api.signInEmail({
            body: { email, password }
        })
        if (response?.user) {
            return { success: true, message: "Sign in successful!" };
        } else {
            return { success: false, message: "Invalid email or password." };
        }

    } catch (error) {
       console.error("Error signing in with email:", error);
       return { success: false, message: "Sign in failed. Please try again." };
    }


}

export const signOut = async () => {
    try {
        await auth.api.signOut({ headers: await headers() });
    } catch (error) {
        console.error("Error signing out:", error);
        return { success: false, message: "Sign out failed. Please try again." };
    }
}