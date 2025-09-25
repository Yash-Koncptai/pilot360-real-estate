// import { useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Switch } from '@/components/ui/switch';
// import { Badge } from '@/components/ui/badge';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { LandProperty } from '@/data/landProperties';
// import { Save, X, Plus } from 'lucide-react';

// interface EditPropertyModalProps {
//   property: LandProperty | null;
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (property: LandProperty) => void;
// }

// export default function EditPropertyModal({ property, isOpen, onClose, onSave }: EditPropertyModalProps) {
//   const [formData, setFormData] = useState<LandProperty>(() =>
//     property || {
//       id: '',
//       title: '',
//       price: 0,
//       type: 'Agricultural',
//       size: '',
//       location: '',
//       lat: 0,
//       lng: 0,
//       images: [],
//       isLocked: false,
//       features: [],
//       description: '',
//       aiInsights: {
//         growthPotential: 'Medium',
//         expectedROI: '12-15%',
//         riskLevel: 'Medium',
//         demandIndicators: {
//           viewsThisWeek: 0,
//           nearbyDevelopments: []
//         }
//       }
//     }
//   );

//   const [newFeature, setNewFeature] = useState('');
//   const [newImage, setNewImage] = useState('');
//   const [newDevelopment, setNewDevelopment] = useState('');

//   const handleSave = () => {
//     onSave(formData);
//     onClose();
//   };

//   const addFeature = () => {
//     if (newFeature.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         features: [...prev.features, newFeature.trim()]
//       }));
//       setNewFeature('');
//     }
//   };

//   const removeFeature = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       features: prev.features.filter((_, i) => i !== index)
//     }));
//   };

//   const addImage = () => {
//     if (newImage.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         images: [...prev.images, newImage.trim()]
//       }));
//       setNewImage('');
//     }
//   };

//   const removeImage = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index)
//     }));
//   };

//   const addDevelopment = () => {
//     if (newDevelopment.trim() && formData.aiInsights) {
//       setFormData(prev => ({
//         ...prev,
//         aiInsights: {
//           ...prev.aiInsights!,
//           demandIndicators: {
//             ...prev.aiInsights!.demandIndicators,
//             nearbyDevelopments: [...prev.aiInsights!.demandIndicators.nearbyDevelopments, newDevelopment.trim()]
//           }
//         }
//       }));
//       setNewDevelopment('');
//     }
//   };

//   const removeDevelopment = (index: number) => {
//     if (formData.aiInsights) {
//       setFormData(prev => ({
//         ...prev,
//         aiInsights: {
//           ...prev.aiInsights!,
//           demandIndicators: {
//             ...prev.aiInsights!.demandIndicators,
//             nearbyDevelopments: prev.aiInsights!.demandIndicators.nearbyDevelopments.filter((_, i) => i !== index)
//           }
//         }
//       }));
//     }
//   };

//   if (!property && !isOpen) return null;

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold">
//             {property ? 'Edit Property' : 'Add New Property'}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6">
//           {/* Basic Information */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Basic Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="title">Property Title</Label>
//                   <Input
//                     id="title"
//                     value={formData.title}
//                     onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
//                     placeholder="Enter property title"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="price">Price (₹)</Label>
//                   <Input
//                     id="price"
//                     type="number"
//                     value={formData.price}
//                     onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
//                     placeholder="Enter price in rupees"
//                   />
//                 </div>
//               </div>

//               <div className="grid md:grid-cols-3 gap-4">
//                 <div>
//                   <Label htmlFor="type">Property Type</Label>
//                   <Select value={formData.type} onValueChange={(value: 'Agricultural' | 'Non-Agricultural' | 'Farmhouse' | 'Industrial' | 'Commercial') => setFormData(prev => ({ ...prev, type: value }))}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Agricultural">Agricultural</SelectItem>
//                       <SelectItem value="Non-Agricultural">Non-Agricultural</SelectItem>
//                       <SelectItem value="Farmhouse">Farmhouse</SelectItem>
//                       <SelectItem value="Industrial">Industrial</SelectItem>
//                       <SelectItem value="Commercial">Commercial</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label htmlFor="size">Size</Label>
//                   <Input
//                     id="size"
//                     value={formData.size}
//                     onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
//                     placeholder="e.g., 5 acres, 2400 sq ft"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="location">Location</Label>
//                   <Input
//                     id="location"
//                     value={formData.location}
//                     onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
//                     placeholder="Enter location"
//                   />
//                 </div>
//               </div>

