import { useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
import {
  FaRegSave,
  FaTimes,
  FaPlus,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import {
  MdWork,
  MdLocationOn,
  MdDescription,
  MdStar,
  MdAttachMoney,
  MdPeople,
  MdLabel,
} from "react-icons/md";

// ─── Mock initial data (will come from props later) ───────────────────────────
const MOCK_JOB = {
  jobTitle: "Senior Frontend Developer",
  position: "Senior Frontend Developer",
  department: "IT / Information Technology",
  experienceLevel: "Senior Level",
  jobType: "Full-time",
  workplaceType: "Remote",
  openPositions: 2,
  applicationDeadline: "2025-12-15",
  country: "United States",
  city: "San Francisco",
  area: "Bay Area",
  salaryRange: { min: 120000, max: 160000, currency: "USD", period: "year" },
  jobDescription:
    "We are looking for a skilled Senior Frontend Developer to join our dynamic team.",
  responsibilities: [
    "Develop and maintain responsive web applications",
    "Collaborate with UX/UI designers",
    "Write clean, maintainable, and testable code",
  ],
  whoCanApply: [
    "5+ years of frontend development experience",
    "Strong portfolio of web applications",
  ],
  requirementSkills: ["React.js", "TypeScript", "Next.js", "HTML5 & CSS3"],
  niceToHave: ["GraphQL experience", "Testing frameworks (Jest, Cypress)"],
  benefits: [
    "Health insurance",
    "Flexible working hours",
    "Remote work options",
  ],
  tags: ["react", "frontend", "remote", "typescript"],
};

// ─── Step config ──────────────────────────────────────────────────────────────
const STEPS = [
  { number: 1, label: "Basic Info", icon: <MdWork /> },
  { number: 2, label: "Location & Salary", icon: <MdLocationOn /> },
  { number: 3, label: "Job Details", icon: <MdDescription /> },
  { number: 4, label: "Skills & Extras", icon: <MdStar /> },
];

// ─── Shared input classes ─────────────────────────────────────────────────────
const inputCls =
  "w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#3c8f63] transition-colors duration-200 bg-white placeholder-gray-400";

const selectCls =
  "w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-[#3c8f63] transition-colors duration-200 bg-white cursor-pointer";

// ─── Reusable Form Field Wrapper ──────────────────────────────────────────────
const FormInput = ({ label, icon, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
      <span className="text-[#3c8f63]">{icon}</span>
      {label}
    </label>
    {children}
  </div>
);

// ─── Tip Box ──────────────────────────────────────────────────────────────────
const TipBox = ({ message }) => (
  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
    <div className="flex items-start gap-3">
      <MdDescription className="text-green-600 text-xl mt-0.5 shrink-0" />
      <p className="text-green-800 text-sm leading-relaxed">
        <span className="font-semibold">Tip: </span>
        {message}
      </p>
    </div>
  </div>
);

// ─── Tag Input (for array fields) ─────────────────────────────────────────────
const TagInput = ({ label, icon, items, setItems, placeholder }) => {
  const [inputVal, setInputVal] = useState("");

  const handleAdd = () => {
    const trimmed = inputVal.trim();
    if (!trimmed || items.includes(trimmed)) return;
    setItems([...items, trimmed]);
    setInputVal("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (item) => {
    setItems(items.filter((i) => i !== item));
  };

  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <span className="text-[#3c8f63]">{icon}</span>
        {label}
      </label>

      {/* Input + Add button */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`${inputCls} flex-1`}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2.5 bg-[#3c8f63] text-white rounded-lg text-sm font-semibold hover:bg-[#2d7a52] cursor-pointer transition-colors duration-200 flex items-center gap-1.5 shrink-0"
        >
          <FaPlus className="text-xs" />
          Add
        </button>
      </div>

      {/* Chips */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {items.map((item) => (
            <span
              key={item}
              className="flex items-center gap-1.5 bg-[#3c8f63]/10 text-[#3c8f63] border border-[#3c8f63]/20 text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              {item}
              <button
                type="button"
                onClick={() => handleRemove(item)}
                className="hover:text-red-500 cursor-pointer transition-colors duration-150"
              >
                <FaTimes className="text-[10px]" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Step Indicator ───────────────────────────────────────────────────────────
const StepIndicator = ({ currentStep }) => (
  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60">
    {STEPS.map((step, idx) => {
      const isCompleted = currentStep > step.number;
      const isActive = currentStep === step.number;

      return (
        <div key={step.number} className="flex items-center flex-1">
          <div className="flex flex-col items-center gap-1 flex-1">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                isCompleted
                  ? "bg-[#3c8f63] text-white"
                  : isActive
                    ? "bg-[#3c8f63] text-white ring-4 ring-[#3c8f63]/20"
                    : "bg-gray-200 text-gray-400"
              }`}
            >
              {isCompleted ? "✓" : step.number}
            </div>
            <span
              className={`text-xs font-medium hidden sm:block text-center leading-tight ${
                isActive
                  ? "text-[#3c8f63]"
                  : isCompleted
                    ? "text-gray-600"
                    : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>

          {/* Connector line between steps */}
          {idx < STEPS.length - 1 && (
            <div
              className={`h-0.5 flex-1 mx-1 transition-all duration-300 ${
                currentStep > step.number ? "bg-[#3c8f63]" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      );
    })}
  </div>
);

// ─── Step 1: Basic Info ───────────────────────────────────────────────────────
const Step1 = ({ form, setForm }) => (
  <div className="space-y-5">
    <h3 className="text-base font-bold text-gray-700 pb-2 border-b border-gray-100">
      Basic Job Information
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormInput label="Job Title" icon={<MdWork />}>
        <input
          type="text"
          value={form.jobTitle}
          onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
          placeholder="e.g. Senior Frontend Developer"
          className={inputCls}
        />
      </FormInput>

      <FormInput label="Position" icon={<MdWork />}>
        <input
          type="text"
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
          placeholder="e.g. Senior Frontend Developer"
          className={inputCls}
        />
      </FormInput>

      <FormInput label="Department" icon={<MdPeople />}>
        <input
          type="text"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          placeholder="e.g. IT / Information Technology"
          className={inputCls}
        />
      </FormInput>

      <FormInput label="Experience Level" icon={<MdStar />}>
        <select
          value={form.experienceLevel}
          onChange={(e) =>
            setForm({ ...form, experienceLevel: e.target.value })
          }
          className={selectCls}
        >
          <option value="">Select level</option>
          <option>Entry Level</option>
          <option>Mid Level</option>
          <option>Senior Level</option>
          <option>Lead</option>
          <option>Manager</option>
        </select>
      </FormInput>

      <FormInput label="Job Type" icon={<MdWork />}>
        <select
          value={form.jobType}
          onChange={(e) => setForm({ ...form, jobType: e.target.value })}
          className={selectCls}
        >
          <option value="">Select type</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
          <option>Internship</option>
          <option>Freelance</option>
        </select>
      </FormInput>

      <FormInput label="Workplace Type" icon={<MdLocationOn />}>
        <select
          value={form.workplaceType}
          onChange={(e) => setForm({ ...form, workplaceType: e.target.value })}
          className={selectCls}
        >
          <option value="">Select workplace</option>
          <option>Remote</option>
          <option>On-site</option>
          <option>Hybrid</option>
        </select>
      </FormInput>

      <FormInput label="Open Positions" icon={<MdPeople />}>
        <input
          type="number"
          min="1"
          value={form.openPositions}
          onChange={(e) => setForm({ ...form, openPositions: e.target.value })}
          placeholder="e.g. 2"
          className={inputCls}
        />
      </FormInput>

      <FormInput label="Application Deadline" icon={<MdWork />}>
        <input
          type="date"
          value={form.applicationDeadline}
          onChange={(e) =>
            setForm({ ...form, applicationDeadline: e.target.value })
          }
          className={inputCls}
        />
      </FormInput>
    </div>

    <TipBox message="Make sure your job title is clear and specific. This is the first thing candidates see when browsing jobs." />
  </div>
);

// ─── Step 2: Location & Salary ────────────────────────────────────────────────
const Step2 = ({ form, setForm }) => (
  <div className="space-y-5">
    <h3 className="text-base font-bold text-gray-700 pb-2 border-b border-gray-100">
      Location & Salary Details
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <FormInput label="Country" icon={<MdLocationOn />}>
        <input
          type="text"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          placeholder="e.g. United States"
          className={inputCls}
        />
      </FormInput>

      <FormInput label="City" icon={<MdLocationOn />}>
        <input
          type="text"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          placeholder="e.g. San Francisco"
          className={inputCls}
        />
      </FormInput>

      <FormInput label="Area" icon={<MdLocationOn />}>
        <input
          type="text"
          value={form.area}
          onChange={(e) => setForm({ ...form, area: e.target.value })}
          placeholder="e.g. Bay Area"
          className={inputCls}
        />
      </FormInput>
    </div>

    <div>
      <h4 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
        <MdAttachMoney className="text-[#3c8f63] text-base" />
        Salary Range
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput label="Minimum Salary" icon={<MdAttachMoney />}>
          <input
            type="number"
            value={form.salaryRange.min}
            onChange={(e) =>
              setForm({
                ...form,
                salaryRange: { ...form.salaryRange, min: e.target.value },
              })
            }
            placeholder="e.g. 120000"
            className={inputCls}
          />
        </FormInput>

        <FormInput label="Maximum Salary" icon={<MdAttachMoney />}>
          <input
            type="number"
            value={form.salaryRange.max}
            onChange={(e) =>
              setForm({
                ...form,
                salaryRange: { ...form.salaryRange, max: e.target.value },
              })
            }
            placeholder="e.g. 160000"
            className={inputCls}
          />
        </FormInput>

        <FormInput label="Currency" icon={<MdAttachMoney />}>
          <select
            value={form.salaryRange.currency}
            onChange={(e) =>
              setForm({
                ...form,
                salaryRange: { ...form.salaryRange, currency: e.target.value },
              })
            }
            className={selectCls}
          >
            <option>USD</option>
            <option>EUR</option>
            <option>GBP</option>
            <option>BDT</option>
            <option>INR</option>
          </select>
        </FormInput>

        <FormInput label="Pay Period" icon={<MdAttachMoney />}>
          <select
            value={form.salaryRange.period}
            onChange={(e) =>
              setForm({
                ...form,
                salaryRange: { ...form.salaryRange, period: e.target.value },
              })
            }
            className={selectCls}
          >
            <option value="year">Per Year</option>
            <option value="month">Per Month</option>
            <option value="hour">Per Hour</option>
          </select>
        </FormInput>
      </div>
    </div>

    <TipBox message="Listing a salary range increases applications by up to 30%. Be transparent and competitive to attract top talent." />
  </div>
);

// ─── Step 3: Job Details ──────────────────────────────────────────────────────
const Step3 = ({ form, setForm }) => (
  <div className="space-y-5">
    <h3 className="text-base font-bold text-gray-700 pb-2 border-b border-gray-100">
      Job Description & Requirements
    </h3>

    <FormInput label="Job Description" icon={<MdDescription />}>
      <textarea
        value={form.jobDescription}
        onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
        placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
        rows={6}
        maxLength={1000}
        className={`${inputCls} resize-none`}
      />
      <p className="text-xs text-gray-400 text-right">
        {form.jobDescription.length}/1000
      </p>
    </FormInput>

    <TagInput
      label="Responsibilities"
      icon={<MdWork />}
      items={form.responsibilities}
      setItems={(val) => setForm({ ...form, responsibilities: val })}
      placeholder="Type and press Enter or click Add"
    />

    <TagInput
      label="Who Can Apply"
      icon={<MdPeople />}
      items={form.whoCanApply}
      setItems={(val) => setForm({ ...form, whoCanApply: val })}
      placeholder="Type and press Enter or click Add"
    />

    <TipBox message="A detailed job description helps candidates self-qualify. Be specific about daily tasks and expectations to reduce unqualified applications." />
  </div>
);

// ─── Step 4: Skills & Extras ──────────────────────────────────────────────────
const Step4 = ({ form, setForm }) => (
  <div className="space-y-5">
    <h3 className="text-base font-bold text-gray-700 pb-2 border-b border-gray-100">
      Skills, Benefits & Tags
    </h3>

    <TagInput
      label="Required Skills"
      icon={<MdStar />}
      items={form.requirementSkills}
      setItems={(val) => setForm({ ...form, requirementSkills: val })}
      placeholder="e.g. React.js"
    />

    <TagInput
      label="Nice to Have"
      icon={<MdStar />}
      items={form.niceToHave}
      setItems={(val) => setForm({ ...form, niceToHave: val })}
      placeholder="e.g. GraphQL experience"
    />

    <TagInput
      label="Benefits"
      icon={<MdPeople />}
      items={form.benefits}
      setItems={(val) => setForm({ ...form, benefits: val })}
      placeholder="e.g. Health insurance"
    />

    <TagInput
      label="Tags"
      icon={<MdLabel />}
      items={form.tags}
      setItems={(val) => setForm({ ...form, tags: val })}
      placeholder="e.g. react, remote, fulltime"
    />

    <TipBox message="Tags help candidates discover your job post in search results. Use relevant keywords that describe the role, tech stack, and work style." />
  </div>
);

// ─── Main Modal Component ─────────────────────────────────────────────────────
const AllJobPostEditModal = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(true); // will be dynamic later
  const [form, setForm] = useState(MOCK_JOB);

  const handleFormChange = (updatedForm) => {
    setForm(updatedForm);
    setHasChanges(true);
  };

  const handleCloseModal = () => {
    const modal = document.getElementById("res_all_job_post_update_modal");
    if (modal) modal.close();
  };

  const handleCancel = () => {
    setForm(MOCK_JOB);
    setHasChanges(false);
    setCurrentStep(1);
    handleCloseModal();
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSave = () => {
    // Will be dynamic later
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const stepProps = { form, setForm: handleFormChange };

  return (
    <dialog id="res_all_job_post_update_modal" className="modal">
      {/* ── Modal Box ── No overflow-hidden here — DaisyUI controls this */}
      <div className="modal-box max-w-[1024px] max-h-[95vh] flex flex-col p-0">
        {/* ── Header — fixed, never scrolls ── */}
        <div className="p-5 border-b-2 border-gray-200 shrink-0">
          <h2 className="flex items-center justify-between text-2xl sm:text-3xl font-semibold text-gray-800 font-[Montserrat]">
            Update Job Post
            <span
              onClick={isLoading ? undefined : handleCloseModal}
              className={`transition-colors duration-150 ${
                isLoading
                  ? "text-gray-300 cursor-not-allowed"
                  : "cursor-pointer hover:text-gray-600"
              }`}
            >
              <RxCrossCircled size={30} />
            </span>
          </h2>
        </div>

        {/* ── Step Indicator — fixed, never scrolls ── */}
        <StepIndicator currentStep={currentStep} />

        {/* ── Main — only this scrolls ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-5">
            {currentStep === 1 && <Step1 {...stepProps} />}
            {currentStep === 2 && <Step2 {...stepProps} />}
            {currentStep === 3 && <Step3 {...stepProps} />}
            {currentStep === 4 && <Step4 {...stepProps} />}
          </div>
        </div>

        {/* ── Footer — fixed, never scrolls ── */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 shrink-0">
          <div className="flex items-center justify-between gap-3">
            {/* Step info */}
            <p className="text-xs text-gray-400 hidden sm:block">
              Step {currentStep} of {STEPS.length} —{" "}
              {STEPS[currentStep - 1].label}
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Cancel */}
              <button
                type="button"
                disabled={isLoading || !hasChanges}
                onClick={handleCancel}
                className={`flex items-center gap-2 h-[44px] px-5 rounded-lg border text-sm font-semibold transition-colors duration-200 ${
                  isLoading || !hasChanges
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer"
                }`}
              >
                <FaTimes className="text-xs" />
                Cancel
              </button>

              {/* Back */}
              {currentStep > 1 && (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleBack}
                  className={`flex items-center gap-2 h-[44px] px-5 rounded-lg border text-sm font-semibold transition-colors duration-200 ${
                    isLoading
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer"
                  }`}
                >
                  <FaChevronLeft className="text-xs" />
                  Back
                </button>
              )}

              {/* Next */}
              {currentStep < 4 && (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleNext}
                  className="flex items-center gap-2 h-[44px] px-6 rounded-lg bg-[#3c8f63] text-white text-sm font-semibold hover:bg-[#2d7a52] cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <FaChevronRight className="text-xs" />
                </button>
              )}

              {/* Save Changes — only on last step */}
              {currentStep === 4 && (
                <button
                  type="button"
                  disabled={isLoading || !hasChanges}
                  onClick={handleSave}
                  className={`flex items-center gap-2 h-[44px] px-6 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                    isLoading || !hasChanges
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#3c8f63] text-white hover:bg-[#2d7a52] cursor-pointer"
                  }`}
                >
                  <FaRegSave className="text-sm" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── DaisyUI Backdrop — click outside to close ── */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default AllJobPostEditModal;