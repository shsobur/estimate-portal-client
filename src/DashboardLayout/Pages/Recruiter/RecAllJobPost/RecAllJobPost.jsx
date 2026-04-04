import { useState, useRef, useEffect } from "react";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaSearch,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaEye,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
  FaInfoCircle,
  FaTimes,
  FaInbox,
} from "react-icons/fa";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_JOBS = [
  {
    _id: "1",
    positionName: "Senior Frontend Developer",
    jobTitle: "Senior Frontend Developer",
    workplaceType: "Remote",
    jobType: "Full-time",
    totalApply: 24,
    createdAt: "2025-12-01T14:03:01.171Z",
    applicationDeadline: "2026-04-20T00:00:00.000Z",
  },
  {
    _id: "2",
    positionName: "Backend Engineer",
    jobTitle: "Backend Engineer",
    workplaceType: "On-site",
    jobType: "Full-time",
    totalApply: 11,
    createdAt: "2025-11-20T09:30:00.000Z",
    applicationDeadline: "2026-05-01T00:00:00.000Z",
  },
  {
    _id: "3",
    positionName: "UI/UX Designer",
    jobTitle: "UI/UX Designer",
    workplaceType: "Hybrid",
    jobType: "Part-time",
    totalApply: 37,
    createdAt: "2025-11-10T11:00:00.000Z",
    applicationDeadline: "2026-04-05T00:00:00.000Z",
  },
  {
    _id: "4",
    positionName: "DevOps Engineer",
    jobTitle: "DevOps Engineer",
    workplaceType: "Remote",
    jobType: "Contract",
    totalApply: 8,
    createdAt: "2025-10-28T16:45:00.000Z",
    applicationDeadline: "2026-03-30T00:00:00.000Z",
  },
  {
    _id: "5",
    positionName: "Product Manager",
    jobTitle: "Product Manager",
    workplaceType: "On-site",
    jobType: "Full-time",
    totalApply: 52,
    createdAt: "2025-10-11T14:03:01.171Z",
    applicationDeadline: "2026-06-15T00:00:00.000Z",
  },
  {
    _id: "6",
    positionName: "React Native Developer",
    jobTitle: "React Native Developer",
    workplaceType: "Remote",
    jobType: "Full-time",
    totalApply: 19,
    createdAt: "2025-09-22T08:00:00.000Z",
    applicationDeadline: "2026-04-10T00:00:00.000Z",
  },
];

const JOBS_PER_PAGE = 4;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const daysUntilDeadline = (deadline) =>
  Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));

const workplaceColor = (type) =>
  ({
    Remote: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "On-site": "bg-blue-50 text-blue-700 border-blue-200",
    Hybrid: "bg-purple-50 text-purple-700 border-purple-200",
  })[type] || "bg-gray-50 text-gray-600 border-gray-200";

const jobTypeColor = (type) =>
  ({
    "Full-time": "bg-[#3c8f63]/10 text-[#3c8f63] border-[#3c8f63]/20",
    "Part-time": "bg-orange-50 text-orange-700 border-orange-200",
    Contract: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Internship: "bg-pink-50 text-pink-700 border-pink-200",
  })[type] || "bg-gray-50 text-gray-600 border-gray-200";

const deadlineBadge = (deadline) => {
  const days = daysUntilDeadline(deadline);
  if (days < 0)
    return { label: "Expired", cls: "bg-red-100 text-red-600 border-red-200" };
  if (days <= 7)
    return {
      label: `${days}d left`,
      cls: "bg-orange-100 text-orange-600 border-orange-200",
    };
  return {
    label: `${days}d left`,
    cls: "bg-green-100 text-green-700 border-green-200",
  };
};

// ─── Highlight — green underline close to text, no layout shift ───────────────
const Highlight = ({ children }) => (
  <span
    className="text-[#3c8f63]"
    style={{
      display: "inline",
      borderBottom: "5px solid rgba(60, 143, 99, 0.25)",
      paddingBottom: "1px",
    }}
  >
    {children}
  </span>
);

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gray-200 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="h-4 w-3/4 bg-gray-200 rounded-md mb-2" />
          <div className="h-3 w-1/2 bg-gray-100 rounded-md" />
        </div>
      </div>
      <div className="w-7 h-7 rounded-full bg-gray-200 ml-2 shrink-0" />
    </div>
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="h-6 w-20 bg-gray-100 rounded-full" />
      <div className="h-6 w-20 bg-gray-100 rounded-full" />
      <div className="h-6 w-16 bg-gray-100 rounded-full" />
    </div>
    <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row sm:justify-between gap-2">
      <div className="h-3 w-24 bg-gray-100 rounded-md" />
      <div className="h-3 w-28 bg-gray-100 rounded-md" />
    </div>
  </div>
);

