/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Address as AddressType } from "@prisma/client";
import { PhoneInput } from "@/components/ui/phone-input";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// --- PSGC API Types ---
interface PsgcItem {
  code: string;
  name: string;
  is_municipality?: boolean;
}

// --- PSGC API Fetch Functions ---
const BASE_PSGC_API_URL = "https://psgc.gitlab.io/api";

const fetchPsgcData = async <T extends PsgcItem>(url: string): Promise<T[]> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from PSGC API: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("PSGC API fetch error:", error);
    toast.error(`Failed to load geographical data. Please try again later.`);
    return [];
  }
};

const fetchRegions = (): Promise<PsgcItem[]> =>
  fetchPsgcData(`${BASE_PSGC_API_URL}/regions/`);
const fetchProvinces = (regionCode: string): Promise<PsgcItem[]> =>
  fetchPsgcData(`${BASE_PSGC_API_URL}/regions/${regionCode}/provinces/`);
const fetchCitiesMunicipalities = (provinceCode: string): Promise<PsgcItem[]> =>
  fetchPsgcData(`${BASE_PSGC_API_URL}/provinces/${provinceCode}/cities-municipalities/`);
const fetchBarangays = (cityMunicipalityCode: string): Promise<PsgcItem[]> =>
  fetchPsgcData(`${BASE_PSGC_API_URL}/cities-municipalities/${cityMunicipalityCode}/barangays/`);


// --- Nominatim (OpenStreetMap Geocoding) API ---
interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

