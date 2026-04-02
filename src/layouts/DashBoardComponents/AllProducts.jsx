import { useQuery, useMutation } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AllProducts = () => {
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
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectReason, setRejectReason] = useState("");

    const {
        data: products = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["all-products"],
        queryFn: async () => {
            const res = await axiosSecure.get("/products/all");
            return res.data;
        },
    });

    // ✅ Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.delete(`/products/${id}`);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Product deleted successfully! 🗑️");
            refetch();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete product");
        },
    });

    // ✅ Update mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, payload }) => {
            const res = await axiosSecure.put(`/products/${id}`, payload);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Product updated successfully! 🎉");
            setEditingId(null);
            refetch();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update product");
        },
    });

    // ✅ Approve mutation
    const approveMutation = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.patch(`/products/${id}/status`, { status: "approved" });
            return res.data;
        },
        onSuccess: () => {
            toast.success("Product approved! ✅");
            refetch();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to approve product");
        },
    });

    // ✅ Reject mutation
    const rejectMutation = useMutation({
        mutationFn: async ({ id, reason }) => {
            const res = await axiosSecure.patch(`/products/${id}/status`, { 
                status: "rejected",
                rejectionReason: reason 
            });
            return res.data;
        },
        onSuccess: () => {
            toast.success("Product rejected! ❌");
            setRejectingId(null);
            setRejectReason("");
            refetch();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to reject product");
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

    // ✅ Handle approve
    const handleApprove = (id) => {
        Swal.fire({
            title: "Approve Product?",
            text: "This product will be marked as approved.",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            confirmButtonText: "Yes, approve!",
        }).then((result) => {
            if (result.isConfirmed) {
                approveMutation.mutate(id);
            }
        });
    };

    // ✅ Handle reject
    const handleReject = (id) => {
        setRejectingId(id);
    };

    const submitReject = () => {
        if (!rejectReason.trim()) {
            toast.error("Please provide a rejection reason");
            return;
        }
        rejectMutation.mutate({ id: rejectingId, reason: rejectReason });
    };

    // ✅ Handle edit open
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

    // ✅ Handle form change
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Handle edit submit
    const handleEditSubmit = (e) => {
        e.preventDefault();
        const product = products.find((p) => p._id === editingId);
        if (!product) return;

        const latestPrice = product.prices?.[product.prices.length - 1];
        const newPrices = [...(product.prices || [])];
        
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
                        📦 All Products
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Manage and approve vendor products
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
                                <th className="py-3 px-4 text-left">Vendor</th>
                                <th className="py-3 px-4 text-left">Market</th>
                                <th className="py-3 px-4 text-left">Price</th>
                                <th className="py-3 px-4 text-left">Status</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-10 text-gray-500">
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                products.map((product, idx) => {
                                    const latestPrice = product.prices?.[product.prices.length - 1];

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

                                            {/* Vendor */}
                                            <td className="py-3 px-4 text-gray-600">
                                                {product.vendorName || "N/A"}
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
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    product.status === "approved"
                                                        ? "bg-green-100 text-green-700"
                                                        : product.status === "rejected"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}>
                                                    {product.status}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3 px-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {product.status === "pending" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(product._id)}
                                                                className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(product._id)}
                                                                className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => handleEditOpen(product)}
                                                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product._id)}
                                                        className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>

                    </table>

                </div>
            </div>

            {/* Edit Modal */}
            {editingId && (
                <div className="fixed inset-0  bg-opacity-10 flex items-center justify-center z-50 p-4">
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

            {/* Reject Modal */}
            {rejectingId && (
                <div className="fixed inset-0  bg-opacity-10 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                            ❌ Reject Product
                        </h2>
                        
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Please provide a reason for rejection..."
                            className="w-full p-3 border border-gray-300 rounded-lg mb-4 h-24"
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={submitReject}
                                disabled={rejectMutation.isPending}
                                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 font-semibold"
                            >
                                {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                            </button>
                            <button
                                onClick={() => {
                                    setRejectingId(null);
                                    setRejectReason("");
                                }}
                                className="flex-1 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold"
                            >
                                Cancel
                            </button>
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

export default AllProducts;
