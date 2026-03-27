import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaSearch,
  FaFilter,
  FaBriefcase,
  FaMoneyBillWave,
  FaStar,
  FaTimes,
  FaClock,
  FaSpinner,
  FaSync,
} from "react-icons/fa";
import useAxios from "../../../Hooks/Axios";
import { Link } from "react-router";
import { AuthContext } from "../../../Context/AuthContext";
import useUserData from "../../../Hooks/userData";

const Jobs = () => {
  const api = useAxios();
  const { user } = useContext(AuthContext);
  const { profile } = useUserData();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filters state__
  const [filters, setFilters] = useState({
    workType: [],
    salaryRange: [0, 200000],
    experienceLevel: [],
  });

  // Filter options__
  const workTypes = ["Remote", "On-site", "Hybrid"];
  const experienceLevels = [
    "Junior Level",
    "Intermediate Level",
    "Senior Level",
    "Executive Level",
  ];

  // TanStack Query for fetching jobs__
  const {
    data: jobsData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["jobs", currentPage, searchInput, filters], // Cache key based on all parameters__
    queryFn: async () => {
      // Prepare API parameters
      const params = {
        page: currentPage,
        limit: 10,
      };

      // Add search if exists
      if (searchInput.trim()) {
        params.search = searchInput;
      }

      // Add work type filter
      if (filters.workType.length > 0) {
        params.workType = filters.workType.join(",");
      }

      // Add experience level filter__
      if (filters.experienceLevel.length > 0) {
        params.experienceLevel = filters.experienceLevel.join(",");
      }

      // Add salary range filter__
      if (filters.salaryRange[0] > 0 || filters.salaryRange[1] < 200000) {
        params.minSalary = filters.salaryRange[0].toString();
        params.maxSalary = filters.salaryRange[1].toString();
      }

      // Add user id__
      if (user) {
        params.userId = profile._id;
      }

      const response = await api.get(
        `/common-api/jobs?${new URLSearchParams(params)}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    cacheTime: 10 * 60 * 1000, // 10 minutes - cache duration
    keepPreviousData: true, // Smooth pagination
  });

  // Extract data from query result__
  const jobs = jobsData?.data || [];
  const pagination = jobsData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    hasNext: false,
    hasPrev: false,
  };

  // Handle search__
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
    // Query will auto-refetch because queryKey changed
  };

  // Handle filter changes__
  const handleWorkTypeChange = (type) => {
    const newWorkTypes = filters.workType.includes(type)
      ? filters.workType.filter((t) => t !== type)
      : [...filters.workType, type];

    setFilters((prev) => ({ ...prev, workType: newWorkTypes }));
  };

  const handleExperienceChange = (level) => {
    const newExperienceLevels = filters.experienceLevel.includes(level)
      ? filters.experienceLevel.filter((l) => l !== level)
      : [...filters.experienceLevel, level];

    setFilters((prev) => ({ ...prev, experienceLevel: newExperienceLevels }));
  };

  // Handle salary slider change__
  const handleSalaryChange = (newRange) => {
    setFilters((prev) => ({ ...prev, salaryRange: newRange }));
  };

  // Apply filters__
  const applyFilters = () => {
    setCurrentPage(1); // Reset to first page
    setIsFilterOpen(false);
    // Query will auto-refetch because filters changed
  };

  const clearAllFilters = () => {
    setFilters({
      workType: [],
      salaryRange: [0, 200000],
      experienceLevel: [],
    });
    // Don't refetch immediately - let user click apply
  };

  // Pagination handlers__
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
      // Query will auto-refetch because currentPage changed
    }
  };

  // Manual refresh__
  const handleRefresh = () => {
    refetch();
  };

  // Format salary display__
  const formatSalary = (job) => {
    if (job.salaryRange) {
      return `$${job.salaryRange.min.toLocaleString()} - $${job.salaryRange.max.toLocaleString()}/${
        job.salaryRange.period
      }`;
    }
    return "Salary not specified";
  };

  // Combined loading state__
  const loading = isLoading || isRefetching;

  return (
    <section className="bg-[#F8FAFC] min-h-screen">
      <div className="max-w-[1536px] mx-auto">
        {/* Mobile Filter Button */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-30">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-3 bg-[#3c8f63] text-white rounded-lg font-semibold text-base"
          >
            <FaFilter className="text-sm" />
            Filters
          </button>
        </div>

        <div className="flex">
          {/* Filter Sidebar - Desktop - Fixed */}
          <div className="hidden lg:block w-[28%] sticky top-0 h-screen overflow-y-auto">
            <div className="p-6">
              <FilterSidebar
                filters={filters}
                workTypes={workTypes}
                experienceLevels={experienceLevels}
                onWorkTypeChange={handleWorkTypeChange}
                onExperienceChange={handleExperienceChange}
                onSalaryChange={handleSalaryChange}
                onClearFilters={clearAllFilters}
                onApplyFilters={applyFilters}
              />
            </div>
          </div>

          {/* Jobs List - Scrollable */}
          <div className="w-full lg:w-[72%]">
            <div className="p-4 lg:p-6">
              {/* Search Bar */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                      type="text"
                      placeholder="Search jobs, companies, or keywords..."
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8f63] focus:border-transparent text-base"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="px-8 py-4 bg-[#3c8f63] text-white rounded-lg font-semibold hover:bg-[#2a6b4a] transition-colors text-base whitespace-nowrap"
                  >
                    Search Jobs
                  </button>
                </div>
              </div>

              {/* Jobs Count with Refresh Button */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {loading
                    ? "Loading..."
                    : `${pagination?.totalJobs || 0} Jobs Available`}
                </h2>

                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSync
                    className={`text-sm ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
              </div>

              {/* Error State */}
              {isError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800">
                    Error loading jobs: {error.message}
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <FaSpinner className="animate-spin text-4xl text-[#3c8f63] mr-3" />
                  <span className="text-xl text-gray-600">Loading jobs...</span>
                </div>
              )}

              {/* Jobs List */}
              {!loading && !isError && (
                <>
                  <div className="space-y-4 mb-8">
                    {jobs.map((job) => (
                      <JobCard
                        key={job._id}
                        job={job}
                        formatSalary={formatSalary}
                      />
                    ))}
                  </div>

                  {/* No Jobs Found */}
                  {jobs.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        No jobs found
                      </h3>
                      <p className="text-gray-600">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  )}

                  {/* Pagination */}
                  {pagination?.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                      {/* Previous Button */}
                      <button
                        onClick={() => goToPage(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrev || loading}
                        className={`px-4 py-2 rounded-lg border ${
                          pagination.hasPrev && !loading
                            ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                            : "border-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Previous
                      </button>

                      {/* Page Numbers */}
                      {[...Array(pagination.totalPages)].map((_, index) => {
                        const page = index + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            disabled={loading}
                            className={`px-4 py-2 rounded-lg border ${
                              pagination.currentPage === page
                                ? "bg-[#3c8f63] text-white border-[#3c8f63]"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            } ${
                              loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}

                      {/* Next Button */}
                      <button
                        onClick={() => goToPage(pagination.currentPage + 1)}
                        disabled={!pagination.hasNext || loading}
                        className={`px-4 py-2 rounded-lg border ${
                          pagination.hasNext && !loading
                            ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                            : "border-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Overlay */}
        {isFilterOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsFilterOpen(false)}
            />

            {/* Filter Sidebar */}
            <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="text-xl font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 text-lg" />
                </button>
              </div>

              <div className="p-4">
                <FilterSidebar
                  filters={filters}
                  workTypes={workTypes}
                  experienceLevels={experienceLevels}
                  onWorkTypeChange={handleWorkTypeChange}
                  onExperienceChange={handleExperienceChange}
                  onSalaryChange={handleSalaryChange}
                  onClearFilters={clearAllFilters}
                  onApplyFilters={applyFilters}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Updated FilterSidebar with Salary Slider__
const FilterSidebar = ({
  filters,
  workTypes,
  experienceLevels,
  onWorkTypeChange,
  onExperienceChange,
  onSalaryChange,
  onClearFilters,
  onApplyFilters,
}) => {
  const handleMinSalaryChange = (e) => {
    const newMin = parseInt(e.target.value);
    onSalaryChange([newMin, filters.salaryRange[1]]);
  };

  const handleMaxSalaryChange = (e) => {
    const newMax = parseInt(e.target.value);
    onSalaryChange([filters.salaryRange[0], newMax]);
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-xl font-bold text-gray-900">Filter Jobs</h3>
        <p className="text-gray-600 text-sm mt-1">
          Find your perfect job match
        </p>
      </div>

      {/* Work Type Filter */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-lg">
          <FaBriefcase className="text-[#3c8f63] text-xl" />
          Work Type
        </h4>
        <div className="space-y-3">
          {workTypes.map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.workType.includes(type)}
                onChange={() => onWorkTypeChange(type)}
                className="rounded border-gray-300 text-[#3c8f63] focus:ring-[#3c8f63] w-5 h-5"
              />
              <span className="text-gray-700 text-base group-hover:text-[#3c8f63] transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Salary Range Filter - UPDATED TO SLIDER */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-lg">
          <FaMoneyBillWave className="text-[#3c8f63] text-xl" />
          Salary Range
        </h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-[#3c8f63]">
              ${filters.salaryRange[0].toLocaleString()} - $
              {filters.salaryRange[1].toLocaleString()}
            </span>
          </div>

          {/* Double Range Slider */}
          <div className="space-y-6">
            {/* Min Salary Slider */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Minimum: ${filters.salaryRange[0].toLocaleString()}
              </label>
              <input
                type="range"
                min="0"
                max="200000"
                step="5000"
                value={filters.salaryRange[0]}
                onChange={handleMinSalaryChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Max Salary Slider */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Maximum: ${filters.salaryRange[1].toLocaleString()}
              </label>
              <input
                type="range"
                min="0"
                max="200000"
                step="5000"
                value={filters.salaryRange[1]}
                onChange={handleMaxSalaryChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <span>$0</span>
            <span>$200,000+</span>
          </div>
        </div>
      </div>

      {/* Experience Level Filter */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-lg">
          <FaStar className="text-[#3c8f63] text-xl" />
          Experience Level
        </h4>
        <div className="space-y-3">
          {experienceLevels.map((level) => (
            <label
              key={level}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.experienceLevel.includes(level)}
                onChange={() => onExperienceChange(level)}
                className="rounded border-gray-300 text-[#3c8f63] focus:ring-[#3c8f63] w-5 h-5"
              />
              <span className="text-gray-700 text-base group-hover:text-[#3c8f63] transition-colors">
                {level}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onApplyFilters}
          className="w-full py-4 bg-[#3c8f63] text-white rounded-lg font-semibold hover:bg-[#2a6b4a] transition-all duration-200 text-base"
        >
          Apply Filters
        </button>

        <button
          onClick={onClearFilters}
          className="w-full py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 text-base"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

// JobCard Component__
const JobCard = ({ job, formatSalary }) => {
  const { profile } = useUserData();

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-[#3c8f63] hover:border-opacity-30">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
        {/* Company Logo and Basic Info */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="flex-shrink-0 w-16 h-16 bg-[#3c8f63] bg-opacity-10 rounded-xl flex items-center justify-center">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.companyName}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <span className="text-2xl">💼</span>
            )}
          </div>

          {/* Job Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
                  {job.jobTitle}
                </h3>
                <p className="text-lg text-gray-700 font-medium mb-2">
                  {job.companyName}
                </p>
              </div>
            </div>

            {/* Job Meta */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-700">
                <FaBriefcase className="text-[#3c8f63] text-base" />
                <span className="text-base font-medium">
                  {job.workplaceType}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FaStar className="text-[#3c8f63] text-base" />
                <span className="text-base font-medium">
                  {job.experienceLevel}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FaMoneyBillWave className="text-[#3c8f63] text-base" />
                <span className="text-base font-medium">
                  {formatSalary(job)}
                </span>
              </div>
            </div>

            {/* Posted Date */}
            <div className="flex items-center gap-2 text-gray-500 text-base">
              <FaClock className="text-sm" />
              <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="flex-shrink-0 lg:self-center">
          <Link to={`/job-details/${job._id}`}>
            <button className="w-full lg:w-auto px-8 py-3 bg-[#3c8f63] text-white rounded-lg font-semibold hover:bg-[#2a6b4a] transition-colors text-base whitespace-nowrap shadow-sm hover:shadow-md">
              {profile?.userRole === "Job Seeker" ? "Apply Now" : "View"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Jobs;