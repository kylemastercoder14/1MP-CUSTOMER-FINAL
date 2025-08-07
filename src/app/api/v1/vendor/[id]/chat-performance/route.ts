import db from "@/lib/db";
import { NextResponse } from "next/server";

const RESPONSE_TIME_LIMIT_HOURS = 12;
const RECENT_MESSAGES_DAYS = 30;

const RESPONSE_TIME_LIMIT_MS = RESPONSE_TIME_LIMIT_HOURS * 60 * 60 * 1000;
const RECENT_DATE = new Date();
RECENT_DATE.setDate(RECENT_DATE.getDate() - RECENT_MESSAGES_DAYS);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const vendorId = (await params).id;

    if (!vendorId) {
      return NextResponse.json(
        { success: false, message: "Vendor ID is required." },
        { status: 400 }
      );
    }

    const conversations = await db.conversation.findMany({
      where: {
        vendorId: vendorId,
      },
      select: {
        messages: {
          where: {
            createdAt: {
              gte: RECENT_DATE,
            },
          },
          orderBy: {
            createdAt: "asc",
          },
          select: {
            senderUserId: true,
            senderVendorId: true,
            createdAt: true,
          },
        },
      },
    });

    let totalCustomerMessages = 0;
    let respondedWithinTime = 0;

    conversations.forEach((conversation) => {
      const messages = conversation.messages;

      for (let i = 0; i < messages.length; i++) {
        const currentMessage = messages[i];

        if (currentMessage.senderUserId) {
          totalCustomerMessages++;

          for (let j = i + 1; j < messages.length; j++) {
            const nextMessage = messages[j];

            if (nextMessage.senderVendorId) {
              const customerMessageTime = currentMessage.createdAt.getTime();
              const vendorResponseTime = nextMessage.createdAt.getTime();
              const timeDifference = vendorResponseTime - customerMessageTime;

              if (timeDifference <= RESPONSE_TIME_LIMIT_MS) {
                respondedWithinTime++;
                break;
              } else {
                break;
              }
            }
          }
        }
      }
    });

    let performancePercentage = 0;
    const responseTimeDescription = `(Within ${RESPONSE_TIME_LIMIT_HOURS} hours)`;

    if (totalCustomerMessages > 0) {
      performancePercentage =
        (respondedWithinTime / totalCustomerMessages) * 100;
    }

    const formattedPercentage = performancePercentage.toFixed(0);

    return NextResponse.json({
      success: true,
      data: {
        chatPerformance: `${formattedPercentage}% ${responseTimeDescription}`,
        performancePercentage,
      },
    });
  } catch (error) {
    console.error("Error calculating chat performance:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to calculate chat performance.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
