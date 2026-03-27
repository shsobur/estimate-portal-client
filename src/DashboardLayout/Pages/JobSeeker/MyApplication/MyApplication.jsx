import React from "react";
import {
  FaBriefcase,
  FaCalendar,
  FaTrash,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { MdEmail, MdBusiness } from "react-icons/md";

const MyApplication = () => {
  // Static data - 3 applications as requested
  const applications = [
    {
      id: 1,
      companyName: "TechCorp Solutions",
      jobTitle: "Frontend Developer",
      appliedDate: "2024-02-15",
      status: "pending",
      companyEmail: "hr@techcorp.com",
      location: "San Francisco, CA",
      salary: "$80,000 - $100,000",
    },
    {
      id: 2,
      companyName: "DesignStudio Inc",
      jobTitle: "UI/UX Designer",
      appliedDate: "2024-02-10",
      status: "accepted",
      companyEmail: "careers@designstudio.com",
      location: "Remote",
      salary: "$70,000 - $90,000",
    },
    {
      id: 3,
      companyName: "DataSystems LLC",
      jobTitle: "Data Analyst",
      appliedDate: "2024-02-05",
      status: "rejected",
      companyEmail: "jobs@datasystems.com",
      location: "New York, NY",
      salary: "$75,000 - $95,000",
    },
  ];

  // Pagination static data
  const totalPages = 3;

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Get status color and text
  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return { color: "bg-yellow-100 text-yellow-800", text: "Pending" };
      case "accepted":
        return { color: "bg-green-100 text-green-800", text: "Accepted" };
      case "rejected":
        return { color: "bg-red-100 text-red-800", text: "Rejected" };
      default:
        return { color: "bg-gray-100 text-gray-800", text: "Unknown" };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto p-4 md:p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My Applications
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-gray-600">
              Track all your job applications in one place
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Sobur Hossen</span>
              <span className="text-gray-400">•</span>
              <span className="flex items-center gap-1">
                <MdEmail className="text-xs" />
                soburfb567@gmail.com
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FaBriefcase className="text-blue-600 text-xl" />
              </div>
            </div>
            <div className="mt-3 text-sm text-green-600 font-medium">
              Last 30 days
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="w-6 h-6 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin"></div>
              </div>
            </div>
            <div className="mt-3 text-sm text-yellow-600 font-medium">
              Awaiting review
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Accepted</p>
                <p className="text-2xl font-bold text-gray-900">4</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="mt-3 text-sm text-green-600 font-medium">
              Interviews scheduled
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">33%</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <FaEye className="text-purple-600 text-xl" />
              </div>
            </div>
            <div className="mt-3 text-sm text-gray-500">
              4 out of 12 applications
            </div>
          </div>
        </div>

        {/* Applications Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          {/* Table Header for Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <MdBusiness />
                      Company & Position
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <FaCalendar />
                      Applied Date
                    </div>
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => {
                  const statusInfo = getStatusInfo(app.status);

                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {app.companyName}
                          </p>
                          <p className="text-gray-700">{app.jobTitle}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <MdEmail className="text-xs" />
                              {app.companyEmail}
                            </p>
                            <span className="text-gray-300">•</span>
                            <p className="text-sm text-gray-500">
                              {app.location}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-600">
                          {formatDate(app.appliedDate)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {app.salary}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
                        >
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <FaEye className="text-lg" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <FaTrash className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cards for Mobile/Tablet */}
          <div className="lg:hidden p-4">
            <div className="space-y-4">
              {applications.map((app) => {
                const statusInfo = getStatusInfo(app.status);

                return (
                  <div
                    key={app.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {app.companyName}
                        </h3>
                        <p className="text-gray-700">{app.jobTitle}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
                      >
                        {statusInfo.text}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MdEmail className="mr-2 text-gray-400" />
                        <span>{app.companyEmail}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaCalendar className="mr-2 text-gray-400" />
                        <span>{formatDate(app.appliedDate)}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {app.location} • {app.salary}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        Applied on {formatDate(app.appliedDate)}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                          <FaEye className="text-lg" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing 1 to {applications.length} of 12 applications
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <FaChevronLeft className="inline mr-1" />
              Previous
            </button>

            {/* Page numbers */}
            <div className="hidden sm:flex items-center space-x-1">
              <button className="w-10 h-10 bg-[#3c8f63] text-white rounded-lg font-medium">
                1
              </button>
              <button className="w-10 h-10 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="w-10 h-10 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                3
              </button>
              <span className="px-2 text-gray-400">...</span>
              <button className="w-10 h-10 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                5
              </button>
            </div>

            {/* Mobile page indicator */}
            <div className="sm:hidden text-sm text-gray-600">
              Page 1 of {totalPages}
            </div>

            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Next
              <FaChevronRight className="inline ml-1" />
            </button>
          </div>
        </div>

        {/* Empty State Example (commented out) */}
        {/* 
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl">
          <FaBriefcase className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No applications yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Start applying to jobs and track your progress here.
          </p>
          <button className="px-6 py-3 bg-[#3c8f63] text-white rounded-lg font-medium hover:bg-[#2a6b4a] transition-colors">
            Browse Jobs
          </button>
        </div>
        */}
      </div>
    </div>
  );
};

export default MyApplication;
