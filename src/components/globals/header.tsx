"use client";
import { ShoppingCart, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import CategoriesDropdown from "./categories-dropdown";
import WhiteHeader from "./white-header";
import { useUser } from "@/hooks/use-user";
import useCart from "@/hooks/use-cart";
import { useRouter } from "next/navigation";

const Header = ({ isHomepage = false }: { isHomepage?: boolean }) => {
  const router = useRouter();
  const { customer, loading, user } = useUser();
  const { items } = useCart();
  const [isAtTop, setIsAtTop] = React.useState(true);
  const [showSearch, setShowSearch] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = React.useState(false);

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

  return (
    <>
      {!isMobile && (
        <nav
          className={`fixed ${!isHomepage && "border-b"} top-0 left-0 right-0 z-20`}
        >
          <AnimatePresence>
            {isAtTop || !isHomepage ? (
              <motion.header
                id="first"
                className={
                  !isCategoriesOpen && isHomepage
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
                  <div className="px-60 flex justify-between items-center text-sm">
                    <Link href="/" className="flex items-center gap-3">
                      <div className="relative w-12 h-12">
                        <Image
                          alt="Logo"
                          src={
                            !isCategoriesOpen && isHomepage
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
                        className={`cursor-pointer relative ${isCategoriesOpen || !isHomepage ? "text-black" : "text-white"} hover:text-[#800020] flex items-center gap-2`}
                      >
                        <ShoppingCart className={`w-6 h-6 `} />({items.length})
                      </button>
                      {loading ? (
                        // Loading skeleton for user section
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full bg-gray-300 animate-pulse ${
                              isCategoriesOpen || !isHomepage
                                ? "bg-gray-300"
                                : "bg-white/50"
                            }`}
                          />
                          <div
                            className={`h-4 w-20 rounded bg-gray-300 animate-pulse ${
                              isCategoriesOpen || !isHomepage
                                ? "bg-gray-300"
                                : "bg-white/50"
                            }`}
                          />
                        </div>
                      ) : user ? (
                        <Link
                          href="/my-account"
                          className={`cursor-pointer flex ${isCategoriesOpen || !isHomepage ? "text-black" : "text-white"} hover:text-[#800020] items-center gap-2`}
                        >
                          <User className="w-6 h-6 inline-block mr-1" />
                          Hi,{" "}
                          {customer?.firstName ||
                            customer?.lastName ||
                            user.email?.split("@")[0] ||
                            "User"}
                          !
                        </Link>
                      ) : (
                        <>
                          <Link
                            href="/sign-in"
                            className={`cursor-pointer flex ${isCategoriesOpen || !isHomepage ? "text-black" : "text-white"} hover:text-[#800020] items-center gap-2`}
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
                  <div className="px-60 flex justify-between items-center">
                    <div className="flex items-center space-x-8">
                      <nav className="flex space-x-6 text-sm">
                        <CategoriesDropdown
                          isOpen={isCategoriesOpen}
                          setIsOpen={setIsCategoriesOpen}
                        />
                        <span className="hover:text-[#800020] cursor-pointer">
                          Featured selections
                        </span>
                        <span className="hover:text-[#800020] cursor-pointer">
                          Educational Hub
                        </span>
                      </nav>
                    </div>
                    <nav className="flex space-x-6 text-sm">
                      <span className="hover:text-[#800020] cursor-pointer">
                        Buyer Central
                      </span>
                      <span className="hover:text-[#800020] cursor-pointer">
                        Help Center
                      </span>
                      <span className="hover:text-[#800020] cursor-pointer">
                        App & extension
                      </span>
                      <span className="hover:text-[#800020] cursor-pointer">
                        Become a seller
                      </span>
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
    </>
  );
};

export default Header;
