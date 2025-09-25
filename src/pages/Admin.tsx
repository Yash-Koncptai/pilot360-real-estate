// import { useState } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { BarChart, Users, MapPin, TrendingUp, Plus, Edit, Trash2, Eye, LogOut, Search, Send } from "lucide-react";
// import { landProperties, LandProperty } from "@/data/landProperties";
// import { useNavigate } from "react-router-dom";
// import PropertyDetailModal from "@/components/PropertyDetailModal";
// import EditPropertyModal from "@/components/EditPropertyModal";

// const AdminDashboard = () => {
//   const [properties, setProperties] = useState(landProperties);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [selectedProperty, setSelectedProperty] = useState<LandProperty | null>(null);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [userSuggestions, setUserSuggestions] = useState<{[key: string]: string[]}>({
//     "arjun@example.com": [],
//     "priya@example.com": [],
//     "rohit@example.com": [],
//     "sneha@example.com": []
//   });
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("adminAuth");
//     navigate("/admin");
//   };

//   const stats = [
//     {
//       title: "Total Properties",
//       value: properties.length,
//       icon: MapPin,
//       change: "+12%",
//       changeType: "positive" as const
//     },
//     {
//       title: "Available Properties",
//       value: properties.filter(p => !p.isLocked).length,
//       icon: TrendingUp,
//       change: "+8%",
//       changeType: "positive" as const
//     },
//     {
//       title: "Total Views",
//       value: "2,847",
//       icon: Eye,
//       change: "+23%",
//       changeType: "positive" as const
//     },
//     {
//       title: "Inquiries",
//       value: "156",
//       icon: Users,
//       change: "+5%",
//       changeType: "positive" as const
//     }
//   ];

//   const deleteProperty = (id: string) => {
//     setProperties(prev => prev.filter(p => p.id !== id));
//   };

//   const handlePropertySave = (property: LandProperty) => {
//     if (properties.find(p => p.id === property.id)) {
//       setProperties(prev => prev.map(p => p.id === property.id ? property : p));
//     } else {
//       setProperties(prev => [...prev, { ...property, id: Date.now().toString() }]);
//     }
//   };

//   const handleViewProperty = (property: LandProperty) => {
//     setSelectedProperty(property);
//     setShowDetailModal(true);
//   };

//   const handleEditProperty = (property: LandProperty) => {
//     setSelectedProperty(property);
//     setShowEditModal(true);
//   };

//   const handleAddProperty = () => {
//     setSelectedProperty(null);
//     setShowEditModal(true);
//   };

//   const suggestPropertyToUser = (userEmail: string, propertyId: string) => {
//     setUserSuggestions(prev => ({
//       ...prev,
//       [userEmail]: [...(prev[userEmail] || []), propertyId]
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 p-6">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//               Admin Dashboard
//             </h1>
//             <p className="text-muted-foreground mt-1">
//               Manage your land investment properties
//             </p>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button
//               onClick={handleAddProperty}
//               className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               Add Property
//             </Button>
//             <Button
//               variant="outline"
//               onClick={handleLogout}
//               className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
//             >
//               <LogOut className="w-4 h-4 mr-2" />
//               Logout
//             </Button>
//           </div>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {stats.map((stat) => (
//             <Card key={stat.title} className="hover:shadow-lg transition-shadow">
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   {stat.title}
//                 </CardTitle>
//                 <stat.icon className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">{stat.value}</div>
//                 <p className="text-xs text-muted-foreground">
//                   <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
//                     {stat.change}
//                   </span> from last month
//                 </p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Main Content */}
//         <Tabs defaultValue="properties" className="space-y-6">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="properties">Properties</TabsTrigger>
//             <TabsTrigger value="analytics">Analytics</TabsTrigger>
//             <TabsTrigger value="users">Users</TabsTrigger>
//           </TabsList>

