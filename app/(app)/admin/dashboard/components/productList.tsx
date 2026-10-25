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
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { create } from "domain";

type ProductFormValues = {
    title: string;
    price: number;
    description?: string;
};

export default function ProductList() {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
    const [isOpenEditPopup, setIsOpenEditPopup] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
        null,
    );

    // React Hook Form (No Zod)
    const addForm = useForm<ProductFormValues>({
        defaultValues: { title: "", price: 0, description: "" },
    });

    const editForm = useForm<ProductFormValues>();

    useEffect(() => {
        async function fetchProducts() {
            try {
                const data = await getProducts("admin");
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
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
        await createProduct("admin", {
            ...values,
            price: Number(values.price),
            filePath: null,
        });
        setIsOpenAddModal(false);
        addForm.reset();
        setLoading(true);
    };

    const onEditSubmit = async (values: ProductFormValues) => {
        if (selectedProduct) {
            await updateProduct(selectedProduct.id, "admin", {
                ...values,
                price: Number(values.price),
                filePath: null,
            });
        }
        setIsOpenEditPopup(false);
        setLoading(true);
    };

    const openEditModal = (product: ProductType) => {
        setSelectedProduct(product);
        setIsOpenEditPopup(true);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Header / Actions */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Products
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your store products and inventory.
                    </p>
                </div>
                <Button onClick={() => setIsOpenAddModal(true)}>
                    Add Product
                </Button>
            </div>

            {/* Loading State with Skeletons */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-xl" />
                    ))}
                </div>
            ) : (
                /* Product Grid / Cards */
                <div className="grid gap-4">
                    {products.toReversed().map((product, index) => (
                        <Card
                            key={index}
                            className="relative p-6 pr-24 space-y-2"
                        >
                            {/* Upper-right Edit Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="absolute top-4 right-4"
                                onClick={() => openEditModal(product)}
                            >
                                Edit
                            </Button>

                            {/* Card Content */}
                            <h3 className="font-semibold text-lg">
                                {product.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {product.description}
                            </p>
                            <span className="inline-block text-sm font-medium text-primary">
                                ${product.price}
                            </span>
                        </Card>
                    ))}
                </div>
            )}

            {/* --- ADD PRODUCT DIALOG --- */}
            <Dialog open={isOpenAddModal} onOpenChange={setIsOpenAddModal}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={addForm.handleSubmit(onAddSubmit)}
                        className="space-y-4 py-2"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Product name"
                                {...addForm.register("title", {
                                    required: true,
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...addForm.register("price", {
                                    required: true,
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Product details..."
                                rows={3}
                                {...addForm.register("description")}
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpenAddModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Save Product</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* --- EDIT PRODUCT DIALOG --- */}
            <Dialog open={isOpenEditPopup} onOpenChange={setIsOpenEditPopup}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={editForm.handleSubmit(onEditSubmit)}
                        className="space-y-4 py-2"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Title</Label>
                            <Input
                                id="edit-title"
                                {...editForm.register("title", {
                                    required: true,
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-price">Price</Label>
                            <Input
                                id="edit-price"
                                type="number"
                                step="0.01"
                                {...editForm.register("price", {
                                    required: true,
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">
                                Description
                            </Label>
                            <Textarea
                                id="edit-description"
                                rows={3}
                                {...editForm.register("description")}
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpenEditPopup(false)}
                            >
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
