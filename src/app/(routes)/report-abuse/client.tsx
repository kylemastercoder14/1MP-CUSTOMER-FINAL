/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import TabsComponent from "@/components/globals/tabs-component";
import {
  reportAbuseTableTabs,
  ReportAbuseTableTabType,
  reportAbuseTabs,
  ReportAbuseTabType,
} from "@/types";
import Header from "@/components/globals/header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Footer from "@/components/globals/footer";
import { useRouter } from "next/navigation";

const Client = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] =
	useState<ReportAbuseTabType>("Product Violations");
  const [activeTableTab, setActiveTableTab] = useState<ReportAbuseTableTabType>(
	"Product related violations"
  );
  return (
	<div className="min-h-screen bg-[#f5f5f5]">
	  <div className="relative">
		<Header />
	  </div>
	  <section className="lg:px-20 px-10 lg:pt-36 pt-20 pb-10">
		<TabsComponent
		  activeTab={activeTab}
		  setActiveTab={setActiveTab}
		  items={reportAbuseTabs}
		/>
		{activeTab === "Product Violations" && (
		  <div className="mt-5">
			<div className="border-t border-gray-200 pt-6 space-y-6">
			  {/* IP rights holder report */}
			  <div className="bg-white p-4  shadow">
				<h3 className="font-bold text-xl tracking-tighter">
				  IP rights holder report
				</h3>
				<div className="flex lg:flex-row flex-col lg:items-center gap-3 lg:justify-between">
				  <p className=" text-muted-foreground">
					If you are the owner or licensee of an intellectual property
					right and believe it has been infringed on our platform,
					please submit a complaint.
				  </p>
				  <button
					onClick={() =>
					  router.push(
						"/report-abuse/submit-a-report?type=ip-rights-holder-report"
					  )
					}
					className="bg-transparent text-black border border-black px-2.5 cursor-pointer py-1.5 text-xs rounded-full hover:bg-accent"
				  >
					Submit a complaint
				  </button>
				</div>
			  </div>
			  {/* Non-IP rights holder report */}
			  <div className="bg-white p-4  shadow">
				<h2 className="font-bold mb-2 text-xl tracking-tighter">
				  Non-IP rights holder report
				</h2>
				<h3 className="font-semibold tracking-tighter">
				  Report Image Copyright infringement
				</h3>
				<div className="flex lg:flex-row flex-col lg:items-center gap-3 lg:justify-between">
				  <p className="text-muted-foreground">
					If you are the creator of the image but are unable to
					provide copyright proof, please submit a complaint.
				  </p>
				  <button
					onClick={() =>
					  router.push(
						"/report-abuse/submit-a-report?type=report-image-copyright-infringement"
					  )
					}
					className="bg-transparent text-black border border-black px-2.5 cursor-pointer py-1.5 text-xs rounded-full hover:bg-accent"
				  >
					Submit a complaint
				  </button>
				</div>
				<h3 className="font-semibold mt-2 tracking-tighter">
				  Report counterfeit products
				</h3>
				<div className="flex lg:flex-row flex-col lg:items-center gap-3 lg:justify-between">
				  <p className="text-muted-foreground">
					If you are not the owner or licensee of an intellectual
					property right but are aware of counterfeit products being
					sold, you may submit a complaint to us.
				  </p>
				  <button
					onClick={() =>
					  router.push(
						"/report-abuse/submit-a-report?type=report-counterfeit-products"
					  )
					}
					className="bg-transparent text-black border border-black px-2.5 cursor-pointer py-1.5 text-xs rounded-full hover:bg-accent"
				  >
					Submit a complaint
				  </button>
				</div>
			  </div>
			  {/* Report prohibited and restricted products */}
			  <div className="bg-white p-4  shadow">
				<h3 className="font-bold mb-2 text-xl tracking-tighter">
				  Report prohibited and restricted products
				</h3>
				<div className="flex lg:flex-row flex-col lg:items-center gap-3 lg:justify-between">
				  <p className="text-muted-foreground">
					If you find a supplier displaying prohibited or restricted
					products, please click "Report" to submit a complaint.
				  </p>
				  <button
					onClick={() =>
					  router.push(
						"/report-abuse/submit-a-report?type=report-prohibited-and-restricted-products"
					  )
					}
					className="bg-transparent text-black border border-black px-2.5 cursor-pointer py-1.5 text-xs rounded-full hover:bg-accent"
				  >
					Report Issue
				  </button>
				</div>
			  </div>

			  {/* Report misleading product information */}
			  <div className="bg-white p-4  shadow">
				<h3 className="font-bold mb-2 text-xl tracking-tighter">
				  Report misleading product information
				</h3>
				<div className="flex lg:flex-row flex-col lg:items-center gap-3 lg:justify-between">
				  <p className="text-muted-foreground">
					If you find any supplier listing containing misleading or
					inaccurate information, please click "Report" to submit a
					complaint.
				  </p>
				  <button
					onClick={() =>
					  router.push(
						"/report-abuse/submit-a-report?type=report-misleading-product-information"
					  )
					}
					className="bg-transparent text-black border border-black px-2.5 cursor-pointer py-1.5 text-xs rounded-full hover:bg-accent"
				  >
					Report Issue
				  </button>
				</div>
			  </div>
			</div>
		  </div>
		)}
		{activeTab === "Order Disputes" && (
		  <div className="mt-5">
			<div className="border-t border-gray-200 pt-6 space-y-6">
			  {/* Order not received */}
			  <div className="bg-white p-4  shadow">
				<h3 className="font-bold text-xl tracking-tighter">
				  Order not received
				</h3>
				<div className="flex lg:flex-row flex-col lg:items-center gap-3 lg:justify-between">
				  <p className="text-muted-foreground">
					The order was marked as shipped but I haven't received it
					within the promised delivery timeframe.
				  </p>
				  <button
					onClick={() =>
					  router.push(
						"/report-abuse/submit-a-report?type=order-not-received"
					  )
					}
					className="bg-transparent text-black border border-black px-2.5 cursor-pointer py-1.5 text-xs rounded-full hover:bg-accent"
				  >
					Submit a complaint
				  </button>
				</div>
			  </div>

			  {/* Defective or damaged product */}
			  <div className="bg-white p-4  shadow">
				<h3 className="font-bold text-xl tracking-tighter">
				  Defective or damaged product
				</h3>
				<div className="flex lg:flex-row flex-col lg:items-center gap-3 lg:justify-between">
				  <p className="text-muted-foreground">
					The item arrived damaged, defective, or not working as
					described in the product specifications.
				  </p>
				  <button
					onClick={() =>
					  router.push(
						"/report-abuse/submit-a-report?type=defective-or-damaged-product"
					  )
					}
					className="bg-transparent text-black border border-black px-2.5 cursor-pointer py-1.5 text-xs rounded-full hover:bg-accent"
				  >
					Submit a complaint
				  </button>
				</div>
			  </div>

			  {/* Refund not processed */}
			  <div className="bg-white p-4  shadow">
				<h3 className="font-bold text-xl tracking-tighter">
				  Refund not processed
				</h3>
				<div className="flex lg:flex-row flex-col lg:items-center gap-3 lg:justify-between">
				  <p className="text-muted-foreground">
					The seller agreed to a refund but I haven't received it
					within the promised timeframe.
				  </p>
				  <button
					onClick={() =>
					  router.push(
						"/report-abuse/submit-a-report?type=refund-not-processed"
					  )
					}
					className="bg-transparent text-black border border-black px-2.5 cursor-pointer py-1.5 text-xs rounded-full hover:bg-accent"
				  >
					Submit a complaint
				  </button>
				</div>
			  </div>

			  {/* Third party dispute */}
			  <div className="bg-white p-4  shadow">
				<h3 className="font-bold text-xl tracking-tighter">
				  Third party payment dispute
				</h3>
				<div className="flex lg:flex-row flex-col lg:items-center gap-3 lg:justify-between">
				  <p className="text-muted-foreground">
					I paid through a third-party source but no products or
					refund received/I have not received payment after delivery.
				  </p>
				  <button
					onClick={() =>
					  router.push(
						"/report-abuse/submit-a-report?type=third-party-payment-dispute"
					  )
					}
					className="bg-transparent text-black border border-black px-2.5 cursor-pointer py-1.5 text-xs rounded-full hover:bg-accent"
				  >
					Submit a complaint
				  </button>
				</div>
			  </div>
			</div>
		  </div>
		)}
		{activeTab === "Other Violations" && (
		  <div className="mt-5">
			<div className="border-t border-gray-200 pt-6 space-y-6">
			  {/* Improper use of other people's information */}
			  <div className="bg-white p-4  shadow">
				<h3 className="font-bold text-xl tracking-tighter">
				  Improper use of other people's information
				</h3>
				<div className="flex lg:flex-row flex-col lg:items-center gap-3 lg:justify-between">
				  <p className="text-muted-foreground">
					If your complaint involves any infringement due to improper
					use of someone else's information, please click the
					following link to submit a complaint.
				  </p>
				  <button
					onClick={() =>
					  router.push(
						"/report-abuse/submit-a-report?type=improper-use-of-other-peoples-information"
					  )
					}
					className="bg-transparent text-black border border-black px-2.5 cursor-pointer py-1.5 text-xs rounded-full hover:bg-accent"
				  >
					Submit a complaint
				  </button>
				</div>
			  </div>

			  {/* Content Violations */}
			  <div className="bg-white p-4  shadow">
				<h3 className="font-bold text-xl tracking-tighter">
				  Content Violations
				</h3>
				<div className="flex lg:flex-row flex-col lg:items-center gap-3 lg:justify-between">
				  <p className="text-muted-foreground">
					Please submit reporting information if the platform content
					violates the rules.
				  </p>
				  <button
					onClick={() =>
					  router.push(
						"/report-abuse/submit-a-report?type=content-violations"
					  )
					}
					className="bg-transparent text-black border border-black px-2.5 cursor-pointer py-1.5 text-xs rounded-full hover:bg-accent"
				  >
					Submit a complaint
				  </button>
				</div>
			  </div>
			</div>
		  </div>
		)}
		<h2 className="font-bold mt-6 mb-4 text-2xl tracking-tighter">
		  My Complaints
		</h2>
		<TabsComponent
		  activeTab={activeTableTab}
		  setActiveTab={setActiveTableTab}
		  items={reportAbuseTableTabs}
		/>
		<Table className="mt-2">
		  <TableHeader className="bg-red-600">
			<TableRow className="bg-red-600">
			  <TableHead className="bg-stone-200">Case number</TableHead>
			  <TableHead className="bg-stone-200">Case details</TableHead>
			  <TableHead className="bg-stone-200">Complaint type</TableHead>
			  <TableHead className="bg-stone-200">Date</TableHead>
			  <TableHead className="bg-stone-200">Status</TableHead>
			</TableRow>
		  </TableHeader>
		  <TableBody>
			{/* <TableRow>
				  <TableCell>NGUYN8F2</TableCell>
				  <TableCell>Testing</TableCell>
				  <TableCell>Product abuse</TableCell>
				  <TableCell>Jul 7, 2025</TableCell>
				  <TableCell>Pending</TableCell>
				</TableRow> */}
			<TableRow>
			  <TableCell
				colSpan={5}
				className="text-center text-muted-foreground pt-4"
			  >
				No complaint found
			  </TableCell>
			</TableRow>
		  </TableBody>
		</Table>
	  </section>
	  <Footer />
	</div>
  );
};

export default Client;
