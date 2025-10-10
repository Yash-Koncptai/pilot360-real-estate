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

// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Save, X } from "lucide-react";

// interface EditPropertyModalProps {
//   property: any | null;
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (formData: any) => void;
// }

// export default function EditPropertyModal({
//   property,
//   isOpen,
//   onClose,
//   onSave,
// }: EditPropertyModalProps) {
//   const [formData, setFormData] = useState({
//     id: "",
//     title: "",
//     price: 0,
//     type: "Agricultural",
//     size: "",
//     location: "",
//     latitude: 0,
//     longitude: 0,
//     description: "",
//     privacy: false,
//     features: [],
//     images: [],
//   });

//   const [displayPrice, setDisplayPrice] = useState("");
//   const [featuresInput, setFeaturesInput] = useState("");

//   // Format number to comma-separated string
//   const formatPrice = (value: number) => {
//     return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   };

//   // Parse comma-separated string to number
//   const parsePrice = (value: string) => {
//     return Number(value.replace(/,/g, ""));
//   };

//   // Reinitialize formData when property or isOpen changes
//   useEffect(() => {
//     if (property && isOpen) {
//       setFormData({
//         id: property.id || "",
//         title: property.title || "",
//         price: property.price || 0,
//         type: property.type || "Agricultural",
//         size: property.size || "",
//         location: property.location || "",
//         latitude: property.latitude || 0,
//         longitude: property.longitude || 0,
//         description: property.description || "",
//         privacy: property.private || false,
//         features: property.features || [],
//         images: property.images || [],
//       });
//       setDisplayPrice(formatPrice(property.price || 0));
//       setFeaturesInput((property.features || []).join(", "));
//     } else if (!isOpen) {
//       // Reset to default when modal closes
//       setFormData({
//         id: "",
//         title: "",
//         price: 0,
//         type: "Agricultural",
//         size: "",
//         location: "",
//         latitude: 0,
//         longitude: 0,
//         description: "",
//         privacy: false,
//         features: [],
//         images: [],
//       });
//       setDisplayPrice("");
//       setFeaturesInput("");
//     }
//   }, [property, isOpen]);

//   const [newImage, setNewImage] = useState("");

//   const handleSave = () => {
//     // Parse featuresInput into an array
//     const featuresArray = featuresInput
//       .split(",")
//       .map((f) => f.trim())
//       .filter((f) => f);
//     onSave({
//       ...formData,
//       price: parsePrice(displayPrice || "0"),
//       features: featuresArray,
//     });
//     onClose();
//   };

//   const removeFeature = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       features: prev.features.filter((_, i) => i !== index),
//     }));
//     setFeaturesInput(
//       formData.features.filter((_, i) => i !== index).join(", ")
//     );
//   };

//   const addImage = () => {
//     if (newImage.trim()) {
//       setFormData((prev) => ({
//         ...prev,
//         images: [...prev.images, newImage.trim()],
//       }));
//       setNewImage("");
//     }
//   };

//   const removeImage = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index),
//     }));
//   };

//   if (!property && !isOpen) return null;

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent
//         className="max-w-4xl max-h-[90vh] overflow-y-auto"
//         aria-describedby="edit-property-description"
//       >
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold">
//             {property ? "Edit Property" : "Add New Property"}
//           </DialogTitle>
//         </DialogHeader>
//         <p id="edit-property-description" className="sr-only">
//           Form to edit or add property details including title, price, type,
//           size, location, coordinates, description, privacy status, features,
//           and images.
//         </p>

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
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         title: e.target.value,
//                       }))
//                     }
//                     placeholder="Enter property title"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="price">Price (₹)</Label>
//                   <Input
//                     id="price"
//                     type="text"
//                     value={displayPrice}
//                     onChange={(e) => {
//                       const value = e.target.value.replace(/[^0-9,]/g, "");
//                       setDisplayPrice(value);
//                       setFormData((prev) => ({
//                         ...prev,
//                         price: parsePrice(value || "0"),
//                       }));
//                     }}
//                     placeholder="Enter price in rupees (e.g., 30,000)"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="grid md:grid-cols-3 gap-4">
//                 <div>
//                   <Label htmlFor="type">Property Type</Label>
//                   <Select
//                     value={formData.type}
//                     onValueChange={(value) =>
//                       setFormData((prev) => ({ ...prev, type: value }))
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Agricultural">Agricultural</SelectItem>
//                       <SelectItem value="Non-Agricultural">
//                         Non-Agricultural
//                       </SelectItem>
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
//                     onChange={(e) =>
//                       setFormData((prev) => ({ ...prev, size: e.target.value }))
//                     }
//                     placeholder="e.g., 5 acres, 2400 sq ft"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="location">Location</Label>
//                   <Input
//                     id="location"
//                     value={formData.location}
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         location: e.target.value,
//                       }))
//                     }
//                     placeholder="Enter location"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                   <Label htmlFor="latitude">Latitude</Label>
//                   <Input
//                     id="latitude"
//                     type="number"
//                     step="any"
//                     value={formData.latitude}
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         latitude: Number(e.target.value),
//                       }))
//                     }
//                     placeholder="Enter latitude"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="longitude">Longitude</Label>
//                   <Input
//                     id="longitude"
//                     type="number"
//                     step="any"
//                     value={formData.longitude}
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         longitude: Number(e.target.value),
//                       }))
//                     }
//                     placeholder="Enter longitude"
//                     required
//                   />
//                 </div>
//               </div>

//               <div>
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea
//                   id="description"
//                   value={formData.description}
//                   onChange={(e) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       description: e.target.value,
//                     }))
//                   }
//                   placeholder="Enter property description"
//                   rows={3}
//                   required
//                 />
//               </div>

//               <div className="flex items-center space-x-2">
//                 <Switch
//                   id="privacy"
//                   checked={formData.privacy}
//                   onCheckedChange={(checked) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       privacy: checked as boolean,
//                     }))
//                   }
//                 />
//                 <Label htmlFor="privacy">Private Property</Label>
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
//                   <X className="w-4 h-4" />
//                 </Button>
//               </div>
//               <div className="grid md:grid-cols-2 gap-4">
//                 {formData.images.map((image, index) => (
//                   <div key={index} className="relative">
//                     <img
//                       src={image}
//                       alt={`Property ${index + 1}`}
//                       className="w-full h-32 object-cover rounded"
//                     />
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
//                   value={featuresInput}
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     setFeaturesInput(value);
//                     const featuresArray = value
//                       .split(",")
//                       .map((f) => f.trim())
//                       .filter((f) => f);
//                     setFormData((prev) => ({
//                       ...prev,
//                       features: featuresArray,
//                     }));
//                   }}
//                   placeholder="Enter features (e.g., Water Supply, Fenced, Road Access)"
//                   className="flex-1"
//                 />
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {formData.features.map((feature, index) => (
//                   <Badge
//                     key={index}
//                     variant="secondary"
//                     className="cursor-pointer"
//                     onClick={() => removeFeature(index)}
//                   >
//                     {feature} <X className="w-3 h-3 ml-1" />
//                   </Badge>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Action Buttons */}
//           <div className="flex gap-4 pt-4">
//             <Button onClick={handleSave} className="flex-1" size="lg">
//               <Save className="w-4 h-4 mr-2" />
//               Save Property
//             </Button>
//             <Button
//               variant="outline"
//               onClick={onClose}
//               className="flex-1"
//               size="lg"
//             >
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
        images: newImages, // Send File[] for new images
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
          status, features, and images.
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