const geocodeAddress = async (addressQuery: string): Promise<NominatimResult | null> => {
  if (!addressQuery) return null;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressQuery)}&format=json&limit=1&countrycodes=PH`;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': '1 Market Philippines/1.0 (kylemastercoder14@gmail.com)' // IMPORTANT: Replace with your actual app name and email
      }
    });
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }
    const data: NominatimResult[] = await response.json();
    if (data && data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    console.error("Nominatim Geocoding error:", error);
    toast.error("Could not find location on map. Please try a more specific address.");
    return null;
  }
};


interface AddressFormProps {
  address?: AddressType | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const AddressForm = ({ address, onSuccess, onCancel }: AddressFormProps) => {
  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [homeAddress, setHomeAddress] = useState("");

  const [selectedRegionCode, setSelectedRegionCode] = useState<string>("");
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>("");
  const [selectedCityCode, setSelectedCityCode] = useState<string>("");
  const [selectedBarangayCode, setSelectedBarangayCode] = useState<string>("");
  const [zipCode, setZipCode] = useState("");

  const [type, setType] = useState("Home");
  const [isDefault, setIsDefault] = useState(false);
  const [isSavingLoading, setIsSavingLoading] = useState(false);

  const [regions, setRegions] = useState<PsgcItem[]>([]);
  const [provinces, setProvinces] = useState<PsgcItem[]>([]);
  const [cities, setCities] = useState<PsgcItem[]>([]);
  const [barangays, setBarangays] = useState<PsgcItem[]>([]);

  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);

  const [activeTab, setActiveTab] = useState<"region" | "province" | "city" | "barangay">("region");
  const [isLocationSelectOpen, setIsLocationSelectOpen] = useState(false);

  // --- Map States ---
  const [mapCoordinates, setMapCoordinates] = useState<{ lat: string; lon: string } | null>(null);
  const [mapLoading, setMapLoading] = useState(false);

  // --- Refs for CommandInput ---
  const regionSearchRef = useRef<HTMLInputElement>(null);
  const provinceSearchRef = useRef<HTMLInputElement>(null);
  const citySearchRef = useRef<HTMLInputElement>(null);
  const barangaySearchRef = useRef<HTMLInputElement>(null);

  // --- Populate form fields when editing an existing address ---
  useEffect(() => {
    const populateForm = async () => {
      if (address) {
        setFullName(address.fullName);
        setContactNumber(address.contactNumber);
        setHomeAddress(address.homeAddress);

        setZipCode(address.zipCode);
        setType(address.type);
        setIsDefault(address.isDefault);

        setLoadingRegions(true);
        const allRegions = await fetchRegions();
        setRegions(allRegions);
        setLoadingRegions(false);

        const foundRegion = allRegions.find(r => r.name === address.region);
        if (foundRegion) {
          setSelectedRegionCode(foundRegion.code);
          setLoadingProvinces(true);
          const allProvinces = await fetchProvinces(foundRegion.code);
          setProvinces(allProvinces);
          setLoadingProvinces(false);

          const foundProvince = allProvinces.find(p => p.name === address.province);
          if (foundProvince) {
            setSelectedProvinceCode(foundProvince.code);
            setLoadingCities(true);
            const allCities = await fetchCitiesMunicipalities(foundProvince.code);
            setCities(allCities);
            setLoadingCities(false);

            const foundCity = allCities.find(c => c.name === address.city);
            if (foundCity) {
              setSelectedCityCode(foundCity.code);
              setLoadingBarangays(true);
              const allBarangays = await fetchBarangays(foundCity.code);
              setBarangays(allBarangays);
              setLoadingBarangays(false);

              const foundBarangay = allBarangays.find(b => b.name === address.barangay);
              if (foundBarangay) {
                setSelectedBarangayCode(foundBarangay.code);
              }
            }
          }
        }
      } else {
        setFullName("");
        setContactNumber("");
        setHomeAddress("");
        setSelectedRegionCode("");
        setSelectedProvinceCode("");
        setSelectedCityCode("");
        setSelectedBarangayCode("");
        setZipCode("");
        setType("Home");
        setIsDefault(false);
      }
    };
    populateForm();
  }, [address]);

  // --- Fetch Regions on initial load (for new address form) ---
  useEffect(() => {
    if (!address && regions.length === 0 && !loadingRegions) {
      const loadRegions = async () => {
        setLoadingRegions(true);
        const fetchedRegions = await fetchRegions();
        setRegions(fetchedRegions);
        setLoadingRegions(false);
      };
      loadRegions();
    }
  }, [address, regions.length, loadingRegions]);

  // --- Cascading useEffects for data fetching and resetting ---
  useEffect(() => {
    const loadProvinces = async () => {
      if (selectedRegionCode) {
        setLoadingProvinces(true);
        const fetchedProvinces = await fetchProvinces(selectedRegionCode);
        setProvinces(fetchedProvinces);
        setLoadingProvinces(false);
      } else {
        setProvinces([]);
      }
      const currentRegionNameInState = regions.find(r => r.code === selectedRegionCode)?.name;
      if (address?.region !== currentRegionNameInState) {
         setSelectedProvinceCode("");
         setSelectedCityCode("");
         setSelectedBarangayCode("");
      }
    };
    loadProvinces();
  }, [selectedRegionCode, address, regions]);

  useEffect(() => {
    const loadCities = async () => {
      if (selectedProvinceCode) {
        setLoadingCities(true);
        const fetchedCities = await fetchCitiesMunicipalities(selectedProvinceCode);
        setCities(fetchedCities);
        setLoadingCities(false);
      } else {
        setCities([]);
      }
      const currentProvinceNameInState = provinces.find(p => p.code === selectedProvinceCode)?.name;
      if (address?.province !== currentProvinceNameInState) {
        setSelectedCityCode("");
        setSelectedBarangayCode("");
      }
    };
    loadCities();
  }, [selectedProvinceCode, address, provinces]);

  useEffect(() => {
    const loadBarangays = async () => {
      if (selectedCityCode) {
        setLoadingBarangays(true);
        const fetchedBarangays = await fetchBarangays(selectedCityCode);
        setBarangays(fetchedBarangays);
        setLoadingBarangays(false);
      } else {
        setBarangays([]);
      }
      const currentCityNameInState = cities.find(c => c.code === selectedCityCode)?.name;
      if (address?.city !== currentCityNameInState) {
        setSelectedBarangayCode("");
      }
    };
    loadBarangays();
  }, [selectedCityCode, address, cities]);


  // --- Map Geocoding Effect ---
  useEffect(() => {
    const getMapLocation = async () => {
      const regionName = regions.find(r => r.code === selectedRegionCode)?.name;
      const provinceName = provinces.find(p => p.code === selectedProvinceCode)?.name;
      const cityName = cities.find(c => c.code === selectedCityCode)?.name;
      const barangayName = barangays.find(b => b.code === selectedBarangayCode)?.name;

      if (barangayName && cityName && provinceName && regionName) {
        setMapLoading(true);
        // Construct the query string from the most specific to general
        const addressQuery = `${barangayName}, ${cityName}, ${provinceName}, ${regionName}, Philippines`;
        const result = await geocodeAddress(addressQuery);
        setMapCoordinates(result);
        setMapLoading(false);
      } else {
        setMapCoordinates(null); // Clear map if address is incomplete
      }
    };
    getMapLocation();
  }, [selectedRegionCode, selectedProvinceCode, selectedCityCode, selectedBarangayCode, regions, provinces, cities, barangays]);


  // --- Handlers for Submit ---
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingLoading(true);

    const method = address ? "PUT" : "POST";
    const url = "/api/v1/customer/addresses";

    const regionName = regions.find(r => r.code === selectedRegionCode)?.name;
    const provinceName = provinces.find(p => p.code === selectedProvinceCode)?.name;
    const cityName = cities.find(c => c.code === selectedCityCode)?.name;
    const barangayName = barangays.find(b => b.code === selectedBarangayCode)?.name;

    if (!fullName || contactNumber === undefined || contactNumber === "" || !homeAddress ||
        !regionName || !provinceName || !cityName || !barangayName || !zipCode) {
      toast.error("Please fill in all required address fields.");
      setIsSavingLoading(false);
      return;
    }

    const payload = {
      id: address?.id,
      fullName,
      contactNumber: contactNumber,
      homeAddress,
      barangay: barangayName,
      city: cityName,
      province: provinceName,
      region: regionName,
      zipCode,
      type,
      isDefault,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save address.");
      }

      const result = await response.json();
      toast.success(result.message || "Address saved successfully!");
      onSuccess();
    } catch (err: any) {
      console.error("Error saving address:", err);
      toast.error(err.message || "An error occurred.");
    } finally {
      setIsSavingLoading(false);
    }
  }, [address, fullName, contactNumber, homeAddress, selectedBarangayCode, selectedCityCode, selectedProvinceCode, selectedRegionCode, zipCode, type, isDefault, onSuccess, regions, provinces, cities, barangays]);


  const isSubmitDisabled = !fullName || contactNumber === undefined || contactNumber === "" || !homeAddress ||
                           !selectedRegionCode || !selectedProvinceCode || !selectedCityCode || !selectedBarangayCode || !zipCode || isSavingLoading;


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          id="fullName"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <PhoneInput
          id="contactNumber"
          placeholder="Phone Number"
          value={contactNumber}
          onChange={setContactNumber}
          defaultCountry="PH"
          international
          countryCallingCodeEditable={false}
          limitMaxLength={true}
          required
        />
      </div>

      {/* Region, Province, City, Barangay Select (Cascading) */}
      <Popover open={isLocationSelectOpen} onOpenChange={setIsLocationSelectOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            {selectedRegionCode || selectedProvinceCode || selectedCityCode || selectedBarangayCode
              ? `${regions.find(r => r.code === selectedRegionCode)?.name || ''}${selectedProvinceCode ? `, ${provinces.find(p => p.code === selectedProvinceCode)?.name}` : ''}${selectedCityCode ? `, ${cities.find(c => c.code === selectedCityCode)?.name}` : ''}${selectedBarangayCode ? `, ${barangays.find(b => b.code === selectedBarangayCode)?.name}` : ''}`
              : "Region, Province, City, Barangay"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[460px] p-0">
          <Tabs value={activeTab} onValueChange={(value) => {
            setActiveTab(value as any);
            if (regionSearchRef.current) regionSearchRef.current.value = '';
            if (provinceSearchRef.current) provinceSearchRef.current.value = '';
            if (citySearchRef.current) citySearchRef.current.value = '';
            if (barangaySearchRef.current) barangaySearchRef.current.value = '';
          }} className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-none border-b-2">
              <TabsTrigger className='rounded-none bg-transparent' value="region" disabled={loadingRegions}>Region</TabsTrigger>
              <TabsTrigger className='rounded-none bg-transparent' value="province" disabled={!selectedRegionCode || loadingProvinces}>Province</TabsTrigger>
              <TabsTrigger className='rounded-none bg-transparent' value="city" disabled={!selectedProvinceCode || loadingCities}>City</TabsTrigger>
              <TabsTrigger className='rounded-none bg-transparent' value="barangay" disabled={!selectedCityCode || loadingBarangays}>Barangay</TabsTrigger>
            </TabsList>

            <TabsContent value="region">
              <Command>
                <CommandInput placeholder="Search region..." ref={regionSearchRef} />
                <CommandList>
                  <ScrollArea className="h-48 overflow-y-auto">
                    {loadingRegions ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">Loading regions...</div>
                    ) : (
                      <CommandGroup>
                        {regions.map((region) => (
                          <CommandItem
                            key={region.code}
                            value={region.name}
                            onSelect={() => {
                              setSelectedRegionCode(region.code);
                              setSelectedProvinceCode("");
                              setSelectedCityCode("");
                              setSelectedBarangayCode("");
                              setActiveTab("province");
                              provinceSearchRef.current?.focus();
                            }}
                            className={cn(
                              "flex justify-between items-center",
                              selectedRegionCode === region.code && "bg-accent font-medium text-[#800020]"
                            )}
                          >
                            {region.name}
                            {selectedRegionCode === region.code && <CheckIcon className="h-4 w-4" />}
                          </CommandItem>
                        ))}
                        {regions.length === 0 && <CommandEmpty>No region found.</CommandEmpty>}
                      </CommandGroup>
                    )}
                  </ScrollArea>
                </CommandList>
              </Command>
            </TabsContent>

            <TabsContent value="province">
              <Command>
                <CommandInput placeholder="Search province..." ref={provinceSearchRef} />
                <CommandList>
                  <ScrollArea className="h-48 overflow-y-auto">
                    {loadingProvinces ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">Loading provinces...</div>
                    ) : provinces.length === 0 && selectedRegionCode ? (
                      <CommandEmpty>No province found for this region.</CommandEmpty>
                    ) : provinces.length === 0 ? (
                      <CommandEmpty>Select a Region first.</CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {provinces.map((province) => (
                          <CommandItem
                            key={province.code}
                            value={province.name}
                            onSelect={() => {
                              setSelectedProvinceCode(province.code);
                              setSelectedCityCode("");
                              setSelectedBarangayCode("");
                              setActiveTab("city");
                              citySearchRef.current?.focus();
                            }}
                            className={cn(
                              "flex justify-between items-center",
                              selectedProvinceCode === province.code && "bg-accent font-medium text-[#800020]"
                            )}
                          >
                            {province.name}
                            {selectedProvinceCode === province.code && <CheckIcon className="h-4 w-4" />}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </ScrollArea>
                </CommandList>
              </Command>
            </TabsContent>

            <TabsContent value="city">
              <Command>
                <CommandInput placeholder="Search city/municipality..." ref={citySearchRef} />
                <CommandList>
                  <ScrollArea className="h-48 overflow-y-auto">
                    {loadingCities ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">Loading cities/municipalities...</div>
                    ) : cities.length === 0 && selectedProvinceCode ? (
                      <CommandEmpty>No city/municipality found for this province.</CommandEmpty>
                    ) : cities.length === 0 ? (
                      <CommandEmpty>Select a Province first.</CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {cities.map((city) => (
                          <CommandItem
                            key={city.code}
                            value={city.name}
                            onSelect={() => {
                              setSelectedCityCode(city.code);
                              setSelectedBarangayCode("");
                              setActiveTab("barangay");
                              barangaySearchRef.current?.focus();
                            }}
                            className={cn(
                              "flex justify-between items-center",
                              selectedCityCode === city.code && "bg-accent font-medium text-[#800020]"
                            )}
                          >
                            {city.name}
                            {selectedCityCode === city.code && <CheckIcon className="h-4 w-4" />}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </ScrollArea>
                </CommandList>
              </Command>
            </TabsContent>

            <TabsContent value="barangay">
              <Command>
                <CommandInput placeholder="Search barangay..." ref={barangaySearchRef} />
                <CommandList>
                  <ScrollArea className="h-48 overflow-y-auto">
                    {loadingBarangays ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">Loading barangays...</div>
                    ) : barangays.length === 0 && selectedCityCode ? (
                      <CommandEmpty>No barangay found for this city/municipality.</CommandEmpty>
                    ) : barangays.length === 0 ? (
                      <CommandEmpty>Select a City/Municipality first.</CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {barangays.map((barangay) => (
                          <CommandItem
                            key={barangay.code}
                            value={barangay.name}
                            onSelect={() => {
                              setSelectedBarangayCode(barangay.code);
                              setIsLocationSelectOpen(false); // Close popover after final selection
                            }}
                            className={cn(
                              "flex justify-between items-center",
                              selectedBarangayCode === barangay.code && "bg-accent font-medium text-[#800020]"
                            )}
                          >
                            {barangay.name}
                            {selectedBarangayCode === barangay.code && <CheckIcon className="h-4 w-4" />}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </ScrollArea>
                </CommandList>
              </Command>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>


      <Input
        id="zipCode"
        placeholder="Postal Code"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
        required
      />
      <Input
        id="homeAddress"
        placeholder="Street Name, Building, House No."
        value={homeAddress}
        onChange={(e) => setHomeAddress(e.target.value)}
        required
      />

      <div className="bg-gray-100 h-48 flex items-center justify-center text-muted-foreground">
        {/* Map embedding will go here */}
        {mapLoading ? (
          <Loader2 className="animate-spin h-8 w-8 text-[#800020]" />
        ) : mapCoordinates ? (
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(mapCoordinates.lon) - 0.005},${parseFloat(mapCoordinates.lat) - 0.005},${parseFloat(mapCoordinates.lon) + 0.005},${parseFloat(mapCoordinates.lat) + 0.005}&amp;layer=mapnik&amp;marker=${mapCoordinates.lat},${mapCoordinates.lon}`}
            style={{ border: '1px solid black' }}
            title="Selected Location Map"
          ></iframe>
        ) : (
          <span className="text-center">Select a complete address to see the map.</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label className="mt-2">Label As:</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={type === "Home" ? "default" : "outline"}
            className={type === "Home" ? "bg-[#800020] hover:bg-[#a00030] text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}
            onClick={() => setType("Home")}
          >
            Home
          </Button>
          <Button
            type="button"
            variant={type === "Work" ? "default" : "outline"}
            className={type === "Work" ? "bg-[#800020] hover:bg-[#a00030] text-white" : "border-gray-300 text-gray-700 hover:bg-gray-100"}
            onClick={() => setType("Work")}
          >
            Work
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-2">
        <Checkbox id="isDefault" checked={isDefault} onCheckedChange={(checked) => setIsDefault(checked as boolean)} />
        <Label htmlFor="isDefault">Set as default address</Label>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSavingLoading}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#800020] hover:bg-[#a00030]" disabled={isSavingLoading || isSubmitDisabled}>
          {isSavingLoading && <Loader2 className="animate-spin mr-2" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;
