import { FaPlus } from "react-icons/fa";

const PageHeader = ({ title, onAdd }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-semibold text-[var(--heading)]">{title}</h2>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <FaPlus /> Add {title}
        </button>
      )}
    </div>
  );
};

export default PageHeader;
