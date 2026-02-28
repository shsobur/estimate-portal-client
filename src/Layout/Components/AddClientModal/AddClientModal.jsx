// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const AddClientModal = ({ onClose }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Real submit logic later
    onClose();
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-3xl p-6 w-full max-w-5xl mx-4 shadow-2xl"
    >
      <h2 className="text-2xl font-bold text-toiral-dark mb-6">
        Add New Client
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Client Name"
          required
          className="w-full bg-toiral-light border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-toiral-primary"
        />
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full bg-toiral-light border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-toiral-primary"
        />
        <select
          required
          className="w-full bg-toiral-light border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-toiral-primary"
        >
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Stop">Stop</option>
          <option value="Complete">Complete</option>
        </select>
        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-2xl transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-toiral-primary hover:bg-toiral-primary/90 text-white py-3 rounded-2xl transition-all"
          >
            Save Client
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddClientModal;
