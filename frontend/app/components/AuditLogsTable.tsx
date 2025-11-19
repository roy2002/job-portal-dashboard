'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { AuditLog } from '../page'

interface AuditLogsTableProps {
  auditLogs: AuditLog[]
  loading: boolean
  totalElements: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function AuditLogsTable({
  auditLogs,
  loading,
  totalElements,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange
}: AuditLogsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  const toggleRowExpansion = (logId: number) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId)
    } else {
      newExpanded.add(logId)
    }
    setExpandedRows(newExpanded)
  }

  const getOperationBadge = (operation: string) => {
    const operationColors: { [key: string]: string } = {
      CREATE: 'badge-success',
      UPDATE: 'badge-info',
      DELETE: 'badge-error',
      READ: 'badge-info',
      LOGIN: 'badge-success',
      LOGOUT: 'badge-warning',
      REGISTER: 'badge-success',
      STATUS_CHANGE: 'badge-warning',
      BULK_UPDATE: 'badge-info',
      APPLY_JOB: 'badge-success',
      WITHDRAW_APPLICATION: 'badge-warning',
      UPLOAD_RESUME: 'badge-info'
    }

    return operationColors[operation] || 'badge-info'
  }

  const getStatusBadge = (success: boolean) => {
    return success ? 'badge-success' : 'badge-error'
  }

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'MMM dd, yyyy HH:mm:ss')
    } catch {
      return timestamp
    }
  }

  const totalPages = Math.ceil(totalElements / pageSize)
  const startIndex = currentPage * pageSize + 1
  const endIndex = Math.min((currentPage + 1) * pageSize, totalElements)

  const getPaginationButtons = () => {
    const buttons = []
    const maxVisiblePages = 5

    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1)

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            i === currentPage
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i + 1}
        </button>
      )
    }

    return buttons
  }

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Audit Logs</h3>
          <p className="text-sm text-gray-500">
            Showing {startIndex} to {endIndex} of {totalElements} entries
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-700">Show:</label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {[10, 20, 50, 100].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span className="text-sm text-gray-700">entries</span>
        </div>
      </div>

      {auditLogs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs found</h3>
          <p className="text-gray-500">Try adjusting your filters to see more results.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditLogs.map((log) => (
                  <>
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">
                            {log.userEmail || 'Anonymous'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {log.userRole} {log.userId && `(ID: ${log.userId})`}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`${getOperationBadge(log.operation)}`}>
                          {log.operation}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">
                            {log.entityName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {log.entityId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`${getStatusBadge(log.success)}`}>
                          {log.success ? 'Success' : 'Failed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => toggleRowExpansion(log.id)}
                          className="text-primary-600 hover:text-primary-900 font-medium"
                        >
                          {expandedRows.has(log.id) ? 'Hide Details' : 'Show Details'}
                        </button>
                      </td>
                    </tr>

                    {expandedRows.has(log.id) && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {log.ipAddress && (
                              <div>
                                <span className="font-medium text-gray-700">IP Address:</span>
                                <span className="ml-2 text-gray-600">{log.ipAddress}</span>
                              </div>
                            )}

                            {log.sessionId && (
                              <div>
                                <span className="font-medium text-gray-700">Session ID:</span>
                                <span className="ml-2 text-gray-600 font-mono text-xs">{log.sessionId}</span>
                              </div>
                            )}

                            {log.changedFields && (
                              <div className="md:col-span-2">
                                <span className="font-medium text-gray-700">Changed Fields:</span>
                                <span className="ml-2 text-gray-600">{log.changedFields}</span>
                              </div>
                            )}

                            {log.errorMessage && (
                              <div className="md:col-span-2">
                                <span className="font-medium text-red-700">Error Message:</span>
                                <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded text-red-800">
                                  {log.errorMessage}
                                </div>
                              </div>
                            )}

                            {log.oldValues && (
                              <div>
                                <span className="font-medium text-gray-700">Old Values:</span>
                                <pre className="mt-1 p-2 bg-gray-100 border rounded text-xs overflow-x-auto">
                                  {JSON.stringify(JSON.parse(log.oldValues), null, 2)}
                                </pre>
                              </div>
                            )}

                            {log.newValues && (
                              <div>
                                <span className="font-medium text-gray-700">New Values:</span>
                                <pre className="mt-1 p-2 bg-gray-100 border rounded text-xs overflow-x-auto">
                                  {JSON.stringify(JSON.parse(log.newValues), null, 2)}
                                </pre>
                              </div>
                            )}

                            {log.userAgent && (
                              <div className="md:col-span-2">
                                <span className="font-medium text-gray-700">User Agent:</span>
                                <div className="mt-1 text-xs text-gray-600 break-all">
                                  {log.userAgent}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing page {currentPage + 1} of {totalPages}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onPageChange(0)}
                  disabled={currentPage === 0}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  First
                </button>

                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex space-x-1">
                  {getPaginationButtons()}
                </div>

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>

                <button
                  onClick={() => onPageChange(totalPages - 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
