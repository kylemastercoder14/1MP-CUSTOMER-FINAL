"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { formatDistanceToNowStrict } from "date-fns";

interface VendorStatus {
  lastActiveAt: Date | null;
  statusText: string;
  isOnline: boolean;
}

// API endpoint to update the vendor's activity
const UPDATE_ACTIVITY_URL = `${process.env.NEXT_PUBLIC_APP_VENDOR_URL}/api/v1/vendor/update-activity`;
// API endpoint to get the vendor's last active timestamp
const GET_LAST_ACTIVE_URL = `${process.env.NEXT_PUBLIC_APP_VENDOR_URL}/api/v1/vendor/last-active`;

const useVendorActiveStatus = (vendorId: string | null) => {
  const [status, setStatus] = useState<VendorStatus>({
    lastActiveAt: null,
    statusText: "Offline",
    isOnline: false,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to update the vendor's activity on the backend
  const updateActivity = async () => {
    if (!vendorId) return;
    try {
      await axios.post(UPDATE_ACTIVITY_URL, { vendorId });
    } catch (error) {
      console.error("Failed to update vendor activity:", error);
    }
  };

  // Function to fetch the vendor's last active timestamp
  const fetchStatus = async () => {
    if (!vendorId) return;
    try {
      const response = await axios.get(`${GET_LAST_ACTIVE_URL}/${vendorId}`);
      const lastActiveTimestamp = response.data.lastActiveAt;

      if (lastActiveTimestamp) {
        const lastActiveDate = new Date(lastActiveTimestamp);
        const fiveMinutesAgo = new Date(new Date().getTime() - 5 * 60 * 1000);

        const isOnline = lastActiveDate > fiveMinutesAgo;
        const statusText = isOnline
          ? "Online"
          : `Active ${formatDistanceToNowStrict(lastActiveDate, { addSuffix: true })}`;

        setStatus({
          lastActiveAt: lastActiveDate,
          statusText,
          isOnline,
        });
      } else {
        setStatus({
          lastActiveAt: null,
          statusText: "Offline",
          isOnline: false,
        });
      }
    } catch (error) {
      console.error("Failed to fetch vendor status:", error);
      setStatus({
        lastActiveAt: null,
        statusText: "Offline",
        isOnline: false,
      });
    }
  };

  useEffect(() => {
    if (!vendorId) {
      setStatus({ lastActiveAt: null, statusText: "Offline", isOnline: false });
      return;
    }

    // Initial status fetch
    fetchStatus();

    // Event listeners to update activity
    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "click",
    ];
    const handleActivity = () => updateActivity();
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, { once: true });
    });

    // Polling every 30 seconds to update the status
    intervalRef.current = setInterval(fetchStatus, 30000);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId]);

  return status;
};

export default useVendorActiveStatus;
