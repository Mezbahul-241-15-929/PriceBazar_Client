import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import toast, { Toaster } from "react-hot-toast";

const AddAdvertisement = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      status: "pending",
    },
  });

  // ✅ Mutation for creating advertisement
  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.post("/advertisements", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Advertisement created successfully! 🎉");
      reset();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create advertisement");
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
          📢 Add Advertisement
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Vendor Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              value={user?.email || ""}
              readOnly
              className="input bg-gray-100"
              placeholder="Email"
            />
            <input
              value={user?.displayName || ""}
              readOnly
              className="input bg-gray-100"
              placeholder="Vendor Name"
            />
          </div>

          {/* Ad Title */}
          <input
            {...register("adTitle", { required: true })}
            placeholder="📝 Advertisement Title"
            className="input"
          />

          {/* Short Description */}
          <textarea
            {...register("shortDescription", { required: true })}
            placeholder="📄 Short Description"
            className="input h-24"
          />

          {/* Image URL */}
          <input
            {...register("image")}
            placeholder="🖼️ Image URL (Banner or Promotional Image)"
            className="input"
          />

          {/* Image Preview */}
          {/* Note: To show preview, you'd need to use useWatch or state */}

          {/* Submit */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="cursor-pointer w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {mutation.isPending ? "Creating..." : "Create Advertisement"}
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
      <Toaster position="top-right" />
    </div>
  );
};

export default AddAdvertisement;
