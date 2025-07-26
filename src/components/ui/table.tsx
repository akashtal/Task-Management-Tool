import * as React from 'react';

const Table = ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-auto">
    <table className={`w-full caption-bottom text-sm ${className || ''}`} {...props} />
  </div>
);

const TableHeader = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={`[&_tr]:border-b ${className || ''}`} {...props} />
);

const TableBody = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className || ''}`} {...props} />
);

const TableRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={`border-b transition-colors hover:bg-muted/50 ${className || ''}`} {...props} />
);

const TableHead = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className || ''}`}
    {...props}
  />
);

const TableCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td
    className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className || ''}`}
    {...props}
  />
);

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
