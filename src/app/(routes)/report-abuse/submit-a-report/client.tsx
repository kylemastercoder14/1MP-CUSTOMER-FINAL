"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import Header from "@/components/globals/header";
import Footer from "@/components/globals/footer";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import MultipleImageUpload from "@/components/globals/multiple-image-upload";
import { User } from '@prisma/client';

const formSchema = z.object({
  role: z.string().min(1, { message: "Role is required" }),
  defendantName: z.string().optional(),
  reportType: z.string().min(1, { message: "Report type is required" }),
  complaintReason: z
    .string()
    .min(1, { message: "Complaint reason is required" }),
  attachments: z.array(z.string()).optional(),
});

const Client = ({user}: {user: User | null}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "buyer",
      defendantName: "",
      reportType: type || "",
      complaintReason: "",
      attachments: [],
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="relative">
        <Header />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <section className="lg:px-80 px-10 lg:pt-36 pt-20 pb-10">
            <h2 className="text-2xl font-bold tracking-tight">
              Submit a Complaint
            </h2>
            <div className="bg-white border shadow p-5 mt-5">
              <h2 className="text-lg font-bold">Complaintant Information</h2>
              <div className="grid mt-4 lg:grid-cols-2 grid-cols-1 gap-5">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Your role</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex items-start gap-5"
                          disabled={isSubmitting}
                        >
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <RadioGroupItem value="buyer" />
                            </FormControl>
                            <FormLabel className="font-normal">Buyer</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <RadioGroupItem value="seller" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Seller
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <FormLabel>Login Name</FormLabel>
                  <p>
                    {user?.firstName ||
                      user?.lastName ||
                      user?.email?.split("@")[0] ||
                      "User"}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white border shadow p-5 mt-5">
              <h2 className="text-lg font-bold mb-4">Complaintant Content</h2>
              <div className="space-y-6">
                {type ? (
                  <div className="space-y-2">
                    <FormLabel>Report type</FormLabel>
                    <p>{type.toUpperCase().replace(/-/g, " ")}</p>
                  </div>
                ) : (
                  <FormField
                    control={form.control}
                    name="reportType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full rounded-none">
                              <SelectValue placeholder="Select a report type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ip-rights-holder-report">
                              IP Rights Holder Report
                            </SelectItem>
                            <SelectItem value="report-image-copyright-infringement">
                              Report Image Copyright Infringement
                            </SelectItem>
                            <SelectItem value="report-counterfeit-products">
                              Report Counterfeit Products
                            </SelectItem>
                            <SelectItem value="report-prohibited-and-restricted-products">
                              Report Prohibited and Restricted Products
                            </SelectItem>
                            <SelectItem value="report-misleading-product-information">
                              Report Misleading Product Information
                            </SelectItem>
                            <SelectItem value="order-not-received">
                              Order Not Received
                            </SelectItem>
                            <SelectItem value="defective-or-damaged-product">
                              Defective or Damaged Product
                            </SelectItem>
                            <SelectItem value="refund-not-processed">
                              Refund Not Processed
                            </SelectItem>
                            <SelectItem value="third-party-payment-dispute">
                              Third Party Payment Dispute
                            </SelectItem>
                            <SelectItem value="improper-use-of-other-peoples-information">
                              Improper Use of Other People&apos;s Information
                            </SelectItem>
                            <SelectItem value="content-violations">
                              Content Violations
                            </SelectItem>
                            <SelectItem value="report-other-user">
                              Report Other User
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {form.watch("reportType") === "report-other-user" && (
                  <FormField
                    control={form.control}
                    name="defendantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Defendant Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter the name of the user you are reporting"
                            className="rounded-none"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Please provide the username or name of the user you
                          are reporting.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="complaintReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complaint reason</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about your complaint"
                          className="resize-none rounded-none"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Please provide as much detail as possible to help us
                        understand your complaint.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="attachments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complaint reason</FormLabel>
                      <FormControl>
                        <MultipleImageUpload
                          maxImages={3}
                          onImageUpload={(urls: string[]) =>
                            field.onChange(urls)
                          }
                          disabled={isSubmitting}
                          folder="assets/reports"
                          defaultValues={field.value
                            ?.map((file: File | string) => {
                              if (typeof file === "string") return file;
                              if (file instanceof File)
                                return URL.createObjectURL(file);
                              return ""; // or skip
                            })
                            .filter(Boolean)}
                        />
                      </FormControl>
                      <FormDescription>
                        You can upload up to 3 images to support your complaint.
                        Please ensure that the images are clear and relevant to
                        your complaint.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex items-center justify-end mt-4">
              <Button
                disabled={isSubmitting}
                type="button"
                onClick={() => router.back()}
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                disabled={isSubmitting}
                type="submit"
                variant="default"
                className="rounded-none"
              >
                Submit
              </Button>
            </div>
          </section>
        </form>
      </Form>

      <Footer />
    </div>
  );
};

export default Client;
