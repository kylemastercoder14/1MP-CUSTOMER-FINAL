/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { getInitials, maskEmail } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { PhoneInput } from "@/components/ui/phone-input";
import { User } from "@prisma/client";

const UserProfileUpdateClient = ({ user }: { user: User | null }) => {
  const router = useRouter();
  // --- Form State Management ---
  const [username, setUsername] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [dobDay, setDobDay] = useState<string>("");
  const [dobMonth, setDobMonth] = useState<string>("");
  const [dobYear, setDobYear] = useState<string>("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  // Populate form fields when customer data loads or changes
  useEffect(() => {
	if (user) {
	  setUsername(user.username || "");
	  setFirstName(user.firstName || "");
	  setLastName(user.lastName || "");
	  setPhoneNumber(user.phoneNumber || "");
	  setGender(user.gender || "");

	  // Parse date of birth if available
	  if (user.dateOfBirth) {
		// Create a Date object from the ISO string
		const dob = new Date(user.dateOfBirth);

		// Ensure the Date object is valid before trying to get parts
		if (!isNaN(dob.getTime())) {
		  // Check if date parsing was successful
		  setDobDay(String(dob.getDate()));
		  // Month is 0-indexed, so add 1 and pad with '0' for single digits (e.g., "01" for January)
		  setDobMonth(String(dob.getMonth() + 1).padStart(2, "0"));
		  setDobYear(String(dob.getFullYear()));
		} else {
		  // Handle invalid date string gracefully
		  console.warn(
			"Invalid dateOfBirth string received:",
			user.dateOfBirth
		  );
		  setDobDay("");
		  setDobMonth("");
		  setDobYear("");
		}
	  } else {
		// Clear DOB fields if dateOfBirth is null or undefined
		setDobDay("");
		setDobMonth("");
		setDobYear("");
	  }
	} else if (!user) {
	  setFirstName("");
	  setLastName("");
	  // Clear DOB fields for new users or if customer data is absent
	  setDobDay("");
	  setDobMonth("");
	  setDobYear("");
	}
  }, [user]);

  // --- Image File Change Handler (basic validation) ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	if (e.target.files && e.target.files[0]) {
	  const file = e.target.files[0];
	  if (file.size > 5 * 1024 * 1024) {
		toast.error("File size exceeds 5MB. Please choose a smaller image.");
		setProfileImageFile(null);
		e.target.value = "";
		return;
	  }
	  if (!["image/jpeg", "image/png"].includes(file.type)) {
		toast.error("Invalid file type. Only JPEG and PNG are allowed.");
		setProfileImageFile(null);
		e.target.value = "";
		return;
	  }
	  setProfileImageFile(file);
	} else {
	  setProfileImageFile(null);
	}
  };

  // --- New Function for Image Upload ---
  const handleImageUpload = useCallback(async () => {
	if (!profileImageFile) return;

	setIsUploadingImage(true);

	try {
	  const formData = new FormData();
	  formData.append("profileImage", profileImageFile);

	  const response = await fetch("/api/v1/customer/profile/image", {
		method: "PUT",
		body: formData,
	  });

	  if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "Failed to upload image.");
	  }

	  const result = await response.json();
	  toast.success(result.message || "Profile picture updated!");
	  router.refresh();
	  setProfileImageFile(null);
	} catch (err: any) {
	  console.error("Error uploading image:", err);
	  toast.error(err.message || "Failed to upload profile picture.");
	} finally {
	  setIsUploadingImage(false);
	}
  }, [profileImageFile, router]);

  useEffect(() => {
	if (profileImageFile) {
	  handleImageUpload();
	}
  }, [profileImageFile, handleImageUpload]);

  const handleSave = useCallback(
	async (e: React.FormEvent) => {
	  e.preventDefault();

	  setIsSavingProfile(true);
	  try {
		const formData = new FormData();
		formData.append("username", username);
		formData.append("firstName", firstName);
		formData.append("lastName", lastName);
		if (phoneNumber) formData.append("phoneNumber", phoneNumber);
		formData.append("gender", gender);
		if (dobDay && dobMonth && dobYear) {
		  const dobDate = new Date(
			Number(dobYear),
			Number(dobMonth) - 1,
			Number(dobDay)
		  ).toISOString();
		  formData.append("dateOfBirth", dobDate);
		}

		const response = await fetch("/api/v1/customer/profile/update", {
		  method: "PUT",
		  body: formData,
		});

		if (!response.ok) {
		  const errorData = await response.json();
		  throw new Error(errorData.message || "Failed to update profile.");
		}

		const result = await response.json();
		toast.success(result.message || "Profile updated successfully!");
		router.refresh();
	  } catch (err: any) {
		console.error("Error saving profile:", err);
		toast.error(err.message || "Failed to save profile changes.");
	  } finally {
		setIsSavingProfile(false);
	  }
	},
	[
	  username,
	  firstName,
	  lastName,
	  phoneNumber,
	  gender,
	  dobDay,
	  dobMonth,
	  dobYear,
	  router,
	]
  );

  // Generate days, months, years for DOB selects
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const months = Array.from({ length: 12 }, (_, i) =>
	String(i + 1).padStart(2, "0")
  );
  const years = Array.from({ length: 100 }, (_, i) =>
	String(new Date().getFullYear() - i)
  );

  return (
	<div className="flex flex-col gap-1">
	  <h2 className="text-xl font-bold">My Profile</h2>
	  <p className="text-sm text-gray-500">Manage and protect your account</p>
	  <Separator className="my-4" />

	  <form
		onSubmit={handleSave}
		className="grid lg:grid-cols-5 grid-cols-1 gap-8"
	  >
		{/* Left Section: Form Fields */}
		<div className="lg:col-span-4 space-y-6 pr-20">
		  <div className="grid w-full items-center gap-2">
			<Label htmlFor="username">Username</Label>
			<Input
			  type="text"
			  id="username"
			  placeholder="Username"
			  value={username}
			  onChange={(e) => setUsername(e.target.value)}
			  className="w-full"
			  disabled={!!user?.username || isSavingProfile} // Disable if username set or saving
			/>
			{user?.username && (
			  <p className="text-xs text-muted-foreground mt-1">
				Username can only be changed once.
			  </p>
			)}
		  </div>

		  <div className="grid w-full items-center gap-2">
			<Label htmlFor="name">Name</Label>
			<div className="flex items-center gap-2">
			  <Input
				type="text"
				id="firstName"
				placeholder="First Name"
				value={firstName}
				onChange={(e) => setFirstName(e.target.value)}
				className="w-full"
				disabled={isSavingProfile}
			  />
			  <Input
				type="text"
				id="lastName"
				placeholder="Last Name"
				value={lastName}
				onChange={(e) => setLastName(e.target.value)}
				className="w-full"
				disabled={isSavingProfile}
			  />
			</div>
		  </div>

		  <div className="grid w-full items-center gap-2">
			<Label htmlFor="email">Email</Label>
			<div className="flex items-center">{maskEmail(user?.email)}</div>
		  </div>

		  <div className="grid w-full items-center gap-2">
			<Label htmlFor="phoneNumber">Phone Number</Label>
			<div className="flex items-center">
			  <PhoneInput
				placeholder="Enter a phone number"
				value={phoneNumber}
				onChange={(value) => setPhoneNumber(value || "")}
				focusInputOnCountrySelection
				defaultCountry="PH"
				maxLength={16}
				international
				countryCallingCodeEditable={false}
				limitMaxLength={true}
				className="w-full"
				disabled={isSavingProfile}
			  />
			</div>
		  </div>

		  <div className="grid w-full items-center gap-4">
			<Label>Gender</Label>
			<RadioGroup
			  value={gender}
			  onValueChange={setGender}
			  className="flex gap-4"
			  disabled={isSavingProfile}
			>
			  <div className="flex items-center space-x-2.5">
				<RadioGroupItem value="Male" id="gender-male" />
				<Label htmlFor="gender-male">Male</Label>
			  </div>
			  <div className="flex items-center space-x-2.5">
				<RadioGroupItem value="Female" id="gender-female" />
				<Label htmlFor="gender-female">Female</Label>
			  </div>
			</RadioGroup>
		  </div>

		  <div className="grid w-full items-center gap-1.5">
			<Label>Date of birth</Label>
			<div className="flex gap-2">
			  <Select
				value={dobDay}
				disabled={isSavingProfile}
				onValueChange={setDobDay}
			  >
				<SelectTrigger className="w-1/3">
				  <SelectValue placeholder="Date" />
				</SelectTrigger>
				<SelectContent>
				  {days.map((day) => (
					<SelectItem key={day} value={day}>
					  {day}
					</SelectItem>
				  ))}
				</SelectContent>
			  </Select>
			  <Select
				value={dobMonth}
				disabled={isSavingProfile}
				onValueChange={setDobMonth}
			  >
				<SelectTrigger className="w-1/3">
				  <SelectValue placeholder="Month" />
				</SelectTrigger>
				<SelectContent>
				  {months.map((month) => (
					<SelectItem key={month} value={month}>
					  {month}
					</SelectItem>
				  ))}
				</SelectContent>
			  </Select>
			  <Select
				value={dobYear}
				disabled={isSavingProfile}
				onValueChange={setDobYear}
			  >
				<SelectTrigger className="w-1/3">
				  <SelectValue placeholder="Year" />
				</SelectTrigger>
				<SelectContent>
				  {years.map((year) => (
					<SelectItem key={year} value={year}>
					  {year}
					</SelectItem>
				  ))}
				</SelectContent>
			  </Select>
			</div>
		  </div>

		  <Button type="submit" className="mt-4" disabled={isSavingProfile}>
			{isSavingProfile ? (
			  <>
				<Loader2 className="animate-spin" />
				Saving Changes
			  </>
			) : (
			  "Save Changes"
			)}
		  </Button>
		</div>

		{/* Right Section: Avatar and Image Upload */}
		<div className="lg:col-span-1 flex flex-col items-center border-l border-gray-200 pt-4">
		  <Avatar className="w-24 h-24">
			{" "}
			{/* Larger avatar as in image */}
			<AvatarImage
			  src={
				profileImageFile
				  ? URL.createObjectURL(profileImageFile)
				  : user?.image || ""
			  }
			  className="w-full h-full object-cover"
			  alt={user?.firstName || "User avatar"}
			/>
			<AvatarFallback>
			  {getInitials(user?.firstName, user?.lastName) ||
				user?.email ||
				"U"}
			</AvatarFallback>
		  </Avatar>
		  <input
			type="file"
			id="profileImageUpload"
			accept="image/jpeg, image/png"
			onChange={handleFileChange}
			className="hidden"
			disabled={isUploadingImage}
		  />
		  <Label
			htmlFor="profileImageUpload"
			className="mt-4 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700"
		  >
			{isUploadingImage ? (
			  <Loader2 className="animate-spin mr-2" />
			) : (
			  "Select Image"
			)}
		  </Label>
		  <p className="text-xs text-muted-foreground mt-2 text-center">
			File size: maximum 5 MB
			<br />
			File extension: JPEG, PNG
		  </p>
		</div>
	  </form>
	</div>
  );
};

export default UserProfileUpdateClient;
