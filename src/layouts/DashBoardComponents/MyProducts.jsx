import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Link } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MyProducts = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();


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
            const res = await axiosSecure.delete(`/products/${id}`);
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
                                                <Link
                                                    to={`/dashboard/edit-product/${product._id}`}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs"
                                                >
                                                    Edit
                                                </Link>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs"
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
        </div>
    );
};

export default MyProducts;