import React from 'react';
import { BriefcaseIcon } from 'lucide-react';

interface Department {
  id: string | number;
  name: string;
}

interface DepartmentChipsProps {
  departments: Department[];
}

const DepartmentChips: React.FC<DepartmentChipsProps> = ({ departments }) => {
  if (!departments || departments.length === 0) {
    return <span>No departments</span>;
  } else if (departments.length === 1) {
    const dept = departments[0];
    return (
      <span className="mr-2 inline-flex items-center px-3 py-1 text-xs font-medium text-gray-800 dark:text-gray-500 bg-input rounded-full">
        <BriefcaseIcon className="mr-1 h-4 w-4 text-gray-500" /> {dept.name}
      </span>
    );
  } else {
    const firstDept = departments[0];
    const remainingCount = departments.length - 1;
    return (
      <>
        <span className="mr-2 inline-flex items-center px-3 py-1 text-xs font-medium text-gray-800 dark:text-gray-500 bg-input rounded-full">
          <BriefcaseIcon className="mr-1 h-4 w-4 text-gray-500" /> {firstDept.name}
        </span>
        <span className="mr-2 inline-flex items-center px-3 py-1 text-xs font-medium text-gray-800 dark:text-gray-500 bg-input rounded-full">
          + {remainingCount} more
        </span>
      </>
    );
  }
};

export default DepartmentChips; 