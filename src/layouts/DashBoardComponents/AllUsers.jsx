import { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");

    // ✅ Fetch users
    const { data: users = [], isLoading, isError } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users");
            return res.data;
        },
    });

    // ✅ Update role mutation
    const updateRoleMutation = useMutation({
        mutationFn: async ({ id, role }) => {
            const res = await axiosSecure.patch(`/users/${id}`, { role });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]); // 🔥 refetch instantly
        },
    });

    const handleRoleChange = (id, role) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Do you want to change role to "${role}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, change it!",
        }).then((result) => {
            if (result.isConfirmed) {
                updateRoleMutation.mutate({ id, role });

                Swal.fire({
                    title: "Updated!",
                    text: "User role has been updated.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        });
    };

    // ✅ Search filter
    const filteredUsers = users.filter(
        (u) =>
            u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading)
        return <p className="text-center py-10 text-gray-500">Loading users...</p>;

    if (isError)
        return <p className="text-center py-10 text-red-500">Failed to load users</p>;

    return (
        <div className="p-4 md:p-6 w-full">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        All Users
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Manage all registered users
                    </p>
                </div>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-72"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto w-full">
                    <table className="w-full min-w-full text-sm">
                        <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">#</th>
                                <th className="py-3 px-4 text-left">User</th>
                                <th className="py-3 px-4 text-left">Email</th>
                                <th className="py-3 px-4 text-left">Role</th>
                                <th className="py-3 px-4 text-left">Created At</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, idx) => (
                                    <tr
                                        key={user._id}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                                    >
                                        <td className="py-3 px-4 text-gray-600">
                                            {idx + 1}
                                        </td>

                                        {/* User */}
                                        <td className="py-3 px-4 flex items-center gap-3">
                                            <img
                                                src={user.photoURL}
                                                alt={user.displayName}
                                                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                            />
                                            <span className="font-semibold text-gray-800">
                                                {user.displayName}
                                            </span>
                                        </td>

                                        <td className="py-3 px-4 text-gray-600">
                                            {user.email}
                                        </td>

                                        {/* Role Dropdown */}
                                        <td className="py-3 px-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) =>
                                                    handleRoleChange(user._id, e.target.value)
                                                }
                                                className="px-2 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="user">User</option>
                                                <option value="vendor">Vendor</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>

                                        <td className="py-3 px-4 text-gray-500">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString()
                                                : "N/A"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllUsers;