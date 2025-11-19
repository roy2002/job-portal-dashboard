# Audit Logs Dashboard

A comprehensive React frontend for displaying and analyzing audit logs from the Job Portal application.

## Features

- **Real-time Audit Log Display**: View all system activities with detailed information
- **Advanced Filtering**: Filter logs by:
  - Entity Type (User, Job, Application, etc.)
  - Operation (CREATE, UPDATE, DELETE, LOGIN, etc.)
  - User Email
  - Success/Failure Status
  - Date Range
- **Statistics Dashboard**: View key metrics including:
  - Total logs count
  - Success/failure rates
  - Unique users count
  - Operation breakdowns
- **Detailed Log Views**: Expandable rows showing:
  - IP addresses
  - Session IDs
  - Changed fields
  - Old/new values
  - Error messages
  - User agent information
- **Pagination**: Efficient handling of large log datasets
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Notifications**: react-hot-toast
- **Charts**: Recharts (for future analytics)

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Java 17+ (for backend)
- Running Job Portal backend with audit logging enabled

### Installation

1. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Copy the environment file
   cp .env.local.example .env.local
   
   # Update with your backend URL if different
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the dashboard:**
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Backend Requirements

The frontend expects these API endpoints to be available:

- `GET /api/v1/admin/audit/logs` - Get paginated audit logs with filters
- `GET /api/v1/admin/audit/stats` - Get audit statistics
- `GET /api/v1/admin/audit/entities` - Get distinct entity names
- `GET /api/v1/admin/audit/entity/{entityName}` - Get logs by entity type
- `GET /api/v1/admin/audit/user/{userEmail}` - Get logs by user
- `GET /api/v1/admin/audit/operation/{operation}` - Get logs by operation

### Authentication

The dashboard requires admin authentication. Make sure to:

1. Login as an admin user in the Job Portal
2. The JWT token will be automatically included in API requests
3. Store the token in localStorage as 'authToken'

## Usage

### Viewing Audit Logs

1. **Overview Statistics**: The top of the dashboard shows key metrics
2. **Filtering**: Use the filters panel to narrow down logs by various criteria
3. **Table View**: The main table shows:
   - Timestamp of the action
   - User information (email, role, ID)
   - Operation type with color-coded badges
   - Entity information
   - Success/failure status
4. **Detailed View**: Click "Show Details" to expand rows and see:
   - IP addresses and session information
   - Changed fields and values
   - Error messages (for failed operations)
   - User agent strings

### Filter Options

- **Entity Type**: Filter by User, Job, Application, Profile, etc.
- **Operation**: Filter by CREATE, UPDATE, DELETE, LOGIN, etc.
- **User Email**: Search for specific user activities
- **Status**: Show only successful or failed operations
- **Date Range**: Filter by date and time range

### Pagination

- Configurable page sizes (10, 20, 50, 100 entries)
- Navigation controls (First, Previous, Next, Last)
- Page number indicators
- Total count display

## Log Levels and Types

The system tracks various audit events:

### Operation Types
- **CREATE**: New entity creation
- **UPDATE**: Entity modifications
- **DELETE**: Entity deletions
- **READ**: Data access operations
- **LOGIN/LOGOUT**: Authentication events
- **REGISTER**: User registration
- **STATUS_CHANGE**: Status updates
- **BULK_UPDATE**: Batch operations
- **APPLY_JOB**: Job applications
- **WITHDRAW_APPLICATION**: Application withdrawals
- **UPLOAD_RESUME**: File uploads

### Log Levels
Logs are categorized by success status:
- **Success**: Operations completed successfully
- **Failed**: Operations that encountered errors

## Customization

### Adding New Filters

To add new filter options, update:
1. `AuditFilters.tsx` - Add new filter UI components
2. `auditService.ts` - Update API calls to include new filters
3. Backend API - Ensure corresponding endpoints support new filters

### Styling

The dashboard uses Tailwind CSS with custom badge styles:
- `badge-success`: Green badges for successful operations
- `badge-error`: Red badges for failed operations
- `badge-warning`: Yellow badges for status changes
- `badge-info`: Blue badges for informational operations

### API Integration

The `auditService.ts` file handles all API communication. To modify:
1. Update base URL in environment variables
2. Modify request/response handling as needed
3. Add new API endpoints following the existing pattern

## Development

### Project Structure
```
frontend/
├── app/
│   ├── components/          # React components
│   │   ├── AuditFilters.tsx
│   │   ├── AuditStats.tsx
│   │   └── AuditLogsTable.tsx
│   ├── services/           # API services
│   │   └── auditService.ts
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # App layout
│   └── page.tsx           # Main dashboard page
├── public/                # Static assets
└── ...config files
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Security Considerations

- All API calls require admin authentication
- JWT tokens are used for authorization
- Sensitive information is masked in log displays
- Rate limiting should be implemented on the backend
- Log access should be audited itself

## Troubleshooting

### Common Issues

1. **"Access denied" errors**
   - Ensure you're logged in as an admin user
   - Check that JWT token is present in localStorage

2. **"No logs found"**
   - Verify backend is running and accessible
   - Check that audit logging is enabled in backend
   - Ensure database has audit log data

3. **Slow loading**
   - Consider reducing page size
   - Implement backend pagination optimizations
   - Add database indexes on frequently filtered columns

### API Connection Issues

1. Check backend URL in `.env.local`
2. Verify CORS settings in backend
3. Ensure backend audit endpoints are implemented
4. Check browser network tab for specific errors

## Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Update this README for new functionality
4. Test all filter combinations
5. Verify responsive design on mobile devices

## License

This project is part of the Job Portal application system.
