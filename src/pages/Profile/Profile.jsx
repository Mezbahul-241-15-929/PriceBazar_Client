import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Profile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [draft, setDraft] = useState({});
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // 🔥 GET USER
  const { data: profile = {}, isLoading } = useQuery({
    queryKey: ["profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  // 🔥 Populate draft when profile changes
  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  // 🔥 UPDATE USER
  const mutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosSecure.put(`/users/${user.email}`, updatedData);
      return res.data;
    },
    onSuccess: (updatedProfile) => {
      setSaving(false);
      setEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully." });

      // ✅ Update cache instantly
      queryClient.setQueryData(["profile", user.email], updatedProfile);

      // ✅ Optional: refetch in background
      queryClient.invalidateQueries(["profile", user.email]);
    },
  });

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  const startEdit = () => {
    setDraft(profile);
    setEditing(true);
    setMessage(null);
  };

  const cancelEdit = () => {
    setDraft(profile);
    setEditing(false);
    setMessage(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDraft((s) => ({ ...s, [name]: value }));
  };

  const saveChanges = () => {
    setSaving(true);
    mutation.mutate(draft);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden border">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6">

          {/* Avatar + Role */}
          <div className="flex-shrink-0 flex flex-col items-center md:items-start">
            <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden ring-1 ring-gray-100 shadow">
              <img
                src={editing ? draft.photoURL : profile.photoURL}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-4 flex flex-col items-center md:items-start">
              <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                Account Role
              </div>

              <span className="inline-flex px-4 py-1.5 rounded-full 
                bg-gradient-to-r from-indigo-500 to-purple-600 
                text-white text-sm font-semibold shadow-md">
                {profile.role}
              </span>
            </div>
          </div>

          {/* Profile Info + Actions */}
          <div className="flex-1 w-full">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                  {profile.displayName}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Member since {formatDate(profile.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {message && (
                  <div className="px-3 py-1 rounded-md text-sm bg-green-50 text-green-700">
                    {message.text}
                  </div>
                )}

                {!editing ? (
                  <button
                    onClick={startEdit}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow hover:opacity-95 transition"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={saveChanges}
                      disabled={saving}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg shadow disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      disabled={saving}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Form */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full name
                  </label>
                  {editing ? (
                    <input
                      name="displayName"
                      value={draft.displayName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
                    />
                  ) : (
                    <div className="mt-1 text-gray-800">
                      {profile.displayName}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1 text-gray-800">
                    {profile.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Avatar URL
                  </label>
                  {editing ? (
                    <input
                      name="photoURL"
                      value={draft.photoURL}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
                    />
                  ) : (
                    <div className="mt-1 text-gray-800 break-all">
                      {profile.photoURL}
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;