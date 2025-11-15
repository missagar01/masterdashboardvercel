'use client'

import { X } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface DataModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  data: Array<Record<string, any>>
  columns: Array<{ key: string; label: string }>
}

export default function DataModal({ isOpen, onClose, title, data, columns }: DataModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr className="text-left">
                  {columns.map((column) => (
                    <th key={column.key} className="px-4 py-3 font-semibold text-foreground">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((row, index) => (
                    <tr key={index} className="border-b hover:bg-muted/30 transition-colors">
                      {columns.map((column) => (
                        <td key={column.key} className="px-4 py-3 text-foreground">
                          {typeof row[column.key] === 'object'
                            ? JSON.stringify(row[column.key])
                            : String(row[column.key])}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="px-4 py-3 text-center text-muted-foreground">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  )
}
