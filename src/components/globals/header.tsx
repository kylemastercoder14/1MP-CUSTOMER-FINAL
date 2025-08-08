"use client";
import { Menu, ShoppingCart, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import CategoriesDropdown from "./categories-dropdown";
import WhiteHeader from "./white-header";
import { useUser } from "@/hooks/use-user";
import useCart from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import NavUser from "./nav-user";
import FeaturedSelectionsDropdown from "./featured-selection-dropdown";
import PurchaseProtectionsDropdown from "./purchase-protection-dropdown";
import SearchContainer from './search-container';

type DropdownType = "categories" | "featured" | "purchaseProtection" | null;

const Header = ({ isHomepage = false }: { isHomepage?: boolean }) => {
  const router = useRouter();
  const { customer, loading, user } = useUser();
  const { items } = useCart();
  const [isAtTop, setIsAtTop] = React.useState(true);
  const [showSearch, setShowSearch] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<DropdownType>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleDropdown = (dropdownType: DropdownType) => {
    setOpenDropdown(openDropdown === dropdownType ? null : dropdownType);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsAtTop(scrollTop === 0);

      // Show search container when scrolled past hero section (adjust 600 to your hero section height)
      setShowSearch(scrollTop > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const menuVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "100%" },
  };

  return (
    <>
      {!isMobile && (
        <nav
          className={`fixed ${!isHomepage && "border-b"} top-0 left-0 right-0 z-50`}
        >
          <AnimatePresence>
            {isAtTop || !isHomepage ? (
              <motion.header
                id="first"
                className={
                  !openDropdown && isHomepage
                    ? "bg-transparent text-white"
                    : "bg-white text-black"
                }
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Top bar */}
                <div className="bg-transparent px-4 pb-2 pt-4">
                  <div className="px-20 flex justify-between items-center text-sm">
                    <Link href="/" className="flex items-center gap-3">
                      <div className="relative w-12 h-12">
                        <Image
                          alt="Logo"
                          src={
                            !openDropdown && isHomepage
                              ? "/images/logo-light.png"
                              : "/images/logo-dark.png"
                          }
                          fill
                          className="size-full"
                        />
                      </div>
                      <div className="text-xl font-bold">
                        1 Market Philippines
                      </div>
                    </Link>
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => router.push("/shopping-cart")}
                        className={`cursor-pointer relative ${openDropdown || !isHomepage ? "text-black" : "text-white"} hover:text-[#800020] flex items-center gap-2`}
                      >
                        <ShoppingCart className={`w-6 h-6 `} />({items.length})
                      </button>
                      {loading ? (
                        // Loading skeleton for user section
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full bg-gray-300 animate-pulse ${
                              openDropdown || !isHomepage
                                ? "bg-gray-300"
                                : "bg-white/50"
                            }`}
                          />
                          <div
                            className={`h-4 w-20 rounded bg-gray-300 animate-pulse ${
                              openDropdown || !isHomepage
                                ? "bg-gray-300"
                                : "bg-white/50"
                            }`}
                          />
                        </div>
                      ) : user ? (
                        <NavUser
                          isCategoriesOpen={
                            openDropdown === "categories" ||
                            openDropdown === "featured" ||
                            openDropdown === "purchaseProtection"
                          }
                          isHomepage={isHomepage}
                          customer={{
                            firstName: customer?.firstName ?? undefined,
                            lastName: customer?.lastName ?? undefined,
                            image: customer?.image ?? undefined,
                            email: user.email ?? undefined,
                          }}
                          user={user}
                        />
                      ) : (
                        <>
                          <Link
                            href="/sign-in"
                            className={`cursor-pointer flex ${openDropdown || !isHomepage ? "text-black" : "text-white"} hover:text-[#800020] items-center gap-2`}
                          >
                            <User className="w-6 h-6" />
                            Sign in
                          </Link>
                          <Link
                            href="/sign-up"
                            className="bg-[#800020] hover:bg-[#800020]/80 px-4 py-2 rounded-full cursor-pointer text-white"
                          >
                            Create account
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Main navigation */}
                <div className="py-3">
                  <div className="px-20 flex justify-between items-center">
                    <div className="flex items-center space-x-8">
                      <nav className="flex space-x-6 text-sm">
                        <CategoriesDropdown
                          isOpen={openDropdown === "categories"}
                          setIsOpen={() => toggleDropdown("categories")}
                        />

                        <FeaturedSelectionsDropdown
                          isOpen={openDropdown === "featured"}
                          setIsOpen={() => toggleDropdown("featured")}
                        />

                        <PurchaseProtectionsDropdown
                          isOpen={openDropdown === "purchaseProtection"}
                          setIsOpen={() => toggleDropdown("purchaseProtection")}
                        />
                      </nav>
                    </div>
                    <nav className="flex space-x-6 text-sm">
                      <Link
                        href="/what-is-1-market-philippines"
                        className="hover:text-[#800020] cursor-pointer"
                      >
                        What is 1 Market Philippines?
                      </Link>
                      <Link
                        href="/promotions-offers"
                        className="hover:text-[#800020] cursor-pointer"
                      >
                        Promotions & Offers
                      </Link>
                      <Link
                        href="/help-center"
                        className="hover:text-[#800020] cursor-pointer"
                      >
                        Help Center
                      </Link>
                      <Link
                        href="/"
                        className="hover:text-[#800020] cursor-pointer"
                      >
                        Become a seller
                      </Link>
                    </nav>
                  </div>
                </div>
              </motion.header>
            ) : (
              <motion.header
                id="second"
                className="bg-white text-black shadow-md"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <WhiteHeader
                  showSearch={showSearch}
                  items={items.length}
                  loading={loading}
                  user={user}
                  customer={customer}
                />
              </motion.header>
            )}
          </AnimatePresence>
        </nav>
      )}

      {isMobile && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
          <header className="flex justify-between items-center px-4 py-3">
            <div className="flex items-center gap-3">
              <button onClick={toggleMobileMenu} className="text-black">
                <Menu size={24} />
              </button>
              <Link href="/" className="flex items-center gap-2">
                <div className="relative w-8 h-8">
                  <Image
                    alt="Logo"
                    src="/images/logo-dark.png"
                    fill
                    className="size-full"
                  />
                </div>
              </Link>
            </div>
            <div className="flex items-center ml-2 space-x-4">
              <SearchContainer />
              <button
                onClick={() => router.push("/shopping-cart")}
                className="relative text-black flex items-center gap-2 hover:text-[#800020]"
              >
                <ShoppingCart className="size-4" />({items.length})
              </button>
              {loading ? (
                <div className="size-4 rounded-full bg-gray-300 animate-pulse" />
              ) : user ? (
                <NavUser
                  isHomepage={false}
                  isCategoriesOpen={isMobileMenuOpen}
                  customer={{
                    firstName: customer?.firstName ?? undefined,
                    lastName: customer?.lastName ?? undefined,
                    image: customer?.image ?? undefined,
                    email: user.email ?? undefined,
                  }}
                  user={user}
                />
              ) : (
                <Link href="/sign-in" className="text-black">
                  <User className="size-4" />
                </Link>
              )}
            </div>
          </header>
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={menuVariants}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[60] bg-white p-6 overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <Link href="/" className="flex items-center gap-2">
                    <div className="relative w-10 h-10">
                      <Image
                        alt="Logo"
                        src="/images/logo-dark.png"
                        fill
                        className="size-full"
                      />
                    </div>
                    <div className="text-lg font-bold text-black">
                      1 Market Philippines
                    </div>
                  </Link>
                  <button onClick={toggleMobileMenu} className="text-black">
                    <X size={24} />
                  </button>
                </div>

                {/* TODO: Add a proper collapsible for categories */}

                <div className="flex flex-col space-y-4 text-lg">
                  {/* These dropdowns would need to be replaced with a mobile-friendly accordion or simple links */}
                  <Link
                    href="/categories"
                    onClick={toggleMobileMenu}
                    className="hover:text-[#800020] cursor-pointer"
                  >
                    All Categories
                  </Link>
                  <Link
                    href="/featured-selections"
                    onClick={toggleMobileMenu}
                    className="hover:text-[#800020] cursor-pointer"
                  >
                    Featured Selections
                  </Link>
                  <Link
                    href="/purchase-protections"
                    onClick={toggleMobileMenu}
                    className="hover:text-[#800020] cursor-pointer"
                  >
                    Purchase Protection
                  </Link>
                  <hr className="my-2" />
                  <Link
                    href="/what-is-1-market-philippines"
                    onClick={toggleMobileMenu}
                    className="hover:text-[#800020] cursor-pointer"
                  >
                    What is 1 Market Philippines?
                  </Link>
                  <Link
                    href="/promotions-offers"
                    onClick={toggleMobileMenu}
                    className="hover:text-[#800020] cursor-pointer"
                  >
                    Promotions & Offers
                  </Link>
                  <Link
                    href="/help-center"
                    onClick={toggleMobileMenu}
                    className="hover:text-[#800020] cursor-pointer"
                  >
                    Help Center
                  </Link>
                  <Link
                    href="/"
                    onClick={toggleMobileMenu}
                    className="hover:text-[#800020] cursor-pointer"
                  >
                    Become a seller
                  </Link>
                </div>
                {!user && (
                  <div className="mt-8 flex flex-col space-y-4">
                    <Link
                      href="/sign-in"
                      onClick={toggleMobileMenu}
                      className="w-full text-center py-2 border rounded-full border-[#800020] text-[#800020] hover:bg-gray-100"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={toggleMobileMenu}
                      className="w-full text-center py-2 rounded-full bg-[#800020] hover:bg-[#800020]/80 text-white"
                    >
                      Create account
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      )}
    </>
  );
};

export default Header;
