import { useQuery, useMutation } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AllAdvertisements = () => {
    const axiosSecure = useAxiosSecure();
    const [statusChangingId, setStatusChangingId] = useState(null);
    const [newStatus, setNewStatus] = useState("");

    const {
        data: advertisements = [],
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["all-advertisements"],
        queryFn: async () => {
            const res = await axiosSecure.get("/advertisements/all");
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

    // ✅ Status update mutation
    const statusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            const res = await axiosSecure.patch(`/advertisements/${id}/status`, { status });
            return res.data;
        },
        onSuccess: () => {
            toast.success("Status updated successfully! ✅");
            setStatusChangingId(null);
            setNewStatus("");
            refetch();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update status");
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

    // ✅ Handle status change
    const handleStatusChange = (id, currentStatus) => {
        setStatusChangingId(id);
        setNewStatus(currentStatus);
    };

    const submitStatusChange = () => {
        statusMutation.mutate({ id: statusChangingId, status: newStatus });
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
                        📢 All Advertisements
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Manage and moderate vendor advertisements
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
                                <th className="py-3 px-4 text-left">Ad Title</th>
                                <th className="py-3 px-4 text-left">Vendor</th>
                                <th className="py-3 px-4 text-left">Description</th>
                                <th className="py-3 px-4 text-left">Image</th>
                                <th className="py-3 px-4 text-left">Status</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {advertisements.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-10 text-gray-500">
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
                                            <td className="py-3 px-4 text-gray-600">
                                                {idx + 1}
                                            </td>

                                            {/* Ad Title */}
                                            <td className="py-3 px-4 font-semibold text-gray-800">
                                                {ad.adTitle}
                                            </td>

                                            {/* Vendor */}
                                            <td className="py-3 px-4 text-gray-600">
                                                {ad.vendorName || "N/A"}
                                            </td>

                                            {/* Description */}
                                            <td className="py-3 px-4 text-gray-600 truncate max-w-xs">
                                                {ad.shortDescription}
                                            </td>

                                            {/* Image */}
                                            <td className="py-3 px-4">
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
                                            <td className="py-3 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    ad.status === "approved"
                                                        ? "bg-green-100 text-green-700"
                                                        : ad.status === "rejected"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}>
                                                    {ad.status}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3 px-4">
                                                <div className="flex flex-wrap gap-1">
                                                    <button
                                                        onClick={() => handleStatusChange(ad._id, ad.status)}
                                                        className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                                                    >
                                                        Change Status
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(ad._id)}
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

            {/* Status Change Modal */}
            {statusChangingId && (
                <div className="fixed inset-0  bg-opacity-10 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">
                            🔄 Change Advertisement Status
                        </h2>
                        
                        <div className="space-y-4">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700 mb-2 block">Select Status</span>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                >
                                    <option value="">-- Select Status --</option>
                                    <option value="pending">⏳ Pending</option>
                                    <option value="approved">✅ Approved</option>
                                    <option value="rejected">❌ Rejected</option>
                                </select>
                            </label>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={submitStatusChange}
                                disabled={statusMutation.isPending || !newStatus}
                                className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                            >
                                {statusMutation.isPending ? "Updating..." : "Update Status"}
                            </button>
                            <button
                                onClick={() => {
                                    setStatusChangingId(null);
                                    setNewStatus("");
                                }}
                                className="flex-1 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Toaster position="top-right" />
        </div>
    );
};

export default AllAdvertisements;
