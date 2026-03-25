import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

const AddProduct = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      status: "pending",
    },
  });

  // ✅ Mutation
  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.post("/products", data);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Product Added!",
        text: "Your product has been successfully submitted.",
        timer: 2000,
        showConfirmButton: false,
      });
      reset();
    },
  });

  const onSubmit = (data) => {
    const finalData = {
      ...data,
      vendorEmail: user?.email,
      vendorName: user?.displayName,
      status: "pending",
    };

    mutation.mutate(finalData);
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6">
      <div className="bg-white shadow-xl rounded-2xl p-5 sm:p-8 border border-gray-100">

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          📝 Add Product
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Vendor Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              value={user?.email || ""}
              readOnly
              className="input"
            />
            <input
              value={user?.displayName || ""}
              readOnly
              className="input"
            />
          </div>

          {/* Market Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              {...register("marketName", { required: true })}
              placeholder="🏪 Market Name"
              className="input"
            />

            <input
              type="date"
              value={new Date().toISOString().split("T")[0]}
              readOnly
              className="input bg-gray-100"
            />
          </div>

          {/* Description */}
          <textarea
            {...register("description")}
            placeholder="📝 Market Description"
            className="input h-24"
          />

          {/* Item + Image */}
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              {...register("itemName", { required: true })}
              placeholder="🥦 Item Name"
              className="input"
            />

            <input
              {...register("image")}
              placeholder="🖼️ Image URL"
              className="input"
            />
          </div>

          {/* Price Per Unit */}
          <input
            {...register("pricePerUnit", { required: true })}
            placeholder="💵 Price per Unit (৳30/kg)"
            className="input"
          />

          {/* ✅ ONLY ONE PRICE INPUT */}
          <input
            type="number"
            {...register("price", { required: true })}
            placeholder="💵 Today Price"
            className="input"
          />

          {/* Submit */}
          <button
            type="submit"
            className="cursor-pointer w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90"
          >
            Submit Product
          </button>

        </form>
      </div>

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
    </div>
  );
};

export default AddProduct;