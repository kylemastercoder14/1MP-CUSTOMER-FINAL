import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import Image from "next/image";
import { footerSections, paymentMethods, policies, socialIcons } from "@/constants";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-50 border-t">
      {/* Main Footer Content */}
      <div className="px-20 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-sm">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-[#800020] hover:underline transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {paymentMethods.map((method, index) => (
              <div
                key={index}
                className={`w-11 h-11 relative`}
                title={method.name}
              >
                <Image
                  alt={method.name}
                  src={method.src}
                  fill
                  className="size-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Social Media and App Downloads */}
        <div className="mt-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          {/* Social Media Icons */}
          <div className="flex space-x-4">
            {socialIcons.map(({ src, href, label }, index) => (
              <Link
                key={index}
                href={href}
                className="relative size-6"
                aria-label={label}
                title={`Follow us on ${label}`}
              >
                <Image src={src} alt={label} fill className="size-full" />
              </Link>
            ))}
          </div>

          {/* App Download Section */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Shop on the go with the{" "}
              <Link href="#" className="underline font-bold">
                1 Market Philippines app
              </Link>
            </span>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="relative w-[150px] h-12"
              >
                <Image
                  src="https://s.alicdn.com/@img/imgextra/i4/O1CN01i9Aj641atkjJJ9I6y_!!6000000003388-2-tps-396-132.png"
                  alt="App store"
                  fill
                  className="size-full"
                />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="relative w-[150px] h-12"
              >
                <Image
                  src="https://s.alicdn.com/@img/imgextra/i4/O1CN018KnDNq1JleFgkjLRq_!!6000000001069-2-tps-447-132.png"
                  alt="Google play store"
                  fill
                  className="size-full"
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            {policies.map((policy, index) => (
              <span key={index}>
                <Link
                  href={`/1-market-philippines-policy?type=${policy.toLowerCase().replace(/ /g, "-")}`}
                  className="hover:text-[#800020] hover:underline transition-colors"
                >
                  {policy}
                </Link>
                {index < policies.length - 1 && (
                  <span className="mx-2 text-gray-400">|</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Copyright and Legal */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-xs text-gray-500">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-wrap gap-4">
              <span>© 2025 1 Market Philippines</span>
              <span>
                C-11 Manlunas St. Barangay 183, Pasay City, Metro Manila,
                Philippines
              </span>
              <span>(+63) 966 998 1628</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Survey</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToTop}
                className="h-8 px-2 hover:text-[#800020] hover:bg-transparent"
              >
                <ArrowUp className="w-4 h-4" />
                <span className="ml-1 text-xs">Back to top</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