//               <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="lat">Latitude</Label>
//                   <Input
//                     id="lat"
//                     type="number"
//                     step="any"
//                     value={formData.lat}
//                     onChange={(e) => setFormData(prev => ({
//                       ...prev,
//                       lat: Number(e.target.value)
//                     }))}
//                     placeholder="Enter latitude"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="lng">Longitude</Label>
//                   <Input
//                     id="lng"
//                     type="number"
//                     step="any"
//                     value={formData.lng}
//                     onChange={(e) => setFormData(prev => ({
//                       ...prev,
//                       lng: Number(e.target.value)
//                     }))}
//                     placeholder="Enter longitude"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea
//                   id="description"
//                   value={formData.description}
//                   onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
//                   placeholder="Enter property description"
//                   rows={3}
//                 />
//               </div>

//               <div className="flex items-center space-x-2">
//                 <Switch
//                   id="isLocked"
//                   checked={formData.isLocked}
//                   onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isLocked: checked }))}
//                 />
//                 <Label htmlFor="isLocked">Private Property (Locked)</Label>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Images */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Property Images</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex gap-2">
//                 <Input
//                   value={newImage}
//                   onChange={(e) => setNewImage(e.target.value)}
//                   placeholder="Enter image URL"
//                   className="flex-1"
//                 />
//                 <Button onClick={addImage} size="sm">
//                   <Plus className="w-4 h-4" />
//                 </Button>
//               </div>
//               <div className="grid md:grid-cols-2 gap-4">
//                 {formData.images.map((image, index) => (
//                   <div key={index} className="relative">
//                     <img src={image} alt={`Property ${index + 1}`} className="w-full h-32 object-cover rounded" />
//                     <Button
//                       variant="destructive"
//                       size="sm"
//                       className="absolute top-2 right-2"
//                       onClick={() => removeImage(index)}
//                     >
//                       <X className="w-3 h-3" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Features */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Property Features</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex gap-2">
//                 <Input
//                   value={newFeature}
//                   onChange={(e) => setNewFeature(e.target.value)}
//                   placeholder="Add a feature"
//                   className="flex-1"
//                 />
//                 <Button onClick={addFeature} size="sm">
//                   <Plus className="w-4 h-4" />
//                 </Button>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {formData.features.map((feature, index) => (
//                   <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeFeature(index)}>
//                     {feature} <X className="w-3 h-3 ml-1" />
//                   </Badge>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           {/* AI Insights */}
//           {formData.aiInsights && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>AI Insights</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid md:grid-cols-3 gap-4">
//                   <div>
//                     <Label htmlFor="growthPotential">Growth Potential</Label>
//                     <Select
//                       value={formData.aiInsights.growthPotential}
//                       onValueChange={(value: 'Low' | 'Medium' | 'High') =>
//                         setFormData(prev => ({
//                           ...prev,
//                           aiInsights: { ...prev.aiInsights!, growthPotential: value }
//                         }))
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="Low">Low</SelectItem>
//                         <SelectItem value="Medium">Medium</SelectItem>
//                         <SelectItem value="High">High</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div>
//                     <Label htmlFor="expectedROI">Expected ROI</Label>
//                     <Input
//                       id="expectedROI"
//                       value={formData.aiInsights.expectedROI}
//                       onChange={(e) => setFormData(prev => ({
//                         ...prev,
//                         aiInsights: { ...prev.aiInsights!, expectedROI: e.target.value }
//                       }))}
//                       placeholder="e.g., 12-15%"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="riskLevel">Risk Level</Label>
//                     <Select
//                       value={formData.aiInsights.riskLevel}
//                       onValueChange={(value: 'Low' | 'Medium' | 'High') =>
//                         setFormData(prev => ({
//                           ...prev,
//                           aiInsights: { ...prev.aiInsights!, riskLevel: value }
//                         }))
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="Low">Low</SelectItem>
//                         <SelectItem value="Medium">Medium</SelectItem>
//                         <SelectItem value="High">High</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="viewsThisWeek">Views This Week</Label>
//                     <Input
//                       id="viewsThisWeek"
//                       type="number"
//                       value={formData.aiInsights.demandIndicators.viewsThisWeek}
//                       onChange={(e) => setFormData(prev => ({
//                         ...prev,
//                         aiInsights: {
//                           ...prev.aiInsights!,
//                           demandIndicators: {
//                             ...prev.aiInsights!.demandIndicators,
//                             viewsThisWeek: Number(e.target.value)
//                           }
//                         }
//                       }))}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="matchScore">Match Score (%)</Label>
//                     <Input
//                       id="matchScore"
//                       type="number"
//                       value={formData.aiInsights.matchScore || ''}
//                       onChange={(e) => setFormData(prev => ({
//                         ...prev,
//                         aiInsights: { ...prev.aiInsights!, matchScore: Number(e.target.value) }
//                       }))}
//                       placeholder="Optional match score"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <Label>Nearby Developments</Label>
//                   <div className="flex gap-2 mt-2">
//                     <Input
//                       value={newDevelopment}
//                       onChange={(e) => setNewDevelopment(e.target.value)}
//                       placeholder="Add nearby development"
//                       className="flex-1"
//                     />
//                     <Button onClick={addDevelopment} size="sm">
//                       <Plus className="w-4 h-4" />
//                     </Button>
//                   </div>
//                   <div className="flex flex-wrap gap-2 mt-2">
//                     {formData.aiInsights.demandIndicators.nearbyDevelopments.map((dev, index) => (
//                       <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => removeDevelopment(index)}>
//                         {dev} <X className="w-3 h-3 ml-1" />
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Action Buttons */}
//           <div className="flex gap-4 pt-4">
//             <Button onClick={handleSave} className="flex-1" size="lg">
//               <Save className="w-4 h-4 mr-2" />
//               Save Property
//             </Button>
//             <Button variant="outline" onClick={onClose} className="flex-1" size="lg">
//               Cancel
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X, Plus } from "lucide-react";

