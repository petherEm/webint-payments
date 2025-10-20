import React from "react";
import Image from "next/image";
import Link from "next/link";
import NavItems from "./NavItems";
import UserDropdown from "./UserDropdown";

const Header = () => {
  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/">
          <Image
            src="/assets/icons/logo.svg"
            alt="Logo"
            width={150}
            height={40}
            className="cursor-pointer h-8 w-auto"
          />
        </Link>
        <nav className="hidden sm:block">
          <NavItems />
        </nav>

        {/* Userdropdown */}
        <UserDropdown />
      </div>
    </header>
  );
};

export default Header;
