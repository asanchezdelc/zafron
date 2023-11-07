import { useEffect } from "react";

export default function Pagination ({ currentPage, totalPages, onChange }) {
  useEffect(() => {
  }, [currentPage]);
  return (
    <div className="flex flex-col items-center">
      <span className="text-sm text-gray-700 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-700">{currentPage} </span> of <span className="font-semibold text-gray-700">{totalPages}</span> Pages
      </span>
      <div className="inline-flex mt-2 xs:mt-0">
          <button onClick={() => currentPage > 1 && onChange(currentPage - 1)}
            disabled={currentPage === 1} className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-600 rounded-l hover:bg-gray-900">
              Prev
          </button>
          <button  onClick={() => currentPage < totalPages && onChange(currentPage + 1)}
            disabled={currentPage === totalPages} className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-600 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900">
              Next
          </button>
      </div>
  </div>
  );
}