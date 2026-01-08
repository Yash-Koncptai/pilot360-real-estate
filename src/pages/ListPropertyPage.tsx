import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Save, X } from "lucide-react";
import { toast } from "sonner";
import api from "@/utils/api";

// CONFIG
const BASE_IMAGE_URL = "https://staging.chokhizameen.com";
const MAX_IMAGES = 20;

interface Property {
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
  water_connectivity?: boolean;
  electricity_connectivity?: boolean;
  gas_connectivity?: boolean;
  market_risk?: boolean;
  regulatory_risk?: boolean;
  financial_risk?: boolean;
  liquidity_risk?: boolean;
  physical_risk?: boolean;
  features: string[] | null;
  images: File[] | string[] | null;
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

const ListPropertyPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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
    water_connectivity: false,
    electricity_connectivity: false,
    gas_connectivity: false,
    market_risk: false,
    regulatory_risk: false,
    financial_risk: false,
    liquidity_risk: false,
    physical_risk: false,
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
  const [newImages, setNewImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // HELPERS
  const formatPrice = (v: number) => v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const parsePrice = (v: string) => Number(v.replace(/,/g, ""));
  const getImageUrl = (path: string) => {
    if (!path) return "https://via.placeholder.com/150?text=No+Image";
    return path.startsWith("http") ? path : `${BASE_IMAGE_URL}/${path}`;
  };
  const totalImageCount = newImages.length;
  const getSelectedFileNames = () => {
    if (!fileInputRef.current?.files) return "";
    return Array.from(fileInputRef.current.files)
      .map((f) => f.name)
      .join(", ");
  };

  // HANDLERS
  const handleInputChange = (field: keyof Property, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    const totalAfter = totalImageCount + newFiles.length;

    if (totalAfter > MAX_IMAGES) {
      const allowed = MAX_IMAGES - totalImageCount;
      toast.error(`You can only add ${allowed} more image(s). Max ${MAX_IMAGES} allowed.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setNewImages((prev) => [...prev, ...newFiles]);
    toast.success(`${newFiles.length} image(s) added. Total: ${totalAfter}`);
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

  const removeFeature = (idx: number) => {
    const updated = formData.features?.filter((_, i) => i !== idx) || [];
    setFormData((prev) => ({ ...prev, features: updated }));
    setFeaturesInput(updated.join(", "));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    const priceNum = parsePrice(displayPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Price must be a valid number greater than 0.");
      toast.error("Price must be a valid number greater than 0.");
      return;
    }

    if (formData.latitude < -90 || formData.latitude > 90) {
      setError("Latitude must be a valid number between -90 and 90.");
      toast.error("Latitude must be a valid number between -90 and 90.");
      return;
    }

    if (formData.longitude < -180 || formData.longitude > 180) {
      setError("Longitude must be a valid number between -180 and 180.");
      toast.error("Longitude must be a valid number between -180 and 180.");
      return;
    }

    if (formData.investment_gain && (isNaN(formData.investment_gain) || formData.investment_gain < 0)) {
      setError("Investment gain must be a valid number greater than or equal to 0.");
      toast.error("Investment gain must be a valid number greater than or equal to 0.");
      return;
    }

    if (formData.jantri_rate && (isNaN(formData.jantri_rate) || formData.jantri_rate < 0)) {
      setError("Jantri rate must be a valid number greater than or equal to 0.");
      toast.error("Jantri rate must be a valid number greater than or equal to 0.");
      return;
    }

    if (formData.distance_to_nearest_road && (isNaN(formData.distance_to_nearest_road) || formData.distance_to_nearest_road < 0)) {
      setError("Distance to nearest road must be a valid number greater than or equal to 0.");
      toast.error("Distance to nearest road must be a valid number greater than or equal to 0.");
      return;
    }

    const reraRegex = /^[A-Z]{3}\/[A-Z]\/\d{4}\/\d+$/;
    if (formData.rera_restration && !reraRegex.test(formData.rera_restration)) {
      setError("Invalid RERA registration number format (e.g., RAJ/P/2023/00123).");
      toast.error("Invalid RERA registration number format (e.g., RAJ/P/2023/00123).");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("userToken");
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", String(priceNum));
      data.append("location", formData.location);
      data.append("type", formData.type);
      data.append("size", formData.size);
      data.append("primary_purpose", formData.primary_purpose);
      data.append("latitude", String(formData.latitude));
      data.append("longitude", String(formData.longitude));
      data.append("privacy", String(formData.private));
      data.append("features", formData.features?.join(",") || "");
      data.append("water_connectivity", String(formData.water_connectivity));
      data.append("electricity_connectivity", String(formData.electricity_connectivity));
      data.append("gas_connectivity", String(formData.gas_connectivity));
      if (formData.investment_gain) data.append("investment_gain", String(formData.investment_gain));
      data.append("market_risk", String(formData.market_risk));
      data.append("regulatory_risk", String(formData.regulatory_risk));
      data.append("financial_risk", String(formData.financial_risk));
      data.append("liquidity_risk", String(formData.liquidity_risk));
      data.append("physical_risk", String(formData.physical_risk));
      data.append("taluka", formData.taluka || "");
      data.append("district", formData.district || "");
      data.append("nearest_town", formData.nearest_town || "");
      data.append("nearest_road", formData.nearest_road || "");
      if (formData.distance_to_nearest_road) data.append("distance_to_nearest_road", String(formData.distance_to_nearest_road));
      data.append("nearest_school_colleges", formData.nearest_school_colleges || "");
      data.append("zoning_status", formData.zoning_status || "");
      data.append("na_permit", String(formData.na_permit));
      data.append("upcoming_infra", formData.upcoming_infra || "");
      data.append("ownership_type", formData.ownership_type || "");
      data.append("rera_restration", formData.rera_restration || "");
      data.append("town_planning_permit", formData.town_planning_permit || "");
      if (formData.jantri_rate) data.append("jantri_rate", String(formData.jantri_rate));
      data.append("existingimages", "");
      data.append("deletedimages", "");
      newImages.forEach((image) => data.append("images", image));

      const response = await api.post("/api/user/property/add", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success(`Property submitted! Estimated ROI: ${response.data.property.return_of_investment}%`);
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
          water_connectivity: false,
          electricity_connectivity: false,
          gas_connectivity: false,
          market_risk: false,
          regulatory_risk: false,
          financial_risk: false,
          liquidity_risk: false,
          physical_risk: false,
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
        setNewImages([]);
        setError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        navigate("/listings");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to list property.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-2xl font-bold mb-6">List Your Property</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
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
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter property title"
                  disabled={isLoading}
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
                    handleInputChange("price", parsePrice(v || "0"));
                  }}
                  placeholder="e.g. 30,000"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="type">Property Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => handleInputChange("type", v)}
                  disabled={isLoading}
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
                  onChange={(e) => handleInputChange("size", e.target.value)}
                  placeholder="e.g. 5 acres"
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <Label htmlFor="primary_purpose">Primary Purpose *</Label>
                <Select
                  value={formData.primary_purpose}
                  onValueChange={(v) => handleInputChange("primary_purpose", v)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Personal Use">Personal Use</SelectItem>
                    <SelectItem value="Investment">Investment</SelectItem>
                    <SelectItem value="Commercial Development">Commercial Development</SelectItem>
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
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Enter location"
                  disabled={isLoading}
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
                  onChange={(e) => handleInputChange("latitude", Number(e.target.value))}
                  placeholder="e.g. 26.9124"
                  disabled={isLoading}
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
                  onChange={(e) => handleInputChange("longitude", Number(e.target.value))}
                  placeholder="e.g. 75.7873"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe the property"
                disabled={isLoading}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="private"
                checked={formData.private}
                onCheckedChange={(c) => handleInputChange("private", c)}
                disabled={isLoading}
              />
              <Label htmlFor="private">Private Property</Label>
            </div>

            <div>
              <Label htmlFor="investment_gain">Investment Gain (₹)</Label>
              <Input
                id="investment_gain"
                type="text"
                value={formData.investment_gain ? formatPrice(formData.investment_gain) : ""}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9]/g, "");
                  handleInputChange("investment_gain", v ? Number(v) : undefined);
                }}
                placeholder="e.g. 15000"
                disabled={isLoading}
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
                  onChange={(e) => handleInputChange("taluka", e.target.value)}
                  placeholder="e.g. Phagi"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => handleInputChange("district", e.target.value)}
                  placeholder="e.g. Jaipur"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nearest_town">Nearest Town</Label>
                <Input
                  id="nearest_town"
                  value={formData.nearest_town}
                  onChange={(e) => handleInputChange("nearest_town", e.target.value)}
                  placeholder="e.g. Dudu"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="nearest_road">Nearest Road</Label>
                <Input
                  id="nearest_road"
                  value={formData.nearest_road}
                  onChange={(e) => handleInputChange("nearest_road", e.target.value)}
                  placeholder="e.g. NH-48"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="distance_to_nearest_road">Distance to Nearest Road (km)</Label>
                <Input
                  id="distance_to_nearest_road"
                  type="number"
                  value={formData.distance_to_nearest_road || ""}
                  onChange={(e) =>
                    handleInputChange("distance_to_nearest_road", e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="e.g. 2.5"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="nearest_school_colleges">Nearest Schools/Colleges (comma-separated)</Label>
                <Input
                  id="nearest_school_colleges"
                  value={formData.nearest_school_colleges}
                  onChange={(e) => handleInputChange("nearest_school_colleges", e.target.value)}
                  placeholder="e.g. St. Xavier School, Govt. Arts College"
                  disabled={isLoading}
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
                  onChange={(e) => handleInputChange("zoning_status", e.target.value)}
                  placeholder="e.g. Agricultural Zone"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="ownership_type">Ownership Type</Label>
                <Input
                  id="ownership_type"
                  value={formData.ownership_type}
                  onChange={(e) => handleInputChange("ownership_type", e.target.value)}
                  placeholder="e.g. Freehold"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rera_restration">RERA Registration</Label>
                <Input
                  id="rera_restration"
                  value={formData.rera_restration}
                  onChange={(e) => handleInputChange("rera_restration", e.target.value)}
                  placeholder="e.g. RAJ-2025-12345"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="town_planning_permit">Town Planning Permit</Label>
                <Input
                  id="town_planning_permit"
                  value={formData.town_planning_permit}
                  onChange={(e) => handleInputChange("town_planning_permit", e.target.value)}
                  placeholder="e.g. Approved"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="upcoming_infra">Upcoming Infrastructure (comma-separated)</Label>
                <Input
                  id="upcoming_infra"
                  value={formData.upcoming_infra}
                  onChange={(e) => handleInputChange("upcoming_infra", e.target.value)}
                  placeholder="e.g. Ring Road Extension, New Industrial Hub"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="jantri_rate">Jantri Rate</Label>
                <Input
                  id="jantri_rate"
                  type="number"
                  value={formData.jantri_rate || ""}
                  onChange={(e) =>
                    handleInputChange("jantri_rate", e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="e.g. 550"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="na_permit"
                checked={formData.na_permit}
                onCheckedChange={(c) => handleInputChange("na_permit", c)}
                disabled={isLoading}
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
                    value={formData[`${key}_connectivity` as keyof Property] ? "Yes" : "No"}
                    onValueChange={(v) => handleInputChange(`${key}_connectivity`, v === "Yes")}
                    disabled={isLoading}
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
                  <Label htmlFor={`${item.key}_risk`}>{item.label}</Label>
                  <Select
                    value={formData[`${item.key}_risk` as keyof Property] ? "Yes" : "No"}
                    onValueChange={(v) => handleInputChange(`${item.key}_risk`, v === "Yes")}
                    disabled={isLoading}
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
                  <Label htmlFor={`${item.key}_risk`}>{item.label}</Label>
                  <Select
                    value={formData[`${item.key}_risk` as keyof Property] ? "Yes" : "No"}
                    onValueChange={(v) => handleInputChange(`${item.key}_risk`, v === "Yes")}
                    disabled={isLoading}
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
                  disabled={totalImageCount >= MAX_IMAGES || isLoading}
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
              {newImages.map((file, i) => (
                <div key={`new-${i}`} className="relative group rounded-lg overflow-hidden">
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
                    disabled={isLoading}
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
                handleInputChange("features", arr);
              }}
              placeholder="e.g. Well, Canal, Fenced"
              disabled={isLoading}
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
            type="submit"
            className="flex-1"
            size="lg"
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Submitting..." : "List Property"}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/listings")}
            className="flex-1"
            size="lg"
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ListPropertyPage;