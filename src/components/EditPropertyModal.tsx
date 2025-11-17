
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Save, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";

// CONFIG
const BASE_IMAGE_URL = "http://localhost:5050";
const MAX_IMAGES = 20;

interface Property {
  id?: string;
  title: string;
  price: number;
  type: string;
  size: string;
  primary_purpose: string;
  location: string;
  latitude: number;
  longitude: number;
  description: string;
  private: boolean;
  investment_gain?: number;
  return_of_investment?: number;
  water_connectivity?: boolean;
  electricity_connectivity?: boolean;
  gas_connectivity?: boolean;
  market_risk?: boolean;
  regulatory_risk?: boolean;
  financial_risk?: boolean;
  liquidity_risk?: boolean;
  physical_risk?: boolean;
  risk_percentage?: number;
  features: string[] | null;
  images: string[] | null;
  createdAt?: string;
  updatedAt?: string;
  taluka?: string;
  district?: string;
  nearest_town?: string;
  nearest_road?: string;
  distance_to_nearest_road?: number;
  nearest_school_colleges?: string;
  zoning_status?: string;
  na_permit?: boolean;
  upcoming_infra?: string;
  ownership_type?: string;
  rera_restration?: string;
  town_planning_permit?: string;
  jantri_rate?: number;
}

interface EditPropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    formData: Property & {
      images: File[] | string[] | null;
      existingImages?: string[] | null;
      deletedImages?: string[] | null;
    }
  ) => Promise<void>;
}

