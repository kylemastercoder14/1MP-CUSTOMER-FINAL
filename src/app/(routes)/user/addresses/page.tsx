/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Address as AddressType } from "@prisma/client";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import AddressForm from "@/components/forms/address-form";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Page = () => {
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressType | null>(
    null
  );
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [addressToDeleteId, setAddressToDeleteId] = useState<string | null>(
    null
  );

  // --- Fetch Addresses ---
  const fetchAddresses = useCallback(async () => {
    setAddressesLoading(true);
    try {
      const response = await fetch("/api/v1/customer/addresses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch addresses.");
      }

      const result = await response.json();
      if (result.success) {
        setAddresses(result.data);
      } else {
        toast.error(result.message || "Failed to load addresses.");
      }
    } catch (err: any) {
      console.error("Error fetching addresses:", err);
      toast.error(err.message || "An error occurred while loading addresses.");
    } finally {
      setAddressesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // --- Handlers for Address Actions ---

  const handleEdit = useCallback((address: AddressType) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (addressId: string) => {
    setAddressToDeleteId(addressId);
    setIsConfirmDeleteOpen(true);
  }, []);

  const executeDelete = useCallback(async () => {
    if (!addressToDeleteId) return;

    setIsConfirmDeleteOpen(false);
    toast.loading("Deleting address...");

    try {
      const response = await fetch("/api/v1/customer/addresses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: addressToDeleteId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete address.");
      }

      toast.success("Address deleted successfully!");
      fetchAddresses();
      setAddressToDeleteId(null);
    } catch (err: any) {
      console.error("Error deleting address:", err);
      toast.error(err.message || "Failed to delete address.");
    }
  }, [addressToDeleteId, fetchAddresses]);

  const handleSetDefault = useCallback(
    async (addressId: string) => {
      toast.loading("Setting default address...");
      try {
        const response = await fetch("/api/v1/customer/addresses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: addressId, isDefault: true }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to set default address."
          );
        }

        toast.success("Default address updated!");
        fetchAddresses();
      } catch (err: any) {
        console.error("Error setting default address:", err);
        toast.error(err.message || "Failed to set default address.");
      }
    },
    [fetchAddresses]
  );

  const handleFormSuccess = useCallback(() => {
    setIsModalOpen(false);
    setEditingAddress(null);
    fetchAddresses();
  }, [fetchAddresses]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">My Addresses</h2>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingAddress(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4" /> Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent className="!max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
            </DialogHeader>
            <AddressForm
              address={editingAddress}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <AlertDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setIsConfirmDeleteOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected address.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {addressesLoading ? (
        <div className="space-y-4">
          {[...Array(2)].map(
            (
              _,
              i // Show 2 skeleton cards
            ) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex justify-end gap-2 mt-4">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </Card>
            )
          )}
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center flex flex-col items-center justify-center pt-20 text-muted-foreground">
          <Image
            src="/icons/map-icon.png"
            alt="No addresses"
            width={150}
            height={150}
          />
          <p className="text-black font-medium">
            You don't have any addresses yet.
          </p>
          <p className="text-sm">Click "Add New Address" to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <Card key={address.id} className="p-4">
              <CardContent className="p-0 flex flex-col md:flex-row md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">
                      {address.fullName}
                    </h3>
                    <span className="text-sm text-gray-600">
                      ({address.contactNumber})
                    </span>
                    {address.isDefault && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">
                    {address.homeAddress}, {address.barangay}, {address.city},{" "}
                    {address.province}, {address.region}, {address.zipCode}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Type: {address.type}
                  </p>
                </div>
                <div className="flex items-center mt-4 md:mt-0 md:self-start">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEdit(address)}
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(address.id)}
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      Set as default
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
