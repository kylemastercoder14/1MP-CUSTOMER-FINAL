import { TabKey } from "@/types";
import {
  User,
  CreditCard,
  Headphones,
  Settings,
  ShoppingCart,
  StoreIcon,
} from "lucide-react";
import { FaRegFileAlt, FaRegUser } from "react-icons/fa";
import { MdOutlineReviews } from "react-icons/md";
import { RiCoupon3Line, RiNotification3Line } from "react-icons/ri";
import { IoStorefrontOutline } from "react-icons/io5";
import { LuBookHeart } from "react-icons/lu";
import { FiMapPin } from "react-icons/fi";
import { AiOutlineSafety, AiOutlineCreditCard } from "react-icons/ai";

export const paymentMethods = [
  {
    name: "Visa",
    src: "https://assets.xendit.co/payment-channels/logos/visa-logo.svg",
  },
  {
    name: "Mastercard",
    src: "https://assets.xendit.co/payment-channels/logos/mastercard-logo.svg",
  },
  {
    name: "JCB",
    src: "https://s.alicdn.com/@img/imgextra/i3/O1CN01tkTNhl1ZaEMHoGWsA_!!6000000003210-2-tps-137-112.png",
  },
  {
    name: "GCash",
    src: "https://assets.xendit.co/payment-channels/logos/gcash-logo.svg",
  },
  {
    name: "GrabPay",
    src: "https://assets.xendit.co/payment-channels/logos/grabpay-logo.svg",
  },
  {
    name: "7 Eleven",
    src: "https://assets.xendit.co/payment-channels/logos/7eleven-logo.svg",
  },
  {
    name: "Cebuana",
    src: "https://assets.xendit.co/payment-channels/logos/cebuana-logo.svg",
  },
  {
    name: "M Lhuillier",
    src: "https://assets.xendit.co/payment-channels/logos/mlhuillier-logo.svg",
  },
  {
    name: "ECPay Loans",
    src: "https://assets.xendit.co/payment-channels/logos/ecpay-logo.svg",
  },
  {
    name: "Palawan Express",
    src: "https://assets.xendit.co/payment-channels/logos/palawan-logo.svg",
  },
  {
    name: "LBC",
    src: "https://assets.xendit.co/payment-channels/logos/lbc-logo.svg",
  },
  {
    name: "ShopeePay",
    src: "https://assets.xendit.co/payment-channels/logos/shopeepay-logo.svg",
  },
  {
    name: "Maya",
    src: "https://assets.xendit.co/payment-channels/logos/paymaya-logo.svg",
  },
  {
    name: "QRPH",
    src: "https://assets.xendit.co/payment-channels/logos/qrph-c567ff0f-ab6d-4662-86bf-24c6c731d8a8-logo.svg",
  },
  {
    name: "RCBC",
    src: "https://assets.xendit.co/payment-channels/logos/rcbc-logo.svg",
  },
  {
    name: "Chinabank",
    src: "https://assets.xendit.co/payment-channels/logos/chinabank-logo.svg",
  },
  {
    name: "Unionbank",
    src: "https://assets.xendit.co/payment-channels/logos/ubp-logo.svg",
  },
  {
    name: "BPI",
    src: "https://assets.xendit.co/payment-channels/logos/bpi-logo.svg",
  },
  {
    name: "BDO",
    src: "https://assets.xendit.co/payment-channels/logos/bdo-logo.svg",
  },
];

