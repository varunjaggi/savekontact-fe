function RefreshIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
    )
}

function formatTime(dateStr) {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
}

function extractSlug(url) {
    try {
        const path = new URL(url).pathname
        const parts = path.split('/').filter(Boolean)
        return parts[parts.length - 1] || url
    } catch {
        return url
    }
}

const statusStyles = {
    success: 'bg-green-50 text-accent-green',
    pending: 'bg-blue-50 text-accent-blue',
    retrying: 'bg-amber-50 text-accent-yellow',
    failed: 'bg-red-50 text-accent-red',
}

export default function LogsTable({ logs, pagination, refreshing, onRefresh, onPageChange }) {
    return (
        <div className="card overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <h2 className="text-lg font-bold text-text-primary">Enrichment Logs</h2>
                <button
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-accent-blue border border-blue-200 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-200 hover:bg-blue-100"
                    onClick={onRefresh}
                    disabled={refreshing}
                >
                    <span className={refreshing ? 'animate-spin-slow' : ''}>
                        <RefreshIcon />
                    </span>
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {logs.length === 0 ? (
                <div className="py-16 px-6 text-center">
                    <div className="text-5xl mb-4">📋</div>
                    <h3 className="text-lg font-bold mb-2 text-text-primary">No enrichments yet</h3>
                    <p className="text-text-muted text-sm max-w-[360px] mx-auto leading-relaxed">
                        Use the Chrome extension on any LinkedIn profile to start enriching.
                        Your activity will appear here.
                    </p>
                </div>
            ) : (
                <>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide bg-gray-50 border-b border-border max-md:px-3.5 max-md:py-2.5">
                                    LinkedIn Profile
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide bg-gray-50 border-b border-border max-md:px-3.5 max-md:py-2.5">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide bg-gray-50 border-b border-border max-md:px-3.5 max-md:py-2.5">
                                    Retries
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide bg-gray-50 border-b border-border max-md:px-3.5 max-md:py-2.5">
                                    Time
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-3.5 text-sm border-b border-border align-middle max-w-[280px] whitespace-nowrap overflow-hidden text-ellipsis max-md:px-3.5 max-md:py-2.5" title={log.linkedin_url}>
                                        <a
                                            href={log.linkedin_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-accent-blue font-medium no-underline hover:underline"
                                        >
                                            {extractSlug(log.linkedin_url)}
                                        </a>
                                    </td>
                                    <td className="px-6 py-3.5 text-sm border-b border-border align-middle max-md:px-3.5 max-md:py-2.5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[log.status] || ''}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full bg-current ${log.status === 'pending' || log.status === 'retrying' ? 'animate-pulse-dot' : ''
                                                }`} />
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5 text-[13px] text-text-muted border-b border-border align-middle max-md:px-3.5 max-md:py-2.5">
                                        {log.retry_count > 0 ? `${log.retry_count}x` : '—'}
                                    </td>
                                    <td className="px-6 py-3.5 text-[13px] text-text-muted border-b border-border align-middle max-md:px-3.5 max-md:py-2.5">
                                        {formatTime(log.created_at)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {pagination.total_pages > 1 && (
                        <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-border">
                            <button
                                className="px-3.5 py-2 bg-white text-text-secondary border border-border rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-200 hover:text-accent-blue hover:border-accent-blue disabled:opacity-30 disabled:cursor-not-allowed"
                                onClick={() => onPageChange(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                            >
                                ← Prev
                            </button>
                            <span className="text-[13px] text-text-muted px-3">
                                Page {pagination.page} of {pagination.total_pages}
                            </span>
                            <button
                                className="px-3.5 py-2 bg-white text-text-secondary border border-border rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-200 hover:text-accent-blue hover:border-accent-blue disabled:opacity-30 disabled:cursor-not-allowed"
                                onClick={() => onPageChange(pagination.page + 1)}
                                disabled={pagination.page >= pagination.total_pages}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
