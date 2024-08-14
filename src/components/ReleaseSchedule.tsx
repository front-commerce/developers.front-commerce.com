import React, { useMemo, useState } from "react";
import schedule from "../../schedule.json";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

interface ReleaseScheduleProps {
  version: ("2" | 2) | ("3" | 3);
}

const PAGE_SIZE = 12;

const formatDate = (date: Date) => date.toISOString().slice(0, 10);
const formatExpired = (dateString: string, type: "EOL" | "EOS") => {
  const date = new Date(dateString);
  const now = new Date();
  return date < now ? (
    <span title={`Reached ${type} date`}>⚠️ {dateString}</span>
  ) : (
    dateString
  );
};

export default function ReleaseSchedule(props: ReleaseScheduleProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const currentSchedule = schedule[props.version];
  const versionScheduleData = useMemo(() => {
    return Object.entries(currentSchedule).map(([version, { release }]) => {
      const releaseDate = new Date(release);
      const eos = new Date(releaseDate);
      eos.setFullYear(releaseDate.getFullYear() + 1);
      const eol = new Date(releaseDate);
      eol.setFullYear(releaseDate.getFullYear() + 2);
      return {
        version,
        releaseDate: releaseDate,
        release: formatDate(releaseDate),
        eos: formatDate(eos),
        eol: formatDate(eol),
      };
    });
  }, [props.version]);

  const totalPages = Math.ceil(versionScheduleData.length / PAGE_SIZE);
  const currentData = versionScheduleData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <table className="min-w-full table">
        <thead>
          <tr>
            <th>Version</th>
            <th>Release date</th>
            <th>
              End of Support (
              <small>
                <abbr title="End of Support">EOS</abbr>
              </small>
              )
            </th>
            <th>
              End of Life (
              <small>
                <abbr title="End of Life">EOL</abbr>
              </small>
              )
            </th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((entry, index) => {
            const href = `#${entry.version.replace(/\./g, "")}-${
              entry.release
            }`;

            const isFuture = entry.releaseDate > new Date();
            let rowClasses = ["text-center"];
            if (isFuture) {
              rowClasses.push("text-gray-400 dark:text-gray");
            }

            return (
              <tr key={index} className={rowClasses.join(" ")}>
                <td>
                  {isFuture ? (
                    entry.version
                  ) : (
                    <a href={href}>{entry.version}</a>
                  )}
                </td>
                <td>{entry.release}</td>
                <td>{formatExpired(entry.eos, "EOS")}</td>
                <td>{formatExpired(entry.eol, "EOL")}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const maxVisiblePages = 10; // Maximum number of visible page buttons

  // Calculate the range of pages to display
  let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
  let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

  // Adjust the startPage if the endPage reaches the total number of pages
  if (endPage === totalPages) {
    startPage = Math.max(endPage - maxVisiblePages + 1, 1);
  }

  // Generate an array of page numbers to display
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  const buttonClasses = {
    base: "relative inline-flex items-center ring-1 ring-inset ring-gray-300 dark:ring-gray-500 focus:z-20 focus:outline-offset-0",
    hoverable: "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600/50",
    disabled: "opacity-50 cursor-not-allowed",
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${
            currentPage === 1 ? buttonClasses.disabled : "cursor-pointer"
          } relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${
            currentPage === totalPages
              ? buttonClasses.disabled
              : "cursor-pointer"
          } relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50`}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end">
        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <div
            role="button"
            onClick={() => onPageChange(1)}
            className={clsx(
              "rounded-l-md px-2 py-2 text-gray-400 ",
              buttonClasses.base,
              currentPage === 1
                ? buttonClasses.disabled
                : buttonClasses.hoverable
            )}
          >
            <span className="sr-only">First</span>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </div>
          {pageNumbers.map((page) => (
            <div
              role="button"
              key={page}
              onClick={() => onPageChange(page)}
              className={clsx(
                "px-4 py-2 text-sm relative inline-flex items-center font-semibold",
                buttonClasses.base,
                currentPage !== page
                  ? `cursor-pointer text-gray-900 dark:text-gray-300 ${buttonClasses.hoverable}`
                  : "z-10 bg-primary-600 hover:bg-primary-600 dark:hover:bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              )}
            >
              {page}
            </div>
          ))}
          <div
            role="button"
            onClick={() => onPageChange(totalPages)}
            className={clsx(
              "rounded-r-md px-2 py-2 text-gray-400  ",
              buttonClasses.base,
              currentPage === totalPages
                ? buttonClasses.disabled
                : buttonClasses.hoverable
            )}
          >
            <span className="sr-only">Last</span>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </div>
        </nav>
      </div>
    </div>
  );
};
