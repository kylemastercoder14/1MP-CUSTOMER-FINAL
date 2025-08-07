import db from "@/lib/db";
import { Vendor } from "@prisma/client";

interface VendorWithLastMessage extends Vendor {
  isUnread: boolean;
  isPinned: boolean;
  isMuted: boolean;
  lastMessage: {
    id: string;
    body: string | null;
    image: string | null;
    createdAt: Date;
    senderUserId: string | null;
    senderSellerId: string | null;
  } | null;
  conversationId: string;
}

const getSellersWithConversations = async (
  userId: string
): Promise<VendorWithLastMessage[]> => {
  try {
    const conversations = await db.conversation.findMany({
      where: {
        userId: userId,
      },
      include: {
        vendor: true,
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          include: {
            senderUser: true,
            senderVendor: true,
          },
        },
      },
      orderBy: {
        lastMessageAt: "desc",
      },
    });

    return conversations.map((conv) => ({
      ...conv.vendor,
      isUnread: conv.isUnread,
      isPinned: conv.isPinned,
      isMuted: conv.isMuted,
      lastMessage: conv.messages[0]
        ? {
            id: conv.messages[0].id,
            body: conv.messages[0].body,
            image: conv.messages[0].image,
            createdAt: conv.messages[0].createdAt,
            senderUserId: conv.messages[0].senderUserId,
            senderSellerId: conv.messages[0].senderVendorId ?? null,
          }
        : null,
      conversationId: conv.id,
    }));
  } catch (error) {
    console.error("Error fetching vendor conversations:", error);
    return [];
  }
};

// Get conversations with unseen message counts
const getUnseenConversations = async (userId: string) => {
  try {
    // First get the user's last seen timestamps for each conversation
    const participantData = await db.participantConversation.findMany({
      where: {
        userId: userId,
      },
      select: {
        conversationId: true,
        lastSeenAt: true,
      },
    });

    // Create a map of conversationId to lastSeenAt
    const lastSeenMap = new Map(
      participantData.map((p) => [p.conversationId, p.lastSeenAt])
    );

    // Get all conversations with message counts
    const conversations = await db.conversation.findMany({
      where: {
        userId: userId,
      },
      include: {
        vendor: true,
        messages: {
          select: {
            id: true,
            createdAt: true,
            senderUserId: true,
            senderVendorId: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    // Calculate unseen counts
    return conversations.map((conv) => {
      const lastSeen = lastSeenMap.get(conv.id);
      const unseenCount = lastSeen
        ? conv.messages.filter(
            (msg) => msg.createdAt > lastSeen && msg.senderUserId !== userId
          ).length
        : conv.messages.filter((msg) => msg.senderUserId !== userId).length;

      return {
        ...conv,
        unseenCount,
      };
    });
  } catch (error) {
    console.error("Error fetching unseen conversations:", error);
    return [];
  }
};

export { getSellersWithConversations, getUnseenConversations };
