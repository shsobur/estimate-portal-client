import { RxCrossCircled } from "react-icons/rx";

const SeekerModalHeader = ({handleCloseModal, title}) => {
  return (
    <>
      <div className="p-5 border-b-2 border-gray-200">
        <h2 className="flex items-center justify-between text-3xl font-semibold text-gray-800 font-[Montserrat]">
          {title}
          <span
            onClick={handleCloseModal}
            className="cursor-pointer hover:text-gray-600"
          >
            <RxCrossCircled size={30} />
          </span>
        </h2>
      </div>
    </>
  );
};

export default SeekerModalHeader;
