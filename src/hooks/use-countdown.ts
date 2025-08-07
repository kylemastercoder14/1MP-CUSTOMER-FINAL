import { useState, useEffect } from "react";
import { intervalToDuration, Duration } from "date-fns";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const useCountdown = (targetDate: Date): Countdown | null => {
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const end = new Date(targetDate);
      if (now > end) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      const duration: Duration = intervalToDuration({ start: now, end });

      setCountdown({
        days: duration.days ?? 0,
        hours: duration.hours ?? 0,
        minutes: duration.minutes ?? 0,
        seconds: duration.seconds ?? 0,
      });
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return countdown;
};

export default useCountdown;
