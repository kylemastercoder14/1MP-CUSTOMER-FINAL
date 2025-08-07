"use client";

import React from "react";
import { InvoiceWithAddress } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Address } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  address: z.string().min(1, { message: "Address is required" }),
  companyName: z.string().optional(),
  tin: z.string().optional(),
});

const InvoiceForm = ({
  initialData,
  defaultAddress,
  onClose,
}: {
  initialData: InvoiceWithAddress | null;
  defaultAddress: Address | null;
  onClose?: () => void;
}) => {
  const router = useRouter();
  // Determine which address to use and format it.
  const addressToUse = initialData?.address || defaultAddress;

  const formattedAddress = addressToUse
    ? `${addressToUse.fullName} ${addressToUse.contactNumber}\n${addressToUse.homeAddress}, ${addressToUse.barangay}, ${addressToUse.city}, ${addressToUse.province}, ${addressToUse.region} ${addressToUse.zipCode}`
    : "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: formattedAddress,
      companyName: initialData?.companyName || "",
      tin: initialData?.tinId || "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Determine the addressId to send to the API
    const addressIdToUse = initialData?.addressId || defaultAddress?.id;

    if (!addressIdToUse) {
      // Handle the case where no address is available (unlikely with your logic, but good practice)
      console.error("No address available to save.");
      return;
    }

    const payload = {
      companyName: values.companyName,
      tinId: values.tin,
      addressId: addressIdToUse,
    };

    const method = initialData ? "PUT" : "POST";
    const url = "/api/v1/customer/invoices";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData.message);
        // You could show a toast or a different error message here
        return;
      }

      await response.json();

      onClose?.();
      toast.success("Invoice information saved successfully!");
      router.refresh();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Billing Address</FormLabel>
                <Button
                  variant="link"
                  className="text-[#800020]"
                  size="sm"
                  type="button"
                  onClick={() => router.push("/user/addresses")}
                >
                  Edit
                </Button>
              </div>
              <FormControl>
                <Textarea {...field} disabled />
              </FormControl>
              <FormDescription>
                Please edit your billing address
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isSubmitting}
                  placeholder="Enter company name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company/Personal Tax ID</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isSubmitting}
                  placeholder="Enter Tax ID"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center w-full justify-center gap-2">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1"
            variant="ghost"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InvoiceForm;
