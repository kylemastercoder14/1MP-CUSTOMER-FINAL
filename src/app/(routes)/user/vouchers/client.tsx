"use client";

import React from "react";
import useCoupon from "@/hooks/use-coupon";
import useCountdown from "@/hooks/use-countdown";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Client = () => {
  const { collectedCoupons, isCouponCollected } = useCoupon();

  const CountdownComponent = ({ endDate }: { endDate: Date }) => {
	const countdown = useCountdown(endDate);

	if (!countdown) {
	  return null;
	}

	const isExpired =
	  countdown.days +
		countdown.hours +
		countdown.minutes +
		countdown.seconds <=
	  0;

	return (
	  <p className="text-red-700 text-xs mt-1 font-medium whitespace-nowrap">
		{isExpired
		  ? "Expired"
		  : `Expires in ${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`}
	  </p>
	);
  };

  const ProgressComponent = ({
	claimed,
	total,
  }: {
	claimed: number;
	total: number;
  }) => {
	const progressValue = (claimed / total) * 100;
	const progressText = `${Math.round(progressValue)}% claimed`;

	return (
	  <div className="flex items-center w-full gap-2">
		<Progress className="h-[5px]" value={progressValue} />
		<p className="text-red-700 text-xs font-medium whitespace-nowrap">
		  {progressText}
		</p>
	  </div>
	);
  };

  return (
	<div>
	  <h2 className="text-xl font-bold">My Vouchers</h2>
	  {collectedCoupons && collectedCoupons.length > 0 ? (
		<div className="grid lg:grid-cols-3 grid-cols-1 mt-5 gap-5">
		  {collectedCoupons.map((coupon) => {
			const claimedQuantity = coupon.claimedQuantity || 0;
			const totalQuantity = coupon.claimableQuantity;
			const isCouponClaimed = isCouponCollected(coupon.id);
			const isExpired = new Date(coupon.endDate) < new Date();
			const isOutOfStock = claimedQuantity >= totalQuantity;

			return (
			  <div
				key={coupon.id}
				className="relative h-36 border-[#800020]/30 pl-3 border rounded-lg bg-[#800020]/5 w-full"
			  >
				<span className="text-[10px] absolute top-0 left-0 font-medium bg-[#800020] text-white px-2 py-1 rounded-br-lg rounded-tl-lg">
				  Limited Redemption
				</span>
				<div className="bg-white rounded-full w-[14px] h-[8px] absolute border-b border-x border-[#800020]/30 border-t-none -top-0.5 left-36"></div>
				<div className="bg-white rounded-full w-[14px] h-[8px] absolute border-b-none border-x border-[#800020]/30 border-t -bottom-0.5 left-36"></div>
				<div className="flex items-center h-full">
				  <div className="border-r-[2px] border-dashed border-[#800020]/20 pr-5 py-11 h-full">
					{coupon.type === "Money off (min.spend)" ? (
					  <h3 className="text-[#800020] text-center text-4xl font-black tracking-tighter">
						<span className="text-xl">₱</span>
						{coupon.discountAmount?.toLocaleString()}
					  </h3>
					) : (
					  <h3 className="text-[#800020] text-center text-4xl font-black tracking-tighter">
						{coupon.discountAmount}
						<span className="text-xl">% OFF</span>
					  </h3>
					)}
					{coupon.minimumSpend && (
					  <p className="text-sm whitespace-nowrap text-center text-red-700 mt-1 font-medium">
						Min. spend ₱{coupon.minimumSpend.toLocaleString()}
					  </p>
					)}
				  </div>

				  <div className="pl-5 w-full pr-5">
					<div className="flex w-full items-center justify-between">
					  <p className="text-2xl font-bold tracking-tight text-[#800020]">
						{coupon.name}
					  </p>

					  <p className="text-xs text-red-600 px-1.5 py-1 rounded-lg bg-[#800020]/15 font-medium">
						T&C
					  </p>
					</div>
					<p className="text-red-700 text-sm">{coupon.vendorName}</p>

					<div className="flex items-start justify-between mt-2">
					  <div>
						<ProgressComponent
						  claimed={claimedQuantity}
						  total={totalQuantity}
						/>

						<CountdownComponent endDate={coupon.endDate} />
					  </div>

					  <Button
						className="flex items-center justify-end"
						size="sm"
						disabled={
						  isExpired ||
						  isOutOfStock ||
						  isCouponClaimed ||
						  isCouponCollected(coupon.id)
						}
					  >
						{isCouponCollected(coupon.id)
						  ? "Collected"
						  : isExpired
							? "Expired"
							: isOutOfStock
							  ? "Out of Stock"
							  : "Collect"}
					  </Button>
					</div>
				  </div>
				</div>
			  </div>
			);
		  })}
		</div>
	  ) : (
		<div className="flex flex-col items-center justify-center h-full mt-30 text-center">
		  <Image
			src="/no-data.svg"
			alt="No Vouchers Found"
			width={150}
			height={150}
		  />
		  <h3 className="text-lg mt-4 font-medium">No vouchers found</h3>

		  <p className="text-muted-foreground max-w-sm">
			You don&apos;t have any collected vouchers yet. Browse for great
			deals and collect some now!
		  </p>
		</div>
	  )}
	</div>
  );
};

export default Client;
