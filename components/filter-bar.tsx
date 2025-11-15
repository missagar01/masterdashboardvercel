'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface FilterBarProps {
  onDropdownChange?: (value: string) => void
  onNameChange?: (name: string) => void
  dropdownLabel?: string
  dropdownOptions?: Array<{ value: string; label: string }>
}

export default function FilterBar({
  onDropdownChange,
  onNameChange,
  dropdownLabel = 'Filter',
  dropdownOptions = [],
}: FilterBarProps) {
  const [selectedDropdown, setSelectedDropdown] = useState('')
  const [selectedName, setSelectedName] = useState('')

  const handleDropdownChange = (value: string) => {
    setSelectedDropdown(value)
    if (onDropdownChange) onDropdownChange(value)
  }

  const handleNameChange = (value: string) => {
    setSelectedName(value)
    if (onNameChange) onNameChange(value)
  }

  const handleClearFilters = () => {
    setSelectedDropdown('')
    setSelectedName('')
  }

  return (
    <Card className="border-0 shadow-sm p-4 md:p-6 mb-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-end">
        {/* Dropdown Filter */}
        {dropdownOptions.length > 0 && (
          <div className="w-full sm:w-auto">
            <label className="text-sm font-medium text-foreground block mb-2">{dropdownLabel}</label>
            <select
              value={selectedDropdown}
              onChange={(e) => handleDropdownChange(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All</option>
              {dropdownOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Name Search */}
        <div className="w-full sm:flex-1">
          <label className="text-sm font-medium text-foreground block mb-2">Search Name</label>
          <input
            type="text"
            placeholder="Search by name..."
            value={selectedName}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Clear Button */}
        {(selectedDropdown || selectedName) && (
          <button
            onClick={handleClearFilters}
            className="w-full sm:w-auto px-4 py-2 rounded-md bg-muted hover:bg-muted/80 text-foreground transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>
    </Card>
  )
}
