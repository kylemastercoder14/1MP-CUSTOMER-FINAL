"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FeedbackProps {
  userId: string | null;
}

const Feedback = ({ userId }: FeedbackProps) => {
  return (
    <>
      <Card className="border-none rounded-none h-full">
        <CardHeader>
          <div className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-bold">
              We are here to improve your experience!
            </CardTitle>
          </div>
          <CardDescription>
            Your feedback matters! Please tell us what you think of our website
            below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* <FeedbackForm userId={userId} /> */}
          Feedback Form {userId}
        </CardContent>
      </Card>
    </>
  );
};

export default Feedback;