interface EditPropertyModalProps {
  property: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any) => void;
}

export default function EditPropertyModal({
  property,
  isOpen,
  onClose,
  onSave,
}: EditPropertyModalProps) {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    price: 0,
    type: "Agricultural",
    size: "",
    location: "",
    latitude: 0,
    longitude: 0,
    description: "",
    privacy: false,
    features: [],
    images: [],
  });

  // Reinitialize formData when property or isOpen changes
  useEffect(() => {
    if (property && isOpen) {
      setFormData({
        id: property.id || "",
        title: property.title || "",
        price: property.price || 0,
        type: property.type || "Agricultural",
        size: property.size || "",
        location: property.location || "",
        latitude: property.latitude || 0,
        longitude: property.longitude || 0,
        description: property.description || "",
        privacy: property.private || false,
        features: property.features || [],
        images: property.images || [],
      });
    } else if (!isOpen) {
      // Reset to default when modal closes
      setFormData({
        id: "",
        title: "",
        price: 0,
        type: "Agricultural",
        size: "",
        location: "",
        latitude: 0,
        longitude: 0,
        description: "",
        privacy: false,
        features: [],
        images: [],
      });
    }
  }, [property, isOpen]);

  const [newFeature, setNewFeature] = useState("");
  const [newImage, setNewImage] = useState("");

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addImage = () => {
    if (newImage.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage.trim()],
      }));
      setNewImage("");
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  if (!property && !isOpen) return null;

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
          size, location, coordinates, description, privacy status, features,
          and images.
        </p>

        <div className="space-y-6">
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
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: Number(e.target.value),
                      }))
                    }
                    placeholder="Enter price in rupees"
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
              </div>

              <div className="grid md:grid-cols-2 gap-4">
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
                  id="privacy"
                  checked={formData.privacy}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      privacy: checked as boolean,
                    }))
                  }
                />
                <Label htmlFor="privacy">Private Property</Label>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Property Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Enter image URL"
                  className="flex-1"
                />
                <Button onClick={addImage} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {formData.images.map((image, index) => (
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
                      onClick={() => removeImage(index)}
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
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature"
                  className="flex-1"
                />
                <Button onClick={addFeature} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
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
            <Button onClick={handleSave} className="flex-1" size="lg">
              <Save className="w-4 h-4 mr-2" />
              Save Property
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              size="lg"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