//           <TabsContent value="properties" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Property Management</CardTitle>
//                 <CardDescription>
//                   View, edit, and manage all land properties
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {properties.map((property) => (
//                     <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
//                       <div className="flex items-center space-x-4">
//                         <img
//                           src={property.images[0]}
//                           alt={property.title}
//                           className="w-16 h-16 rounded object-cover"
//                         />
//                         <div>
//                           <h3 className="font-semibold">{property.title}</h3>
//                           <p className="text-sm text-muted-foreground">{property.location}</p>
//                           <div className="flex items-center gap-2 mt-1">
//                             <Badge variant="secondary">{property.type}</Badge>
//                             <Badge variant={property.isLocked ? "destructive" : "default"}>
//                               {property.isLocked ? "Private" : "Available"}
//                             </Badge>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-4">
//                         <div className="text-right">
//                           <p className="font-semibold">₹{(property.price / 100000).toFixed(1)}L</p>
//                           <p className="text-sm text-muted-foreground">{property.size}</p>
//                         </div>
//                         <div className="flex gap-2">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleViewProperty(property)}
//                           >
//                             <Eye className="w-4 h-4" />
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleEditProperty(property)}
//                           >
//                             <Edit className="w-4 h-4" />
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => deleteProperty(property.id)}
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="analytics" className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Property Performance</CardTitle>
//                   <CardDescription>Views and inquiries by property type</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center">
//                       <span>Agricultural Land</span>
//                       <Badge>847 views</Badge>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span>Non-Agricultural Land</span>
//                       <Badge>623 views</Badge>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span>Farmhouse Plots</span>
//                       <Badge>456 views</Badge>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span>Industrial Land</span>
//                       <Badge>321 views</Badge>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Monthly Trends</CardTitle>
//                   <CardDescription>Property inquiries and views</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center">
//                       <span>This Month</span>
//                       <Badge variant="default">156 inquiries</Badge>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span>Last Month</span>
//                       <Badge variant="secondary">148 inquiries</Badge>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span>Growth Rate</span>
//                       <Badge variant="default" className="bg-green-500">+5.4%</Badge>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>

//           <TabsContent value="users" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>User Management & Property Suggestions</CardTitle>
//                 <CardDescription>Manage user accounts and suggest properties</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-6">
//                   {[
//                     { name: "Arjun Patel", email: "arjun@example.com", type: "Premium Investor", preferences: "Agricultural, Budget: ₹2-5Cr" },
//                     { name: "Priya Shah", email: "priya@example.com", type: "Regular User", preferences: "Farmhouse, Budget: ₹50L-2Cr" },
//                     { name: "Rohit Mehta", email: "rohit@example.com", type: "Corporate Client", preferences: "Industrial, Budget: ₹5-20Cr" },
//                     { name: "Sneha Desai", email: "sneha@example.com", type: "Premium Investor", preferences: "Commercial, Budget: ₹3-10Cr" }
//                   ].map((user, idx) => (
//                     <Card key={idx} className="p-4">
//                       <div className="flex items-start justify-between mb-4">
//                         <div className="flex-1">
//                           <h3 className="font-semibold">{user.name}</h3>
//                           <p className="text-sm text-muted-foreground">{user.email}</p>
//                           <p className="text-xs text-muted-foreground mt-1">{user.preferences}</p>
//                           <Badge variant="outline" className="mt-2">{user.type}</Badge>
//                         </div>
//                       </div>

//                       <div className="space-y-3">
//                         <div className="text-sm font-medium">Suggested Properties:</div>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                           {properties.slice(0, 3).map((property) => (
//                             <div key={property.id} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
//                               <div className="flex-1">
//                                 <div className="font-medium">{property.title}</div>
//                                 <div className="text-xs text-muted-foreground">
//                                   ₹{(property.price / 100000).toFixed(1)}L - {property.location}
//                                 </div>
//                               </div>
//                               <Button
//                                 size="sm"
//                                 variant="outline"
//                                 onClick={() => suggestPropertyToUser(user.email, property.id)}
//                                 disabled={userSuggestions[user.email]?.includes(property.id)}
//                               >
//                                 {userSuggestions[user.email]?.includes(property.id) ? (
//                                   "Suggested"
//                                 ) : (
//                                   <>
//                                     <Send className="w-3 h-3 mr-1" />
//                                     Suggest
//                                   </>
//                                 )}
//                               </Button>
//                             </div>
//                           ))}
//                         </div>

//                         {userSuggestions[user.email]?.length > 0 && (
//                           <div className="mt-3 p-2 bg-green-50 rounded">
//                             <div className="text-xs font-medium text-green-800">
//                               {userSuggestions[user.email].length} properties suggested to this user
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Modals */}
//       <PropertyDetailModal
//         property={selectedProperty}
//         isOpen={showDetailModal}
//         onClose={() => setShowDetailModal(false)}
//       />

