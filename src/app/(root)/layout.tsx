import Header from "@/components/Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen text-gray-400">
      <Header />
      <div>{children}</div>
    </main>
  );
};

export default Layout;
