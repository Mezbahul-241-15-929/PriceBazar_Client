import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MyProducts = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        itemName: "",
        marketName: "",
        image: "",
        price: "",
        description: "",
        date: "",
    });


    const {
        data: products = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["my-products", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/products?email=${user.email}`
            );
            return res.data;
        },
    });

    // ✅ Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            // Verify product belongs to current user
            const product = products.find(p => p._id === id);
            if (product && product.vendorEmail !== user.email) {
                throw new Error('You can only delete your own products');
            }
            
            const res = await axiosSecure.delete(`/products/${id}`, {
                data: { vendorEmail: user.email }
            });
            return res.data;
        },
        onSuccess: () => {
            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Product removed successfully",
                timer: 1500,
                showConfirmButton: false,
            });
            refetch();
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: error.message || "Failed to delete product",
            });
        }
    });

    // ✅ Update mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, payload }) => {
            // Verify product belongs to current user
            const product = products.find(p => p._id === id);
            if (product && product.vendorEmail !== user.email) {
                throw new Error('You can only edit your own products');
            }
            
            console.log("Sending PUT request with payload:", payload);
            const res = await axiosSecure.put(`/products/${id}`, payload);
            console.log("Response:", res.data);
            return res.data;
        },
        onSuccess: (data) => {
            console.log("Update successful:", data);
            toast.success("Product updated successfully! 🎉");
            setEditingId(null);
            refetch();
        },
        onError: (error) => {
            console.error("Update error:", error);
            toast.error(error.message || error.response?.data?.message || "Failed to update product");
        },
    });

    // ✅ Handle delete
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This product will be deleted permanently!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(id);
            }
        });
    };

    // ✅ Handle edit open - Load product data into form
    const handleEditOpen = (product) => {
        const latestPrice = product.prices?.[product.prices.length - 1];
        setEditForm({
            itemName: product.itemName || "",
            marketName: product.marketName || "",
            image: product.image || "",
            price: latestPrice?.price ?? "",
            description: product.description || "",
            date: product.date || new Date().toISOString().split("T")[0],
        });
        setEditingId(product._id);
    };

    // ✅ Handle edit close
    const handleEditClose = () => {
        setEditingId(null);
        setEditForm({
            itemName: "",
            marketName: "",
            image: "",
            price: "",
            description: "",
            date: "",
        });
    };

    // ✅ Handle form field changes
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Handle edit form submit
    const handleEditSubmit = (e) => {
        e.preventDefault();
        const product = products.find((p) => p._id === editingId);
        if (!product) return;

        const latestPrice = product.prices?.[product.prices.length - 1];
        const newPrices = [...(product.prices || [])];
        
        // Add new price entry if price changed
        if (String(editForm.price) !== String(latestPrice?.price)) {
            newPrices.push({
                price: editForm.price,
                date: new Date().toISOString(),
            });
        }

        const payload = {
            ...product,
            itemName: editForm.itemName,
            marketName: editForm.marketName,
            image: editForm.image,
            description: editForm.description,
            date: editForm.date,
            prices: newPrices,
        };

        updateMutation.mutate({ id: editingId, payload });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <span className="loading loading-spinner text-primary"></span>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 w-full">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        📄 My Products
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Manage your posted products
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto w-full">

                    <table className="w-full text-sm">

                        <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">#</th>
                                <th className="py-3 px-4 text-left">Product</th>
                                <th className="py-3 px-4 text-left">Market</th>
                                <th className="py-3 px-4 text-left">Price</th>
                                <th className="py-3 px-4 text-left">Status</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-gray-500">
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                products.map((product, idx) => {
                                    const latestPrice =
                                        product.prices?.[product.prices.length - 1];

                                    return (
                                        <tr
                                            key={product._id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition"
                                        >
                                            <td className="py-3 px-4 text-gray-600">
                                                {idx + 1}
                                            </td>

                                            {/* Product */}
                                            <td className="py-3 px-4 flex items-center gap-3">
                                                <img
                                                    src={product.image}
                                                    alt={product.itemName}
                                                    className="w-10 h-10 rounded object-cover border"
                                                />
                                                <span className="font-semibold text-gray-800">
                                                    {product.itemName}
                                                </span>
                                            </td>

                                            {/* Market */}
                                            <td className="py-3 px-4 text-gray-600">
                                                {product.marketName}
                                            </td>

                                            {/* Price */}
                                            <td className="py-3 px-4 text-gray-700 font-medium">
                                                ৳{latestPrice?.price}
                                            </td>

                                            {/* Status */}
                                            <td className="py-3 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.status === "approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                    }`}>
                                                    {product.status}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3 px-4 flex gap-2">

                                                {/* Edit */}
                                                <button
                                                    onClick={() => handleEditOpen(product)}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600"
                                                >
                                                    Edit
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>

                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>

                    </table>

                </div>
            </div>

            {/* Edit Modal Popup */}
            {editingId && (
                <div className="fixed inset-0 border-black border bg-opacity-10 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 sm:p-8">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                                ✏️ Edit Product
                            </h2>
                            
                            <form onSubmit={handleEditSubmit} className="space-y-6">

                                {/* Market Info */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="marketName"
                                        value={editForm.marketName}
                                        onChange={handleEditChange}
                                        placeholder="🏪 Market Name"
                                        className="input"
                                        required
                                    />

                                    <input
                                        type="date"
                                        name="date"
                                        value={editForm.date}
                                        onChange={handleEditChange}
                                        className="input"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <textarea
                                    name="description"
                                    value={editForm.description}
                                    onChange={handleEditChange}
                                    placeholder="📝 Market Description"
                                    className="input h-24"
                                />

                                {/* Item + Image */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="itemName"
                                        value={editForm.itemName}
                                        onChange={handleEditChange}
                                        placeholder="🥦 Item Name"
                                        className="input"
                                        required
                                    />

                                    <input
                                        type="text"
                                        name="image"
                                        value={editForm.image}
                                        onChange={handleEditChange}
                                        placeholder="🖼️ Image URL"
                                        className="input"
                                    />
                                </div>

                                {/* Image Preview */}
                                {editForm.image && (
                                    <div className="flex justify-center">
                                        <img 
                                            src={editForm.image} 
                                            alt="preview" 
                                            className="w-32 h-32 rounded-lg object-cover border-2 border-gray-300"
                                        />
                                    </div>
                                )}

                                {/* Price */}
                                <input
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    value={editForm.price}
                                    onChange={handleEditChange}
                                    placeholder="💵 Today Price"
                                    className="input"
                                    required
                                />

                                {/* Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={updateMutation.isPending}
                                        className="cursor-pointer flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {updateMutation.isPending ? "Saving..." : "Save Changes"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleEditClose}
                                        className="cursor-pointer flex-1 py-3 bg-gray-300 text-gray-800 rounded-xl font-semibold hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <style>
                {`
                    .input {
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #e5e7eb;
                        border-radius: 10px;
                        outline: none;
                    }
                    .input:focus {
                        border-color: #3b82f6;
                        box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
                    }
                `}
            </style>
            <Toaster position="top-right" />
        </div>
    );
};

export default MyProducts;