//       <EditPropertyModal
//         property={selectedProperty}
//         isOpen={showEditModal}
//         onClose={() => setShowEditModal(false)}
//         onSave={handlePropertySave}
//       />
//     </div>
//   );
// };

// export default AdminDashboard;

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Eye,
  LogOut,
  TrendingUp,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropertyDetailModal from "@/components/PropertyDetailModal";
import EditPropertyModal from "@/components/EditPropertyModal";

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  // Fetch properties on mount
  useEffect(() => {
    const fetchProperties = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.error("No authentication token found");
        return;
      }
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/property",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.success) {
          setProperties(response.data.properties);
        }
      } catch (err) {
        console.error(
          "Error fetching properties:",
          err.response ? err.response.data : err.message
        );
      }
    };
    fetchProperties();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin");
  };

  const deleteProperty = async (id: string) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/admin/property/delete?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        setProperties((prev) => prev.filter((p) => p.id !== id));
        console.log("Property deleted successfully:", response.data.message);
      }
    } catch (err) {
      console.error(
        "Error deleting property:",
        err.response ? err.response.data : err.message
      );
    }
  };

  const handleViewProperty = (property: any) => {
    setSelectedProperty(property);
    setShowDetailModal(true);
  };

  const handleEditProperty = (property: any) => {
    setSelectedProperty(property);
    setShowEditModal(true);
  };

  const handleAddProperty = () => {
    setSelectedProperty(null);
    setShowEditModal(true);
  };

  const handlePropertySave = async (formData: any) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      if (formData.id) {
        // Update existing property
        const response = await axios.put(
          `http://localhost:5000/api/admin/property/update?id=${formData.id}`,
          {
            title: formData.title,
            price: Number(formData.price),
            type: formData.type,
            size: formData.size,
            location: formData.location,
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
            description: formData.description,
            privacy: formData.privacy,
            features: formData.features.length ? formData.features : null,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setProperties((prev) =>
            prev.map((p) => (p.id === formData.id ? response.data.property : p))
          );
          console.log("Property updated successfully:", response.data.property);
        }
      } else {
        // Add new property
        const response = await axios.post(
          "http://localhost:5000/api/admin/property/add",
          {
            title: formData.title,
            price: Number(formData.price),
            type: formData.type,
            size: formData.size,
            location: formData.location,
            latitude: Number(formData.latitude),
            longitude: Number(formData.longitude),
            description: formData.description,
            privacy: formData.privacy,
            features: formData.features.length ? formData.features : null,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setProperties((prev) => [...prev, response.data.property]);
          console.log("Property added successfully:", response.data.property);
        }
      }
      setShowEditModal(false);
    } catch (err) {
      console.error(
        "Error saving property:",
        err.response ? err.response.data : err.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your land investment properties
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleAddProperty}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Properties
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{properties.length}</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available Properties
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {properties.filter((p) => !p.private).length}
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Views
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                To be fetched from backend
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Inquiries
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                To be fetched from backend
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Management</CardTitle>
                <CardDescription>
                  View, edit, and manage all land properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={
                            property.images && property.images.length
                              ? property.images[0]
                              : ""
                          }
                          alt={property.title}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div>
                          <h3 className="font-semibold">{property.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {property.location}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">{property.type}</Badge>
                            <Badge
                              variant={
                                property.private ? "destructive" : "default"
                              }
                            >
                              {property.private ? "Private" : "Available"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">
                            ₹{property.price || 0}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {property.size}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewProperty(property)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProperty(property)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteProperty(property.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Property performance and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Analytics data to be fetched from backend in future updates.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage users and property suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  User management to be implemented with backend data.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
      <EditPropertyModal
        property={selectedProperty}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handlePropertySave}
      />
    </div>
  );
};

export default AdminDashboard;
