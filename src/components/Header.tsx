import Link from "next/link";
import NavItems from "./NavItems";
import UserDropdown from "./UserDropdown";

const Header = ({ user }: { user: User }) => {
  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                F
              </span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">
              FinanceHub
            </span>
          </div>
        </Link>
        <nav className="hidden sm:block">
          <NavItems />
        </nav>

        {/* Userdropdown */}
        <UserDropdown user={user} />
      </div>
    </header>
  );
};

export default Header;
