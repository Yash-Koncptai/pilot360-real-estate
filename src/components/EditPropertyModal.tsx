
import { useState, useEffect } from "react";
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
  water_connectivity?: boolean;
  electricity_connectivity?: boolean;
  gas_connectivity?: boolean;
  market_risk?: boolean;
  regulatory_risk?: boolean;
  financial_risk?: boolean;
  liquidity_risk?: boolean;
  physical_risk?: boolean;
  features: string[] | null;
  images: string[] | null;
  views: number | null;
  createdAt: string;
  updatedAt: string;
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
  const [formData, setFormData] = useState<Property>({
    id: "",
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
    investment_gain: 0,
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
    views: null,
    createdAt: "",
    updatedAt: "",
  });

  const [displayPrice, setDisplayPrice] = useState("");
  const [featuresInput, setFeaturesInput] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  // Format number to comma-separated string
  const formatPrice = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Parse comma-separated string to number
  const parsePrice = (value: string) => {
    return Number(value.replace(/,/g, ""));
  };

  // Reinitialize formData when property or isOpen changes
  useEffect(() => {
    if (property && isOpen) {
      setFormData({
        id: property.id || "",
        title: property.title || "",
        price: property.price || 0,
        type: property.type || "Agricultural",
        size: property.size || "",
        primary_purpose: property.primary_purpose || "Personal Use",
        location: property.location || "",
        latitude: property.latitude || 0,
        longitude: property.longitude || 0,
        description: property.description || "",
        private: property.private || false,
        investment_gain: property.investment_gain || 0,
        water_connectivity: property.water_connectivity || false,
        electricity_connectivity: property.electricity_connectivity || false,
        gas_connectivity: property.gas_connectivity || false,
        market_risk: property.market_risk || false,
        regulatory_risk: property.regulatory_risk || false,
        financial_risk: property.financial_risk || false,
        liquidity_risk: property.liquidity_risk || false,
        physical_risk: property.physical_risk || false,
        features: property.features || [],
        images: property.images || [],
        views: property.views || null,
        createdAt: property.createdAt || "",
        updatedAt: property.updatedAt || "",
      });
      setDisplayPrice(formatPrice(property.price || 0));
      setFeaturesInput((property.features || []).join(", "));
      setExistingImages(property.images || []);
      setDeletedImages([]);
      setNewImages([]);
      setError("");
    } else if (!isOpen) {
      setFormData({
        id: "",
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
        investment_gain: 0,
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
        views: null,
        createdAt: "",
        updatedAt: "",
      });
      setDisplayPrice("");
      setFeaturesInput("");
      setExistingImages([]);
      setDeletedImages([]);
      setNewImages([]);
      setError("");
    }
  }, [property, isOpen]);

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
        images: newImages,
        existingImages: existingImages.length ? existingImages : null,
        deletedImages: deletedImages.length ? deletedImages : null,
      });
      toast.success(
        property
          ? "Property updated successfully"
          : "Property added successfully"
      );
      onClose();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to save property. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || [],
    }));
    setFeaturesInput(
      (formData.features?.filter((_, i) => i !== index) || []).join(", ")
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setNewImages((prev) => [...prev, ...newFiles]);
    }
  };

  const removeExistingImage = (image: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== image));
    setDeletedImages((prev) => [...prev, image]);
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

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
          Form to edit or add property details including title, price, type,
          size, primary purpose, location, coordinates, description, private
          status, investment gain, connectivity, risks, features, and images.
        </p>

        <div className="space-y-6">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Property Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Enter property title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="text"
                    value={displayPrice}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9,]/g, "");
                      setDisplayPrice(value);
                      setFormData((prev) => ({
                        ...prev,
                        price: parsePrice(value || "0"),
                      }));
                    }}
                    placeholder="Enter price in rupees (e.g., 30,000)"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="type">Property Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Agricultural">Agricultural</SelectItem>
                      <SelectItem value="Non-Agricultural">
                        Non-Agricultural
                      </SelectItem>
                      <SelectItem value="Farmhouse">Farmhouse</SelectItem>
                      <SelectItem value="Industrial">Industrial</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    value={formData.size}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, size: e.target.value }))
                    }
                    placeholder="e.g., 5 acres, 2400 sq ft"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="primary_purpose">Primary Purpose</Label>
                  <Select
                    value={formData.primary_purpose}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        primary_purpose: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Personal Use">Personal Use</SelectItem>
                      <SelectItem value="Investment">Investment</SelectItem>
                      <SelectItem value="Commercial Use">
                        Commercial Use
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    placeholder="Enter location"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        latitude: Number(e.target.value),
                      }))
                    }
                    placeholder="Enter latitude"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        longitude: Number(e.target.value),
                      }))
                    }
                    placeholder="Enter longitude"
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
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter property description"
                  rows={3}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="private"
                  checked={formData.private}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      private: checked,
                    }))
                  }
                />
                <Label htmlFor="private">Private Property</Label>
              </div>

              <div>
                <Label htmlFor="investment_gain">Investment Gain (%)</Label>
                <Input
                  id="investment_gain"
                  type="number"
                  step="0.1"
                  value={formData.investment_gain || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      investment_gain: Number(e.target.value),
                    }))
                  }
                  placeholder="Enter estimated investment gain percentage"
                />
              </div>
            </CardContent>
          </Card>

          {/* Connectivity and Risks */}
          <Card>
            <CardHeader>
              <CardTitle>Connectivity and Risk Factors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="water_connectivity">Water Connectivity</Label>
                  <Select
                    value={formData.water_connectivity ? "Yes" : "No"}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        water_connectivity: value === "Yes",
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
                <div>
                  <Label htmlFor="electricity_connectivity">
                    Electricity Connectivity
                  </Label>
                  <Select
                    value={formData.electricity_connectivity ? "Yes" : "No"}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        electricity_connectivity: value === "Yes",
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
                <div>
                  <Label htmlFor="gas_connectivity">Gas Connectivity</Label>
                  <Select
                    value={formData.gas_connectivity ? "Yes" : "No"}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        gas_connectivity: value === "Yes",
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
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="market_risk">
                    Market Risk (Price Volatility)
                  </Label>
                  <Select
                    value={formData.market_risk ? "Yes" : "No"}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        market_risk: value === "Yes",
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
                <div>
                  <Label htmlFor="regulatory_risk">
                    Regulatory Risk (Zoning/Permitting)
                  </Label>
                  <Select
                    value={formData.regulatory_risk ? "Yes" : "No"}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        regulatory_risk: value === "Yes",
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
                <div>
                  <Label htmlFor="financial_risk">
                    Financial Risk (Tax Burden)
                  </Label>
                  <Select
                    value={formData.financial_risk ? "Yes" : "No"}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        financial_risk: value === "Yes",
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
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="liquidity_risk">
                    Liquidity Risk (Selling Difficulty)
                  </Label>
                  <Select
                    value={formData.liquidity_risk ? "Yes" : "No"}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        liquidity_risk: value === "Yes",
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
                <div>
                  <Label htmlFor="physical_risk">
                    Physical Risk (Site Conditions)
                  </Label>
                  <Select
                    value={formData.physical_risk ? "Yes" : "No"}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        physical_risk: value === "Yes",
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
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Property Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="images">Upload Images</Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {existingImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Property ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeExistingImage(image)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                {newImages.map((image, index) => (
                  <div key={`new-${index}`} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`New Property ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeNewImage(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Property Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={featuresInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFeaturesInput(value);
                    const featuresArray = value
                      .split(",")
                      .map((f) => f.trim())
                      .filter((f) => f);
                    setFormData((prev) => ({
                      ...prev,
                      features: featuresArray,
                    }));
                  }}
                  placeholder="Enter features (e.g., Water Supply, Fenced, Road Access)"
                  className="flex-1"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features?.map((feature, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeFeature(index)}
                  >
                    {feature} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
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
              onClick={onClose}
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