export const footerSections = [
  {
    title: "Get support",
    links: [
      { name: "Help Center", href: "/help-center" },
      { name: "Check order status", href: "/orders" },
      { name: "Refunds", href: "/refunds" },
      { name: "Report abuse", href: "/report-abuse" },
    ],
  },
  {
    title: "Payments and protections",
    links: [
      { name: "Safe and easy payments", href: "/safe-and-easy-payments" },
      { name: "Money-back policy", href: "/money-back-policy" },
      { name: "On-time shipping", href: "/on-time-shipping" },
      { name: "After-sales protections", href: "/after-sales-protection" },
    ],
  },
  {
    title: "Sell on 1 Market Philippines",
    links: [
      {
        name: "Start selling",
        href: "https://selleronemarketphilippines.vercel.app/sign-in",
      },
      {
        name: "Seller Central",
        href: "https://1-mp-educational-hub.vercel.app/en",
      },
      { name: "Become a Verified Seller", href: "/become-a-verified-seller" },
      { name: "Download the app for sellers", href: "/sellers-app" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { name: "Frequently asked questions", href: "/faqs" },
      { name: "Sitemap", href: "/sitemap" },
      { name: "Campaign", href: "/campaign" },
      { name: "Product listings", href: "/product-listings" },
    ],
  },
  {
    title: "Get to know us",
    links: [
      {
        name: "About 1 Market Philippines",
        href: "/what-is-1-market-philippines",
      },
      {
        name: "Mission & Vision",
        href: "/what-is-1-market-philippines#mission-and-vision",
      },
      { name: "News center", href: "/news-center" },
      { name: "Contact us", href: "/contact-us" },
    ],
  },
];

export const socialIcons = [
  {
    src: "https://s.alicdn.com/@img/imgextra/i4/O1CN01s7Kv0o1f2EXBWZFH3_!!6000000003948-2-tps-84-84.png",
    href: "#",
    label: "Facebook",
  },
  {
    src: "https://s.alicdn.com/@img/imgextra/i1/O1CN01BdrubJ21eAtYdzBJF_!!6000000007009-2-tps-84-84.png",
    href: "#",
    label: "Twitter",
  },
  {
    src: "https://s.alicdn.com/@img/imgextra/i4/O1CN01FX2glN20tSUpYMinl_!!6000000006907-2-tps-84-84.png",
    href: "#",
    label: "Instagram",
  },
  {
    src: "https://s.alicdn.com/@img/imgextra/i4/O1CN01dPyTY31vW2A2bd0uC_!!6000000006179-2-tps-84-84.png",
    href: "#",
    label: "YouTube",
  },
  {
    src: "https://s.alicdn.com/@img/imgextra/i3/O1CN01JzRJnr28MxJY1e18t_!!6000000007919-2-tps-84-84.png",
    href: "#",
    label: "TikTok",
  },
];

export const policies = [
  "Legal Notice",
  "Product Listing Policy",
  "Intellectual Property Protection",
  "Privacy Policy",
  "Terms of Use",
  "Integrity Compliance",
];

export const tabs: { id: TabKey; label: string; icon: React.ElementType }[] = [
  { id: "My Account", label: "My Account", icon: User },
  { id: "Products", label: "Products", icon: ShoppingCart },
  { id: "Store Issue", label: "Store Issue", icon: StoreIcon },
  { id: "Order & Payment", label: "Order & Payment", icon: CreditCard },
  { id: "After-Sales", label: "After-Sales", icon: Headphones },
  { id: "Self-Service", label: "Self-Service", icon: Settings },
];

export const tabContent: Record<TabKey, string[]> = {
  "My Account": [
    "What can I do if I forgot my password?",
    "Why cannot I receive the SMS verification code?",
    "How can I register an account on Alibaba.com?",
    "What can I do if my account was deactivated?",
    "Why cannot I receive the Email verification code?",
    "Complaint reporting portal for Thailand users",
  ],
  Products: [
    "How to search for products effectively?",
    "Understanding supplier verification",
    "How to contact suppliers?",
    "Product customization options",
  ],
  "Store Issue": [
    "Best practices for price negotiation",
    "How to communicate with suppliers",
    "Sample ordering process",
    "Understanding MOQ requirements",
  ],
  "Order & Payment": [
    "Available payment methods",
    "How to place an order",
    "Payment security and protection",
    "Order tracking and management",
  ],
  "After-Sales": [
    "Return and refund policy",
    "How to file a dispute",
    "Quality assurance process",
    "Customer support contact",
  ],
  "Self-Service": [
    "Account settings management",
    "Notification preferences",
    "Privacy settings",
    "Download invoices and receipts",
  ],
};

export const ACCOUNT_LINKS: {
  title: string;
  href: string;
  icon: React.ElementType;
}[] = [
  {
    title: "Purchases",
    icon: FaRegFileAlt,
    href: "/user/purchase",
  },
  {
    title: "Reviews",
    icon: MdOutlineReviews,
    href: "/user/reviews",
  },
  {
    title: "My profile",
    icon: FaRegUser,
    href: "/user/profile",
  },
  {
    title: "Payment methods",
    icon: AiOutlineCreditCard,
    href: "/user/payment-methods",
  },
  {
    title: "My vouchers",
    icon: RiCoupon3Line,
    href: "/user/vouchers",
  },
  {
    title: "Followed stores",
    icon: IoStorefrontOutline,
    href: "/user/followed-stores",
  },
  {
    title: "Wishlist",
    icon: LuBookHeart,
    href: "/user/wishlist",
  },
  {
    title: "Addresses",
    icon: FiMapPin,
    href: "/user/addresses",
  },
  {
    title: "Account security",
    icon: AiOutlineSafety,
    href: "/user/account-security",
  },
  {
    title: "Notifications",
    icon: RiNotification3Line,
    href: "/user/notifications",
  },
];