export default function EditPropertyModal({
  property,
  isOpen,
  onClose,
  onSave,
}: EditPropertyModalProps) {
  // STATE
  const [formData, setFormData] = useState<Property>({
    title: "",
    price: 0,
    type: "Agricultural",
    size: "",
    primary_purpose: "Personal Use",
    location: "",
    latitude: 0,
    longitude: 0,
    description: "",
    private: false,
    investment_gain: undefined,
    return_of_investment: undefined,
    water_connectivity: false,
    electricity_connectivity: false,
    gas_connectivity: false,
    market_risk: false,
    regulatory_risk: false,
    financial_risk: false,
    liquidity_risk: false,
    physical_risk: false,
    risk_percentage: undefined,
    features: [],
    images: [],
    taluka: "",
    district: "",
    nearest_town: "",
    nearest_road: "",
    distance_to_nearest_road: undefined,
    nearest_school_colleges: "",
    zoning_status: "",
    na_permit: false,
    upcoming_infra: "",
    ownership_type: "",
    rera_restration: "",
    town_planning_permit: "",
    jantri_rate: undefined,
  });

  const [displayPrice, setDisplayPrice] = useState("");
  const [featuresInput, setFeaturesInput] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // HELPERS
  const formatPrice = (v: number) =>
    v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const parsePrice = (v: string) => Number(v.replace(/,/g, ""));

  const getImageUrl = (path: string) => {
    if (!path) return "https://via.placeholder.com/150?text=No+Image";
    return path.startsWith("http") ? path : `${BASE_IMAGE_URL}/${path}`;
  };

  const totalImageCount = existingImages.length + newImages.length;

  // Get file names from input
  const getSelectedFileNames = () => {
    if (!fileInputRef.current?.files) return "";
    return Array.from(fileInputRef.current.files)
      .map((f) => f.name)
      .join(", ");
  };

  // EFFECTS
  useEffect(() => {
    if (property && isOpen) {
      setFormData({
        ...property,
        features: property.features || [],
        images: property.images || [],
        taluka: property.taluka || "",
        district: property.district || "",
        nearest_town: property.nearest_town || "",
        nearest_road: property.nearest_road || "",
        distance_to_nearest_road: property.distance_to_nearest_road || undefined,
        nearest_school_colleges: property.nearest_school_colleges || "",
        zoning_status: property.zoning_status || "",
        na_permit: property.na_permit || false,
        upcoming_infra: property.upcoming_infra || "",
        ownership_type: property.ownership_type || "",
        rera_restration: property.rera_restration || "",
        town_planning_permit: property.town_planning_permit || "",
        jantri_rate: property.jantri_rate || undefined,
      });
      setDisplayPrice(formatPrice(property.price || 0));
      setFeaturesInput((property.features || []).join(", "));
      setExistingImages(property.images || []);
      setDeletedImages([]);
      setNewImages([]);
      setError("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else if (!isOpen) {
      resetForm();
    }
  }, [property, isOpen]);

  const resetForm = () => {
    setFormData({
      title: "",
      price: 0,
      type: "Agricultural",
      size: "",
      primary_purpose: "Personal Use",
      location: "",
      latitude: 0,
      longitude: 0,
      description: "",
      private: false,
      investment_gain: undefined,
      return_of_investment: undefined,
      water_connectivity: false,
      electricity_connectivity: false,
      gas_connectivity: false,
      market_risk: false,
      regulatory_risk: false,
      financial_risk: false,
      liquidity_risk: false,
      physical_risk: false,
      risk_percentage: undefined,
      features: [],
      images: [],
      taluka: "",
      district: "",
      nearest_town: "",
      nearest_road: "",
      distance_to_nearest_road: undefined,
      nearest_school_colleges: "",
      zoning_status: "",
      na_permit: false,
      upcoming_infra: "",
      ownership_type: "",
      rera_restration: "",
      town_planning_permit: "",
      jantri_rate: undefined,
    });
    setDisplayPrice("");
    setFeaturesInput("");
    setExistingImages([]);
    setDeletedImages([]);
    setNewImages([]);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // IMAGE HANDLERS
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    const totalAfter = totalImageCount + newFiles.length;

    if (totalAfter > MAX_IMAGES) {
      const allowed = MAX_IMAGES - totalImageCount;
      toast.error(
        `You can only add ${allowed} more image(s). Max ${MAX_IMAGES} allowed.`
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setNewImages((prev) => [...prev, ...newFiles]);
    toast.success(`${newFiles.length} image(s) added. Total: ${totalAfter}`);
  };

  const removeExistingImage = (img: string) => {
    setExistingImages((prev) => prev.filter((i) => i !== img));
    setDeletedImages((prev) => [...prev, img]);
    if (newImages.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeNewImage = (idx: number) => {
    const removedFile = newImages[idx];
    setNewImages((prev) => prev.filter((_, i) => i !== idx));

    const dt = new DataTransfer();
    newImages
      .filter((_, i) => i !== idx)
      .forEach((f) => dt.items.add(f));
    if (fileInputRef.current) {
      fileInputRef.current.files = dt.files;
    }

    if (dt.files.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // SAVE
  const handleSave = async () => {
    if (
      !formData.title ||
      !displayPrice ||
      !formData.size ||
      !formData.primary_purpose ||
      !formData.location ||
      !formData.latitude ||
      !formData.longitude
    ) {
      setError("Please fill in all required fields.");
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSaving(true);
    try {
      const featuresArray = featuresInput
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f);

      await onSave({
        ...formData,
        price: parsePrice(displayPrice || "0"),
        features: featuresArray,
        images: newImages.length > 0 ? newImages : existingImages,
        existingImages: existingImages.length ? existingImages : null,
        deletedImages: deletedImages.length ? deletedImages : null,
      });

      toast.success(
        property ? "Property updated successfully" : "Property added successfully"
      );
      onClose();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Failed to save property. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const removeFeature = (idx: number) => {
    const updated = formData.features?.filter((_, i) => i !== idx) || [];
    setFormData((prev) => ({ ...prev, features: updated }));
    setFeaturesInput(updated.join(", "));
  };

  // RENDER
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        aria-describedby="edit-property-description"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {property ? "Edit Property" : "Add New Property"}
          </DialogTitle>
        </DialogHeader>
        <p id="edit-property-description" className="sr-only">
          Form to edit or add property details.
        </p>

        <div className="space-y-6">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* BASIC INFO */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, title: e.target.value }))
                    }
                    placeholder="Enter property title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="text"
                    value={displayPrice}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9,]/g, "");
                      setDisplayPrice(v);
                      setFormData((p) => ({
                        ...p,
                        price: parsePrice(v || "0"),
                      }));
                    }}
                    placeholder="e.g. 30,000"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="type">Property Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) =>
                      setFormData((p) => ({ ...p, type: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Agricultural">Agricultural</SelectItem>
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Farmhouse">Farmhouse</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="size">Size *</Label>
                  <Input
                    id="size"
                    value={formData.size}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, size: e.target.value }))
                    }
                    placeholder="e.g. 5 acres"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="primary_purpose">Primary Purpose *</Label>
                  <Select
                    value={formData.primary_purpose}
                    onValueChange={(v) =>
                      setFormData((p) => ({
                        ...p,
                        primary_purpose: v,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Personal Use">Personal Use</SelectItem>
                      <SelectItem value="Investment">Investment</SelectItem>
                      <SelectItem value="Commercial Development">
                        Commercial Development
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        location: e.target.value,
                      }))
                    }
                    placeholder="Enter location"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="latitude">Latitude *</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        latitude: Number(e.target.value),
                      }))
                    }
                    placeholder="e.g. 26.9124"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude *</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        longitude: Number(e.target.value),
                      }))
                    }
                    placeholder="e.g. 75.7873"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe the property"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="private"
                  checked={formData.private}
                  onCheckedChange={(c) =>
                    setFormData((p) => ({ ...p, private: c }))
                  }
                />
                <Label htmlFor="private">Private Property</Label>
              </div>

              <div>
                <Label htmlFor="investment_gain">Investment Gain (₹)</Label>
                <Input
                  id="investment_gain"
                  type="text"
                  value={
                    formData.investment_gain
                      ? formatPrice(formData.investment_gain)
                      : ""
                  }
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9]/g, "");
                    setFormData((p) => ({
                      ...p,
                      investment_gain: v ? Number(v) : undefined,
                    }));
                  }}
                  placeholder="e.g. 15000"
                />
              </div>

              <div>
                <Label htmlFor="return_of_investment">Return on Investment (%)</Label>
                <Input
                  id="return_of_investment"
                  type="number"
                  value={formData.return_of_investment || ""}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      return_of_investment: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                  placeholder="e.g. 15"
                />
              </div>
            </CardContent>
          </Card>

          {/* LOCATION DETAILS */}
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taluka">Taluka</Label>
                  <Input
                    id="taluka"
                    value={formData.taluka}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, taluka: e.target.value }))
                    }
                    placeholder="e.g. Phagi"
                  />
                </div>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, district: e.target.value }))
                    }
                    placeholder="e.g. Jaipur"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nearest_town">Nearest Town</Label>
                  <Input
                    id="nearest_town"
                    value={formData.nearest_town}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, nearest_town: e.target.value }))
                    }
                    placeholder="e.g. Dudu"
                  />
                </div>
                <div>
                  <Label htmlFor="nearest_road">Nearest Road</Label>
                  <Input
                    id="nearest_road"
                    value={formData.nearest_road}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, nearest_road: e.target.value }))
                    }
                    placeholder="e.g. NH-48"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="distance_to_nearest_road">
                    Distance to Nearest Road (km)
                  </Label>
                  <Input
                    id="distance_to_nearest_road"
                    type="number"
                    value={formData.distance_to_nearest_road || ""}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        distance_to_nearest_road: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      }))
                    }
                    placeholder="e.g. 2.5"
                  />
                </div>
                <div>
                  <Label htmlFor="nearest_school_colleges">
                    Nearest Schools/Colleges (comma-separated)
                  </Label>
                  <Input
                    id="nearest_school_colleges"
                    value={formData.nearest_school_colleges}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        nearest_school_colleges: e.target.value,
                      }))
                    }
                    placeholder="e.g. St. Xavier School, Govt. Arts College"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PROPERTY DETAILS */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zoning_status">Zoning Status</Label>
                  <Input
                    id="zoning_status"
                    value={formData.zoning_status}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, zoning_status: e.target.value }))
                    }
                    placeholder="e.g. Agricultural Zone"
                  />
                </div>
                <div>
                  <Label htmlFor="ownership_type">Ownership Type</Label>
                  <Input
                    id="ownership_type"
                    value={formData.ownership_type}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        ownership_type: e.target.value,
                      }))
                    }
                    placeholder="e.g. Freehold"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rera_restration">RERA Registration</Label>
                  <Input
                    id="rera_restration"
                    value={formData.rera_restration}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        rera_restration: e.target.value,
                      }))
                    }
                    placeholder="e.g. RAJ-2025-12345"
                  />
                </div>
                <div>
                  <Label htmlFor="town_planning_permit">
                    Town Planning Permit
                  </Label>
                  <Input
                    id="town_planning_permit"
                    value={formData.town_planning_permit}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        town_planning_permit: e.target.value,
                      }))
                    }
                    placeholder="e.g. Approved"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="upcoming_infra">
                    Upcoming Infrastructure (comma-separated)
                  </Label>
                  <Input
                    id="upcoming_infra"
                    value={formData.upcoming_infra}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        upcoming_infra: e.target.value,
                      }))
                    }
                    placeholder="e.g. Ring Road Extension, New Industrial Hub"
                  />
                </div>
                <div>
                  <Label htmlFor="jantri_rate">Jantri Rate</Label>
                  <Input
                    id="jantri_rate"
                    type="number"
                    value={formData.jantri_rate || ""}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        jantri_rate: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      }))
                    }
                    placeholder="e.g. 550"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="na_permit"
                  checked={formData.na_permit}
                  onCheckedChange={(c) =>
                    setFormData((p) => ({ ...p, na_permit: c }))
                  }
                />
                <Label htmlFor="na_permit">NA Permit</Label>
              </div>
            </CardContent>
          </Card>

          {/* CONNECTIVITY & RISKS */}
          <Card>
            <CardHeader>
              <CardTitle>Connectivity and Risk Factors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                {["water", "electricity", "gas"].map((key) => (
                  <div key={key}>
                    <Label htmlFor={`${key}_connectivity`}>
                      {key.charAt(0).toUpperCase() + key.slice(1)} Connectivity
                    </Label>
                    <Select
                      value={
                        formData[`${key}_connectivity` as keyof Property]
                          ? "Yes"
                          : "No"
                      }
                      onValueChange={(v) =>
                        setFormData((p) => ({
                          ...p,
                          [`${key}_connectivity`]: v === "Yes",
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { key: "market", label: "Market Risk" },
                  { key: "regulatory", label: "Regulatory Risk" },
                  { key: "financial", label: "Financial Risk" },
                ].map((item) => (
                  <div key={item.key}>
                    <Label htmlFor={item.key + "_risk"}>{item.label}</Label>
                    <Select
                      value={
                        formData[`${item.key}_risk` as keyof Property]
                          ? "Yes"
                          : "No"
                      }
                      onValueChange={(v) =>
                        setFormData((p) => ({
                          ...p,
                          [`${item.key}_risk`]: v === "Yes",
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { key: "liquidity", label: "Liquidity Risk" },
                  { key: "physical", label: "Physical Risk" },
                ].map((item) => (
                  <div key={item.key}>
                    <Label htmlFor={item.key + "_risk"}>{item.label}</Label>
                    <Select
                      value={
                        formData[`${item.key}_risk` as keyof Property]
                          ? "Yes"
                          : "No"
                      }
                      onValueChange={(v) =>
                        setFormData((p) => ({
                          ...p,
                          [`${item.key}_risk`]: v === "Yes",
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <div>
                <Label htmlFor="risk_percentage">Risk Percentage (%)</Label>
                <Input
                  id="risk_percentage"
                  type="number"
                  value={formData.risk_percentage || ""}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      risk_percentage: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                  placeholder="e.g. 50"
                />
              </div>
            </CardContent>
          </Card>

          {/* IMAGES */}
          <Card>
            <CardHeader>
              <CardTitle>Property Images</CardTitle>
              <p className="text-sm text-muted-foreground">
                {totalImageCount} / {MAX_IMAGES} images
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="images">Upload Images</Label>
                <div className="flex items-center gap-2">
                  <Input
                    ref={fileInputRef}
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={totalImageCount >= MAX_IMAGES}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap max-w-xs truncate">
                    {getSelectedFileNames() || "No file chosen"}
                  </span>
                </div>
              </div>

              {totalImageCount >= MAX_IMAGES && (
                <p className="text-xs text-destructive">
                  Maximum {MAX_IMAGES} images reached.
                </p>
              )}

              <div className="grid md:grid-cols-3 gap-4">
                {existingImages.map((img, i) => (
                  <div
                    key={`exist-${i}`}
                    className="relative group rounded-lg overflow-hidden"
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`Existing ${i + 1}`}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/150?text=Not+Found";
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeExistingImage(img)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                {newImages.map((file, i) => (
                  <div
                    key={`new-${i}`}
                    className="relative group rounded-lg overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New ${i + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeNewImage(i)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FEATURES */}
          <Card>
            <CardHeader>
              <CardTitle>Property Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={featuresInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setFeaturesInput(val);
                  const arr = val
                    .split(",")
                    .map((f) => f.trim())
                    .filter((f) => f);
                  setFormData((p) => ({ ...p, features: arr }));
                }}
                placeholder="e.g. Well, Canal, Fenced"
              />
              <div className="flex flex-wrap gap-2">
                {formData.features?.map((f, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeFeature(i)}
                  >
                    {f} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ACTIONS */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleSave}
              className="flex-1"
              size="lg"
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Property"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="flex-1"
              size="lg"
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}