// ─── Three-dot Dropdown ───────────────────────────────────────────────────────
const JobDropdown = ({ jobId, openId, setOpenId }) => {
  const ref = useRef(null);
  const isOpen = openId === jobId;

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpenId(null);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [setOpenId]);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        onClick={() => setOpenId(isOpen ? null : jobId)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer transition-colors duration-200"
      >
        <FaEllipsisV className="text-sm" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
          {/* View */}
          <button
            onClick={() => setOpenId(null)}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
          >
            <FaEye className="text-blue-500 shrink-0" />
            <span className="font-medium">View Post</span>
          </button>
          <div className="h-px bg-gray-100 mx-3" />
          {/* Update */}
          <button
            onClick={() => setOpenId(null)}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
          >
            <FaEdit className="text-[#3c8f63] shrink-0" />
            <span className="font-medium">Update Post</span>
          </button>
          <div className="h-px bg-gray-100 mx-3" />
          {/* Delete */}
          <button
            onClick={() => setOpenId(null)}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors duration-150"
          >
            <FaTrash className="text-red-500 shrink-0" />
            <span className="font-medium">Delete Post</span>
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Job Card ─────────────────────────────────────────────────────────────────
// Hover: smooth box-shadow border — no translate, no layout shift
const JobCard = ({ job, openId, setOpenId }) => {
  const badge = deadlineBadge(job.applicationDeadline);

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm cursor-pointer flex flex-col gap-3 sm:gap-4 p-4 sm:p-5 transition-shadow duration-300"
      style={{ boxShadow: undefined }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow =
          "0 0 0 2px rgba(60, 143, 99, 0.35), 0 4px 16px rgba(0,0,0,0.06)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "")}
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#3c8f63]/10 flex items-center justify-center shrink-0">
            <FaBriefcase className="text-[#3c8f63] text-base sm:text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 text-sm sm:text-base leading-tight truncate">
              {job.positionName}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5 text-gray-400 text-xs">
              <FaCalendarAlt className="text-[10px] shrink-0" />
              <span className="truncate">
                Posted {formatDate(job.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <JobDropdown jobId={job._id} openId={openId} setOpenId={setOpenId} />
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${workplaceColor(job.workplaceType)}`}
        >
          <FaMapMarkerAlt className="inline mr-1 text-[10px]" />
          {job.workplaceType}
        </span>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${jobTypeColor(job.jobType)}`}
        >
          {job.jobType}
        </span>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${badge.cls}`}
        >
          <FaClock className="inline mr-1 text-[10px]" />
          {badge.label}
        </span>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 pt-3 flex flex-col min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between gap-1.5">
        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
          <FaUsers className="text-[#3c8f63] shrink-0" />
          <span>
            <b className="text-gray-700">{job.totalApply}</b> Applied
          </span>
        </div>
        <div className="text-xs text-gray-400">
          Deadline: {formatDate(job.applicationDeadline)}
        </div>
      </div>
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ isFiltered }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center col-span-2 px-4">
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
      <FaInbox className="text-gray-400 text-2xl sm:text-3xl" />
    </div>
    <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">
      {isFiltered ? "No Results Found" : "No Job Posts Yet"}
    </h3>
    <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
      {isFiltered
        ? "Try adjusting your search or filter to find what you're looking for."
        : "You haven't posted any jobs yet. Start by creating your first job post."}
    </p>
  </div>
);

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination = ({ current, total, onChange }) => {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-6 flex-wrap">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors duration-150"
      >
        <FaChevronLeft className="text-xs" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-sm font-semibold cursor-pointer transition-colors duration-150 ${
            p === current
              ? "bg-[#3c8f63] text-white shadow-sm"
              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors duration-150"
      >
        <FaChevronRight className="text-xs" />
      </button>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const RecAllJobPost = () => {
  const [loading, setLoading] = useState(true);
  const [jobs] = useState(MOCK_JOBS);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [showNote, setShowNote] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const filtered = jobs
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter((job) => {
      const searchMatch =
        job.positionName.toLowerCase().includes(search.toLowerCase()) ||
        job.jobTitle.toLowerCase().includes(search.toLowerCase());
      const dateMatch = dateFilter
        ? job.createdAt.startsWith(dateFilter)
        : true;
      return searchMatch && dateMatch;
    });

  const totalPages = Math.ceil(filtered.length / JOBS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE,
  );

  const handleSearch = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };
  const handleDateFilter = (val) => {
    setDateFilter(val);
    setCurrentPage(1);
  };
  const clearFilters = () => {
    setSearch("");
    setDateFilter("");
    setCurrentPage(1);
  };
  const isFiltered = search !== "" || dateFilter !== "";

  return (
    // 15px padding desktop, 10px mobile — no extra margin/spacing
    <div className="w-full h-full overflow-y-auto p-[10px] sm:p-[15px]">
      {/* ── Page Header ── */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
          <div>
            <h2 className="text-3xl sm:text-[2.5rem] font-bold leading-tight text-[#1a202c] mb-2">
              Manage Your <Highlight>Job Posts</Highlight>
            </h2>
            <p className="text-[#4a5568] text-base sm:text-[1.1rem] leading-relaxed">
              Edit, update, or remove your active job listings anytime.
            </p>
          </div>
          {!loading && (
            <div className="self-start sm:self-center shrink-0 px-4 py-1.5 bg-[#3c8f63]/10 text-[#3c8f63] text-sm font-semibold rounded-full border border-[#3c8f63]/20">
              {filtered.length} {filtered.length === 1 ? "Post" : "Posts"}
            </div>
          )}
        </div>
      </div>

      {/* ── Info Note ── */}
      {showNote && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5 mb-5 sm:mb-6 relative">
          <FaInfoCircle className="text-amber-500 text-base sm:text-lg mt-0.5 shrink-0" />
          <p className="text-amber-800 text-xs sm:text-sm leading-relaxed pr-5">
            <span className="font-semibold">Auto-removal notice:</span> Once
            your job post's application deadline expires, it will be
            automatically removed{" "}
            <span className="font-semibold">1 day after expiry</span>. For
            example, if your deadline is{" "}
            <span className="font-semibold">Dec 15</span>, the post will be
            deleted on <span className="font-semibold">Dec 17</span>.
          </p>
          <button
            onClick={() => setShowNote(false)}
            className="absolute right-3 top-3 text-amber-400 hover:text-amber-600 cursor-pointer transition-colors duration-150"
          >
            <FaTimes className="text-xs sm:text-sm" />
          </button>
        </div>
      )}

      {/* ── Search + Filter ── */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-5 sm:mb-6">
        {/* Search — with left icon bg accent */}
        <div className="relative flex-1 flex items-center">
          <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center bg-[#3c8f63]/8 rounded-l-xl border-r border-gray-200 pointer-events-none">
            <FaSearch className="text-[#3c8f63] text-sm" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by position or job title..."
            className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#3c8f63] focus:ring-2 focus:ring-[#3c8f63]/10 transition-all duration-200 outline-none"
          />
        </div>

        {/* Date Filter */}
        <div className="relative flex items-center w-full sm:w-48">
          <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center bg-[#3c8f63]/8 rounded-l-xl border-r border-gray-200 pointer-events-none">
            <FaCalendarAlt className="text-[#3c8f63] text-sm" />
          </div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => handleDateFilter(e.target.value)}
            className="w-full pl-12 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-[#3c8f63] focus:ring-2 focus:ring-[#3c8f63]/10 transition-all duration-200 outline-none"
          />
        </div>

        {/* Clear */}
        {isFiltered && (
          <button
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200 cursor-pointer transition-colors duration-200 whitespace-nowrap"
          >
            <FaTimes className="text-xs" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* ── Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {loading ? (
          [1, 2, 3, 4].map((n) => <SkeletonCard key={n} />)
        ) : paginated.length === 0 ? (
          <EmptyState isFiltered={isFiltered} />
        ) : (
          paginated.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              openId={openDropdownId}
              setOpenId={setOpenDropdownId}
            />
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      {!loading && filtered.length > JOBS_PER_PAGE && (
        <Pagination
          current={currentPage}
          total={totalPages}
          onChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default RecAllJobPost;