const AdminTableSkeleton = () => {
  return Array.from({ length: 5 }).map((_, index) => (
    <tr
      key={index}
      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      {/* User Column */}
      <td className="py-4 px-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="space-y-2">
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </td>

      {/* Role Column */}
      <td className="py-4 px-6">
        <div className="space-y-2">
          <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-40 h-3 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </td>

      {/* Status Column */}
      <td className="py-4 px-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </td>

      {/* Join Date Column */}
      <td className="py-4 px-6">
        <div className="w-28 h-4 bg-gray-200 rounded animate-pulse"></div>
      </td>

      {/* Actions Column */}
      <td className="py-4 px-6">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
          <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
        </div>
      </td>
    </tr>
  ));
};

export default AdminTableSkeleton;