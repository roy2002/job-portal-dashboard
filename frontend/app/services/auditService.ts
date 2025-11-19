import axios from 'axios'
import { AuditFilters } from '../page'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// Configure axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})

export const auditService = {
  // Get paginated audit logs with filters
  async getAuditLogs(page: number = 0, size: number = 20, filters: AuditFilters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })

    // Add filters to params
    if (filters.entityName) params.append('entityName', filters.entityName)
    if (filters.operation) params.append('operation', filters.operation)
    if (filters.userEmail) params.append('userEmail', filters.userEmail)
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
    if (filters.dateTo) params.append('dateTo', filters.dateTo)
    if (filters.success !== undefined) params.append('success', filters.success.toString())

    const response = await apiClient.get(`/api/v1/admin/audit/logs?${params}`)
    return response.data
  },

  // Get audit logs by entity type
  async getAuditLogsByEntity(entityName: string, page: number = 0, size: number = 20) {
    const response = await apiClient.get(`/api/v1/admin/audit/entity/${entityName}?page=${page}&size=${size}`)
    return response.data
  },

  // Get audit logs for specific entity instance
  async getAuditLogsForEntity(entityName: string, entityId: string) {
    const response = await apiClient.get(`/api/v1/admin/audit/entity/${entityName}/${entityId}`)
    return response.data
  },

  // Get audit logs by user
  async getAuditLogsByUser(userEmail: string, page: number = 0, size: number = 20) {
    const response = await apiClient.get(`/api/v1/admin/audit/user/${userEmail}?page=${page}&size=${size}`)
    return response.data
  },

  // Get audit logs by operation
  async getAuditLogsByOperation(operation: string, page: number = 0, size: number = 20) {
    const response = await apiClient.get(`/api/v1/admin/audit/operation/${operation}?page=${page}&size=${size}`)
    return response.data
  },

  // Get audit statistics
  async getAuditStats() {
    try {
      const response = await apiClient.get('/api/v1/admin/audit/stats')
      return response.data.data || {
        totalLogs: 0,
        successfulOperations: 0,
        failedOperations: 0,
        uniqueUsers: 0
      }
    } catch (error) {
      console.error('Error fetching audit stats:', error)
      return {
        totalLogs: 0,
        successfulOperations: 0,
        failedOperations: 0,
        uniqueUsers: 0
      }
    }
  },

  // Get distinct entity names
  async getEntityNames() {
    try {
      const response = await apiClient.get('/api/v1/admin/audit/entities')
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching entity names:', error)
      return []
    }
  },

  // Get audit logs by date range
  async getAuditLogsByDateRange(startDate: string, endDate: string, page: number = 0, size: number = 20) {
    const response = await apiClient.get(`/api/v1/admin/audit/date-range?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`)
    return response.data
  }
}
