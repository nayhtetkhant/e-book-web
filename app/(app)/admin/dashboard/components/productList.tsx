"use client";

import { ProductType } from "@/app/(app)/user/dashboard/components/product";
import {
    createProduct,
    getProducts,
    updateProduct,
} from "@/app/actions/shared/product";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Edit3 } from "lucide-react";

type ProductFormValues = {
    title: string;
    price: number;
    description?: string;
    file?: FileList;
    fileType?: string;
};

export default function ProductList() {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
    const [isOpenEditPopup, setIsOpenEditPopup] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

    // React Hook Form
    const addForm = useForm<ProductFormValues>({
        defaultValues: { title: "", price: 0, description: "" },
    });

    const editForm = useForm<ProductFormValues>();

    // Fetch products on mount or when loading state triggers refetch
    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await getProducts("admin");
                const data = response?.data ?? response;
                setProducts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [loading]);

    useEffect(() => {
        if (selectedProduct) {
            editForm.reset({
                title: selectedProduct.title,
                price: selectedProduct.price,
                description: selectedProduct.description || "",
            });
        }
    }, [selectedProduct, editForm]);

    const onAddSubmit = async (values: ProductFormValues) => {
        try {
            const file = values.file?.[0];
            
            const response = await createProduct("admin", {
                title: values.title,
                price: Number(values.price),
                description: values.description,
                fileType: file ? file.type : null,
            });
    
            console.log("Full Response:", response);
    
            // 2. Extract the upload url and headers from the response structure shown in your console
            const uploadData = response?.uploadUrl;
            const presignedUrl = uploadData?.url?.url ?? uploadData?.url; // Handles string or nested object
    
            // 3. If a file was selected and we got a presigned URL, upload directly to S3 via PUT
            if (file && presignedUrl) {
                const s3UploadRes = await fetch(presignedUrl, {
                    method: "PUT",
                    headers: {
                        "Content-Type": file.type,
                    },
                    body: file,
                });
    
                if (!s3UploadRes.ok) {
                    console.error("Failed to upload file directly to S3");
                } else {
                    console.log("File successfully uploaded to S3!");
                }
            }
    
            setIsOpenAddModal(false);
            addForm.reset();
            setLoading(true);
        } catch (error) {
            console.error("Failed to create product:", error);
        }
    };

    const onEditSubmit = async (values: ProductFormValues) => {
        if (selectedProduct) {
            try {
                await updateProduct(selectedProduct.id, "admin", {
                    title: values.title,
                    price: Number(values.price),
                    description: values.description,
                });
                setIsOpenEditPopup(false);
                setLoading(true); // Triggers re-fetch
            } catch (error) {
                console.error("Failed to update product:", error);
            }
        }
    };

    const openEditModal = (product: ProductType) => {
        setSelectedProduct(product);
        setIsOpenEditPopup(true);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            {/* Header & Actions */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Products Management</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your digital products, pricing, and downloadable files.
                    </p>
                </div>
                <Button onClick={() => setIsOpenAddModal(true)} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Product
                </Button>
            </div>

            {/* Loading State with Skeletons */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-28 w-full rounded-xl" />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <Card className="p-10 text-center text-muted-foreground border-dashed">
                    No products found. Click "Add Product" to create one.
                </Card>
            ) : (
                /* Product Grid / Cards */
                <div className="grid gap-4">
                    {products.toReversed().map((product) => (
                        <Card key={product.id} className="relative p-6 transition hover:shadow-md">
                            {/* Upper-right Edit Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="absolute top-6 right-6 flex items-center gap-1.5"
                                onClick={() => openEditModal(product)}
                            >
                                <Edit3 className="w-3.5 h-3.5" /> Edit
                            </Button>

                            {/* Card Content */}
                            <div className="space-y-2 pr-28">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-semibold text-xl">{product.title}</h3>
                                    <Badge variant="secondary" className="font-mono text-xs">
                                        ${product.price}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {product.description || "No description provided."}
                                </p>
                                {product.filePath && (
                                    <div className="flex items-center gap-1.5 text-xs text-primary font-medium pt-1">
                                        <FileText className="w-3.5 h-3.5" /> Attached file configured
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* --- ADD PRODUCT DIALOG --- */}
            <Dialog open={isOpenAddModal} onOpenChange={setIsOpenAddModal}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g. Master Next.js & Laravel"
                                {...addForm.register("title", { required: true })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                placeholder="29.99"
                                {...addForm.register("price", { required: true })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Write a short summary..."
                                rows={3}
                                {...addForm.register("description")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="file">Product File / eBook (Image/PDF)</Label>
                            <Input
                                id="file"
                                type="file"
                                {...addForm.register("file")}
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsOpenAddModal(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Save Product</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* --- EDIT PRODUCT DIALOG --- */}
            <Dialog open={isOpenEditPopup} onOpenChange={setIsOpenEditPopup}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Title</Label>
                            <Input
                                id="edit-title"
                                {...editForm.register("title", { required: true })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-price">Price ($)</Label>
                            <Input
                                id="edit-price"
                                type="number"
                                step="0.01"
                                {...editForm.register("price", { required: true })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                rows={3}
                                {...editForm.register("description")}
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsOpenEditPopup(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Update Product</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}