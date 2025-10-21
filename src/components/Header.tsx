import Link from "next/link";
import Image from "next/image";
import NavItems from "./NavItems";
import UserDropdown from "./UserDropdown";

const Header = ({ user }: { user: User }) => {
  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper py-4 ">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/icons/logo_dark.png"
            alt="FinanceHub Logo"
            width={140}
            height={48}
            className="h-16 w-auto"
          />
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
