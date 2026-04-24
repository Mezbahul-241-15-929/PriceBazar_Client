import { useQuery, useMutation } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const MyAdvertisements = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        adTitle: "",
        shortDescription: "",
        image: "",
    });

    const {
        data: advertisements = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["my-advertisements", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/advertisements?email=${user.email}`
            );
            return res.data;
        },
    });

    // ✅ Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const res = await axiosSecure.delete(`/advertisements/${id}`);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Advertisement deleted successfully! 🗑️");
            refetch();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete advertisement");
        },
    });

    // ✅ Update mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, payload }) => {
            console.log("Sending PUT request with payload:", payload);
            const res = await axiosSecure.put(`/advertisements/${id}`, payload);
            console.log("Response:", res.data);
            return res.data;
        },
        onSuccess: (data) => {
            console.log("Update successful:", data);
            toast.success("Advertisement updated successfully! 🎉");
            setEditingId(null);
            refetch();
        },
        onError: (error) => {
            console.error("Update error:", error);
            toast.error(error.response?.data?.message || "Failed to update advertisement");
        },
    });

    // ✅ Handle delete
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This advertisement will be deleted permanently!",
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

    // ✅ Handle edit open - Load advertisement data into form
    const handleEditOpen = (advertisement) => {
        setEditForm({
            adTitle: advertisement.adTitle || "",
            shortDescription: advertisement.shortDescription || "",
            image: advertisement.image || "",
        });
        setEditingId(advertisement._id);
    };

    // ✅ Handle edit close
    const handleEditClose = () => {
        setEditingId(null);
        setEditForm({
            adTitle: "",
            shortDescription: "",
            image: "",
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
        const advertisement = advertisements.find((a) => a._id === editingId);
        if (!advertisement) return;

        const payload = {
            ...advertisement,
            adTitle: editForm.adTitle,
            shortDescription: editForm.shortDescription,
            image: editForm.image,
            updatedAt: new Date(),
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
                        📢 My Advertisements
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Manage your posted advertisements
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto w-full">

                    <table className="w-full text-sm min-w-max">

                        <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white sticky top-0">
                            <tr>
                                <th className="py-3 px-3 text-left whitespace-nowrap w-12">#</th>
                                <th className="py-3 px-3 text-left whitespace-nowrap min-w-32">Ad Title</th>
                                <th className="py-3 px-3 text-left whitespace-nowrap min-w-40">Description</th>
                                <th className="py-3 px-3 text-left whitespace-nowrap w-16">Image</th>
                                <th className="py-3 px-3 text-left whitespace-nowrap w-24">Status</th>
                                <th className="py-3 px-3 text-left whitespace-nowrap min-w-32">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {advertisements.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-gray-500">
                                        No advertisements found
                                    </td>
                                </tr>
                            ) : (
                                advertisements.map((ad, idx) => {
                                    return (
                                        <tr
                                            key={ad._id}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition"
                                        >
                                            <td className="py-3 px-3 text-gray-600 whitespace-nowrap">
                                                {idx + 1}
                                            </td>

                                            {/* Ad Title */}
                                            <td className="py-3 px-3 font-semibold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                                                {ad.adTitle}
                                            </td>

                                            {/* Description */}
                                            <td className="py-3 px-3 text-gray-600 max-w-xs overflow-hidden text-ellipsis" title={ad.shortDescription}>
                                                {ad.shortDescription}
                                            </td>

                                            {/* Image */}
                                            <td className="py-3 px-3 whitespace-nowrap">
                                                {ad.image ? (
                                                    <img
                                                        src={ad.image}
                                                        alt={ad.adTitle}
                                                        className="w-12 h-12 rounded object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-gray-400 text-xs">No image</span>
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td className="py-3 px-3 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ad.status === "approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : ad.status === "rejected"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                    }`}>
                                                    {ad.status}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3 px-3 whitespace-nowrap">
                                                <div className="flex gap-1">

                                                    {/* Edit */}
                                                    <button
                                                        onClick={() => handleEditOpen(ad)}
                                                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition"
                                                    >
                                                        Edit
                                                    </button>

                                                    {/* Delete */}
                                                    <button
                                                        onClick={() => handleDelete(ad._id)}
                                                        className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition"
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

            {/* Edit Modal Popup */}
            {editingId && (
                <div className="fixed inset-0 bg-opacity-10 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 sm:p-8">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                                ✏️ Edit Advertisement
                            </h2>
                            
                            <form onSubmit={handleEditSubmit} className="space-y-6">

                                {/* Ad Title */}
                                <input
                                    type="text"
                                    name="adTitle"
                                    value={editForm.adTitle}
                                    onChange={handleEditChange}
                                    placeholder="📝 Advertisement Title"
                                    className="input"
                                    required
                                />

                                {/* Short Description */}
                                <textarea
                                    name="shortDescription"
                                    value={editForm.shortDescription}
                                    onChange={handleEditChange}
                                    placeholder="📄 Short Description"
                                    className="input h-24"
                                    required
                                />

                                {/* Image URL */}
                                <input
                                    type="text"
                                    name="image"
                                    value={editForm.image}
                                    onChange={handleEditChange}
                                    placeholder="🖼️ Image URL"
                                    className="input"
                                />

                                {/* Image Preview */}
                                {editForm.image && (
                                    <div className="flex justify-center">
                                        <img 
                                            src={editForm.image} 
                                            alt="preview" 
                                            className="w-40 h-32 rounded-lg object-cover border-2 border-gray-300"
                                        />
                                    </div>
                                )}

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

export default MyAdvertisements;
