'use client'

interface AuditStatsProps {
  stats: {
    totalLogs: number
    successfulOperations: number
    failedOperations: number
    uniqueUsers: number
  }
}

export function AuditStats({ stats }: AuditStatsProps) {
  const successRate = stats.totalLogs > 0
    ? ((stats.successfulOperations / stats.totalLogs) * 100).toFixed(1)
    : '0'

  const statCards = [
    {
      title: 'Total Logs',
      value: stats.totalLogs.toLocaleString(),
      icon: '📊',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'Successful Operations',
      value: stats.successfulOperations.toLocaleString(),
      icon: '✅',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      title: 'Failed Operations',
      value: stats.failedOperations.toLocaleString(),
      icon: '❌',
      color: 'bg-red-50 text-red-700 border-red-200'
    },
    {
      title: 'Success Rate',
      value: `${successRate}%`,
      icon: '📈',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      title: 'Unique Users',
      value: stats.uniqueUsers.toLocaleString(),
      icon: '👥',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    }
  ]

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Overview Statistics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`card border-l-4 ${stat.color}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold">
                  {stat.value}
                </p>
              </div>
              <div className="text-2xl opacity-50">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
