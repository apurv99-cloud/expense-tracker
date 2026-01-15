import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { FaUserTie, FaBriefcase, FaSignOutAlt } from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/auth/getUser");
      setUser(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // 🔑 JWT remove
    navigate("/auth/login");
  };

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-20">Loading profile...</p>
    );

  if (!user)
    return (
      <p className="text-center text-red-500 mt-20">Failed to load profile</p>
    );

  return (
    <div className="flex justify-center mt-8 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6">
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <img
            src={
              user.profileImageUrl ||
              `https://ui-avatars.com/api/?name=${user.fullName}&background=875cf5&color=fff`
            }
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-[#875cf5] shadow"
          />
        </div>

        {/* Name */}
        <h2 className="text-xl font-bold text-center text-gray-800">
          {user.fullName}
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">{user.email}</p>

        {/* Professional Info */}
        <div className="space-y-4 text-sm text-gray-700 mb-6">
          <div className="flex items-center gap-3">
            <FaUserTie className="text-[#875cf5]" />
            <div>
              <p className="font-medium">Profession</p>
              <p className="text-gray-500">
                {user.profession || "Software Developer"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FaBriefcase className="text-[#875cf5]" />
            <div>
              <p className="font-medium">Role</p>
              <p className="text-gray-500">
                {user.roleDescription || "Building scalable web applications"}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2
                     py-2.5 rounded-xl bg-red-500 text-white
                     hover:bg-red-600 transition mb-3"
        >
          <FaSignOutAlt />
          Logout
        </button>

        <button
          disabled
          className="w-full py-2 rounded-xl
                     bg-gray-200 text-gray-500 cursor-not-allowed"
        >
          Edit Profile (Coming Soon)
        </button>
      </div>
    </div>
  );
};

export default Profile;
