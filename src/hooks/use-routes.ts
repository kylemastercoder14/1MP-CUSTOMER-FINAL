import { usePathname } from "next/navigation";
import useConversation from "./use-conversation";
import { useMemo } from "react";
import { HiChat } from "react-icons/hi";
import { RiRobot2Line } from "react-icons/ri";
import { FaRegFileAlt } from "react-icons/fa";

const useRoutes = () => {
  const pathname = usePathname();

  const { conversationId } = useConversation();

  const routes = useMemo(
    () => [
      {
        label: "Contact Seller",
        href: "/contact-seller",
        icon: HiChat,
        active: pathname === "/contact-seller" || !!conversationId,
      },
      {
        label: "Ask AI",
        href: "/ask-ai",
        icon: RiRobot2Line,
        active: pathname === "/ask-ai",
      },
      {
        label: "Feedback",
        href: "/feedback",
        icon: FaRegFileAlt,
        active: pathname === "/feedback",
      },
    ],
    [pathname, conversationId]
  );

  return routes;
};

export default useRoutes;
