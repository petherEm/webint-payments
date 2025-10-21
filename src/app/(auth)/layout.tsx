import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user) {
    redirect("/");
  }
  return (
    <main className="auth-layout">
      <section className="auth-left-section scrollbar-hide-default">
        <Link href="/" className="auth-logo">
          <Image
            src="/assets/icons/logo_dark.png"
            alt="Logo"
            width={140}
            height={32}
            className="h-16 w-auto"
          />
        </Link>
        <div className="pb-6 lg:pb-8 flex-1">{children}</div>
      </section>

      <section className="auth-right-section">
        <div className="z-10 relative lg:mt-4 lg:mb-16">
          <blockquote className="auth-blockquote">
            Signalist turns your payment data into beautiful, informative
            charts. Understand your transactions at a glance and make smarter
            financial decisions.
          </blockquote>
          <div className="flex items-center justify-between">
            <div>
              <cite className="auth-testimonial-author">- Howard C.</cite>
              <p className="max-md:text-xs text-gray-500">
                CEO, FinTech Innovations
              </p>
            </div>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Image
                  key={star}
                  src="/assets/icons/star.svg"
                  alt="Star"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          <Image
            src="/assets/images/dashboard.png"
            alt="Auth Illustration"
            width={1440}
            height={1150}
            className="auth-dashboard-preview absolute top-0"
          />
        </div>
      </section>
    </main>
  );
};

export default Layout;
