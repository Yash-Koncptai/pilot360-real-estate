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
  // STATE
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
      setFormData({ ...property });
      setDisplayPrice(formatPrice(property.price || 0));
      setFeaturesInput((property.features || []).join(", "));
      setExistingImages(property.images || []);
      setDeletedImages([]);
      setNewImages([]);
      setError("");
    } else if (!isOpen) {
      resetForm();
    }
  }, [property, isOpen]);

  const resetForm = () => {
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
      // Keep input as-is (user sees the files they tried to add)
      return;
    }

    setNewImages((prev) => [...prev, ...newFiles]);
    toast.success(`${newFiles.length} image(s) added. Total: ${totalAfter}`);
    // Do NOT clear input — we want file names to stay visible
  };

  const removeExistingImage = (img: string) => {
    setExistingImages((prev) => prev.filter((i) => i !== img));
    setDeletedImages((prev) => [...prev, img]);
    // Optional: clear input if no new images left
    if (newImages.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeNewImage = (idx: number) => {
    const removedFile = newImages[idx];
    setNewImages((prev) => prev.filter((_, i) => i !== idx));

    // Rebuild FileList without the removed file
    const dt = new DataTransfer();
    newImages
      .filter((_, i) => i !== idx)
      .forEach((f) => dt.items.add(f));
    if (fileInputRef.current) {
      fileInputRef.current.files = dt.files;
    }

    // If no new images left, clear input
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
        images: newImages,
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
                  <Label htmlFor="title">Property Title</Label>
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
                  <Label htmlFor="price">Price (₹)</Label>
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
                  <Label htmlFor="type">Property Type</Label>
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
                      setFormData((p) => ({ ...p, size: e.target.value }))
                    }
                    placeholder="e.g. 5 acres"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="primary_purpose">Primary Purpose</Label>
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
                  <Label htmlFor="latitude">Latitude</Label>
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
                    placeholder="e.g. 28.6139"
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
                      setFormData((p) => ({
                        ...p,
                        longitude: Number(e.target.value),
                      }))
                    }
                    placeholder="e.g. 77.2090"
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
                <Label htmlFor="investment_gain">Investment Gain (%)</Label>
                <Input
                  id="investment_gain"
                  type="text"
                  value={formData.investment_gain || ""}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      investment_gain: Number(e.target.value),
                    }))
                  }
                  placeholder="e.g. 12.5"
                />
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
                {/* Existing Images */}
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

                {/* New Images */}
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
                placeholder="e.g. Water Supply, Fenced, Road Access"
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