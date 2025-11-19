'use client'

import { useState, useEffect } from 'react'
import { AuditLogsTable } from './components/AuditLogsTable'
import { AuditFilters } from './components/AuditFilters'
import { AuditStats } from './components/AuditStats'
import { auditService } from './services/auditService'
import toast from 'react-hot-toast'

export interface AuditLog {
  id: number
  entityName: string
  entityId: string
  operation: string
  userEmail: string
  userId: number
  userRole: string
  timestamp: string
  oldValues?: string
  newValues?: string
  changedFields?: string
  ipAddress?: string
  userAgent?: string
  sessionId?: string
  success: boolean
  errorMessage?: string
}

export interface AuditFilters {
  entityName?: string
  operation?: string
  userEmail?: string
  dateFrom?: string
  dateTo?: string
  success?: boolean
}

export default function AuditDashboard() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [totalElements, setTotalElements] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [filters, setFilters] = useState<AuditFilters>({})
  const [stats, setStats] = useState({
    totalLogs: 0,
    successfulOperations: 0,
    failedOperations: 0,
    uniqueUsers: 0
  })

  const fetchAuditLogs = async (page: number = 0, size: number = 20, appliedFilters: AuditFilters = {}) => {
    try {
      setLoading(true)
      const response = await auditService.getAuditLogs(page, size, appliedFilters)

      if (response.status === 'success') {
        setAuditLogs(response.data)
        setTotalElements(response.totalElements)
        setCurrentPage(response.currentPage)
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error)
      toast.error('Failed to fetch audit logs')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const statsData = await auditService.getAuditStats()
      setStats(statsData)
    } catch (error) {
      console.error('Error fetching audit stats:', error)
    }
  }

  useEffect(() => {
    fetchAuditLogs(currentPage, pageSize, filters)
    fetchStats()
  }, [currentPage, pageSize, filters])

  const handleFiltersChange = (newFilters: AuditFilters) => {
    setFilters(newFilters)
    setCurrentPage(0) // Reset to first page when filters change
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(0)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Audit Logs Dashboard</h2>
        <p className="text-gray-600">
          Monitor and analyze system activities, user actions, and security events
        </p>
      </div>

      {/* Statistics Cards */}
      <AuditStats stats={stats} />

      {/* Filters */}
      <div className="mb-6">
        <AuditFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          loading={loading}
        />
      </div>

      {/* Audit Logs Table */}
      <AuditLogsTable
        auditLogs={auditLogs}
        loading={loading}
        totalElements={totalElements}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  )
}
