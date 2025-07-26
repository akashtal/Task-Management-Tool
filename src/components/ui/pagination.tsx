import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = React.HTMLAttributes<HTMLDivElement>;

function Pagination({ className, ...props }: PaginationProps) {
  return <nav role="navigation" aria-label="pagination" className={cn("flex w-full justify-center", className)} {...props} />;
}

function PaginationContent({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("inline-flex items-center -space-x-px", className)} {...props} />;
}

function PaginationItem({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li className={cn("px-1", className)} {...props} />;
}

interface PaginationLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean;
}

const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, ...props }, ref) => {
    return (
      <a
        ref={ref}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors",
          isActive
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-background text-foreground hover:bg-muted border-border",
          className
        )}
        {...props}
      />
    );
  }
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "inline-flex h-9 items-center justify-center rounded-md border border-border px-3 text-sm font-medium hover:bg-muted",
          className
        )}
        {...props}
      >
        <ChevronLeft className="h-4 w-4" />
      </a>
    );
  }
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "inline-flex h-9 items-center justify-center rounded-md border border-border px-3 text-sm font-medium hover:bg-muted",
          className
        )}
        {...props}
      >
        <ChevronRight className="h-4 w-4" />
      </a>
    );
  }
);
PaginationNext.displayName = "PaginationNext";

function PaginationEllipsis({ className }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("inline-flex h-9 w-9 items-center justify-center text-sm", className)}>
      ...
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
