import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BarChart, Users, MapPin, TrendingUp, Plus, Edit, Trash2, Eye, LogOut } from "lucide-react";
import { landProperties } from "@/data/landProperties";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [properties, setProperties] = useState(landProperties);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin");
  };

  const stats = [
    {
      title: "Total Properties",
      value: properties.length,
      icon: MapPin,
      change: "+12%",
      changeType: "positive" as const
    },
    {
      title: "Available Properties",
      value: properties.filter(p => !p.isLocked).length,
      icon: TrendingUp,
      change: "+8%",
      changeType: "positive" as const
    },
    {
      title: "Total Views",
      value: "2,847",
      icon: Eye,
      change: "+23%",
      changeType: "positive" as const
    },
    {
      title: "Inquiries",
      value: "156",
      icon: Users,
      change: "+5%",
      changeType: "positive" as const
    }
  ];

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
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
              onClick={() => setShowAddForm(true)}
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
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
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
                    <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div>
                          <h3 className="font-semibold">{property.title}</h3>
                          <p className="text-sm text-muted-foreground">{property.location}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">{property.type}</Badge>
                            <Badge variant={property.isLocked ? "destructive" : "default"}>
                              {property.isLocked ? "Private" : "Available"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">₹{(property.price / 100000).toFixed(1)}L</p>
                          <p className="text-sm text-muted-foreground">{property.size}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Performance</CardTitle>
                  <CardDescription>Views and inquiries by property type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Agricultural Land</span>
                      <Badge>847 views</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Non-Agricultural Land</span>
                      <Badge>623 views</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Farmhouse Plots</span>
                      <Badge>456 views</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Industrial Land</span>
                      <Badge>321 views</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trends</CardTitle>
                  <CardDescription>Property inquiries and views</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>This Month</span>
                      <Badge variant="default">156 inquiries</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Last Month</span>
                      <Badge variant="secondary">148 inquiries</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Growth Rate</span>
                      <Badge variant="default" className="bg-green-500">+5.4%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Arjun Patel", email: "arjun@example.com", type: "Premium Investor" },
                    { name: "Priya Shah", email: "priya@example.com", type: "Regular User" },
                    { name: "Rohit Mehta", email: "rohit@example.com", type: "Corporate Client" },
                    { name: "Sneha Desai", email: "sneha@example.com", type: "Premium Investor" }
                  ].map((user, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge variant="outline">{user.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;