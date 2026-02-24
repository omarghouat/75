"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type FilterType = 'all' | 'active' | 'completed';

interface TodoFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  activeCount: number;
}

const TodoFilters = ({ currentFilter, onFilterChange, activeCount }: TodoFiltersProps) => {
  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100">
      <span className="text-sm font-medium text-gray-500">
        {activeCount} {activeCount === 1 ? 'item' : 'items'} left
      </span>
      <div className="flex bg-gray-100/50 p-1 rounded-xl">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              "rounded-lg px-4 py-1.5 text-sm font-medium transition-all",
              currentFilter === filter.value 
                ? "bg-white text-indigo-600 shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TodoFilters;