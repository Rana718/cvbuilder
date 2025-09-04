"use client";

import React, { useState } from "react";
import {
    Edit3,
    Plus,
    Eye,
    Copy,
    Trash2,
    Download,
    Upload,
    Search,
    Filter,
    Palette,
    Layout,
    Type,
    Save,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const templateStats = [
    {
        title: "Total Templates",
        value: "24",
        icon: Layout,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
    },
    {
        title: "Active Templates",
        value: "18",
        icon: Eye,
        color: "text-green-600",
        bgColor: "bg-green-50",
    },
    {
        title: "Most Popular",
        value: "Modern Pro",
        icon: Type,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
    },
    {
        title: "Usage This Month",
        value: "8,456",
        icon: Download,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
    },
];

const templatesData = [
    {
        id: "TPL001",
        name: "Modern Professional",
        category: "Professional",
        status: "Active",
        usage: 2847,
        rating: 4.8,
        lastModified: "2024-09-01",
        preview: "/api/placeholder/300/400",
        description: "Clean and modern design perfect for professionals",
    },
    {
        id: "TPL002",
        name: "Creative Designer",
        category: "Creative",
        status: "Active",
        usage: 1923,
        rating: 4.6,
        lastModified: "2024-08-28",
        preview: "/api/placeholder/300/400",
        description: "Colorful and creative template for designers",
    },
    {
        id: "TPL003",
        name: "Executive Elite",
        category: "Executive",
        status: "Active",
        usage: 1654,
        rating: 4.9,
        lastModified: "2024-08-25",
        preview: "/api/placeholder/300/400",
        description: "Premium template for senior executives",
    },
    {
        id: "TPL004",
        name: "Minimalist Clean",
        category: "Minimalist",
        status: "Draft",
        usage: 0,
        rating: 0,
        lastModified: "2024-09-02",
        preview: "/api/placeholder/300/400",
        description: "Simple and clean minimalist design",
    },
    {
        id: "TPL005",
        name: "Tech Specialist",
        category: "Technology",
        status: "Active",
        usage: 1234,
        rating: 4.7,
        lastModified: "2024-08-20",
        preview: "/api/placeholder/300/400",
        description: "Perfect for IT and tech professionals",
    },
    {
        id: "TPL006",
        name: "Academic Scholar",
        category: "Academic",
        status: "Inactive",
        usage: 567,
        rating: 4.4,
        lastModified: "2024-07-15",
        preview: "/api/placeholder/300/400",
        description: "Designed for academic and research positions",
    },
];

export default function TemplateEditor() {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Active":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
            case "Draft":
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Draft</Badge>;
            case "Inactive":
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const filteredTemplates = templatesData.filter((template) => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            template.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === "all" || template.category.toLowerCase() === categoryFilter;
        const matchesStatus = statusFilter === "all" || template.status.toLowerCase() === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    return (
        <div className="p-4 lg:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Template Editor</h1>
                    <p className="text-gray-600">Create and manage resume templates</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Import Template
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Template
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Create New Template</DialogTitle>
                                <DialogDescription>
                                    Start creating a new resume template from scratch
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Template Name</label>
                                        <Input placeholder="Enter template name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Category</label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="professional">Professional</SelectItem>
                                                <SelectItem value="creative">Creative</SelectItem>
                                                <SelectItem value="executive">Executive</SelectItem>
                                                <SelectItem value="minimalist">Minimalist</SelectItem>
                                                <SelectItem value="technology">Technology</SelectItem>
                                                <SelectItem value="academic">Academic</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Description</label>
                                    <Input placeholder="Brief description of the template" />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <Button variant="outline">Save as Draft</Button>
                                    <Button>
                                        <Edit3 className="h-4 w-4 mr-2" />
                                        Start Editing
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {templateStats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Template Management */}
            <Tabs defaultValue="gallery" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="gallery">Template Gallery</TabsTrigger>
                    <TabsTrigger value="editor">Visual Editor</TabsTrigger>
                </TabsList>

                <TabsContent value="gallery" className="space-y-6">
                    {/* Filters */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search templates..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="w-full lg:w-40">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        <SelectItem value="professional">Professional</SelectItem>
                                        <SelectItem value="creative">Creative</SelectItem>
                                        <SelectItem value="executive">Executive</SelectItem>
                                        <SelectItem value="minimalist">Minimalist</SelectItem>
                                        <SelectItem value="technology">Technology</SelectItem>
                                        <SelectItem value="academic">Academic</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full lg:w-40">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Template Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredTemplates.map((template) => (
                            <Card key={template.id} className="hover:shadow-lg transition-shadow group">
                                <CardContent className="p-0">
                                    <div className="relative">
                                        <div className="aspect-[3/4] bg-gray-100 rounded-t-lg overflow-hidden">
                                            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                                                <Layout className="h-16 w-16 text-gray-400" />
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-t-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <div className="flex space-x-2">
                                                <Button size="sm" variant="secondary">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="secondary">
                                                    <Edit3 className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="secondary">
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="absolute top-2 right-2">
                                            {getStatusBadge(template.status)}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-gray-900 truncate">{template.name}</h3>
                                            <Badge variant="outline" className="text-xs">
                                                {template.category}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span>{template.usage.toLocaleString()} uses</span>
                                            <div className="flex items-center">
                                                <span className="text-yellow-500 mr-1">★</span>
                                                <span>{template.rating}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                                            <span className="text-xs text-gray-500">
                                                Modified {template.lastModified}
                                            </span>
                                            <Button variant="ghost" size="sm">
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="editor" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Palette className="h-5 w-5" />
                                <span>Visual Template Editor</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
                                {/* Editor Toolbar */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <h3 className="font-medium text-gray-900">Layout</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button variant="outline" size="sm">Single Column</Button>
                                            <Button variant="outline" size="sm">Two Column</Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-medium text-gray-900">Colors</h3>
                                        <div className="grid grid-cols-4 gap-2">
                                            {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-500'].map((color, index) => (
                                                <div key={index} className={`w-8 h-8 rounded ${color} cursor-pointer hover:scale-110 transition-transform`}></div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-medium text-gray-900">Typography</h3>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Font Family" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="inter">Inter</SelectItem>
                                                <SelectItem value="roboto">Roboto</SelectItem>
                                                <SelectItem value="opensans">Open Sans</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button className="w-full">
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </Button>
                                </div>

                                {/* Preview Area */}
                                <div className="lg:col-span-3">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg h-full flex items-center justify-center bg-gray-50">
                                        <div className="text-center">
                                            <Layout className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Template Preview</h3>
                                            <p className="text-gray-600">Select a template to start editing</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
