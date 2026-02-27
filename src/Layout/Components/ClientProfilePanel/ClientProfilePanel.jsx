import { X, Mail } from "lucide-react";

const ClientProfilePanel = ({ user, onClose }) => {
  return (
    <div className="h-full w-full bg-white shadow-xl overflow-hidden flex flex-col rounded-2xl">
      {/* Header */}
      <div className="p-6 border-b flex items-center justify-between bg-toiral-dark text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold">My Profile</p>
            <p className="text-xs opacity-70">Account settings</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-xl transition-all"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-8">
        <div className="text-center">
          <img
            src={user.avatar}
            alt="profile"
            className="w-24 h-24 rounded-3xl mx-auto shadow-xl border-4 border-white"
          />
          <h2 className="text-2xl font-bold mt-4 text-toiral-dark">
            {user.name}
          </h2>
          <p className="text-toiral-primary font-medium">Client</p>
        </div>

        <div className="bg-toiral-light/30 rounded-3xl p-5 space-y-4">
          <div className="flex gap-3">
            <Mail className="w-5 h-5 text-toiral-primary mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-5 h-5 text-toiral-primary mt-0.5">📍</div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">Dhaka, Bangladesh</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-5 h-5 text-toiral-primary mt-0.5">📅</div>
            <div>
              <p className="text-sm text-gray-500">Member since</p>
              <p className="font-medium">February 2025</p>
            </div>
          </div>
        </div>

        <button className="w-full bg-toiral-primary text-white py-4 rounded-3xl font-semibold hover:bg-toiral-primary/90 transition">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ClientProfilePanel;