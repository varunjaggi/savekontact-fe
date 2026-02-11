import { useState, useEffect, useCallback } from 'react'
import { fetchProfile, fetchLogs } from '../lib/api'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'

export default function Dashboard() {
    const { getToken } = useAuth()
    const { user: clerkUser } = useUser()
    const [user, setUser] = useState(null)
    const [recentLogs, setRecentLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const loadData = useCallback(async () => {
        try {
            const token = await getToken()
            const [profileData, logsData] = await Promise.all([
                fetchProfile(token),
                fetchLogs(token, 1, 5),
            ])
            setUser(profileData)
            setRecentLogs(logsData.logs)
            setError(null)
        } catch (err) {
            console.error(err)
            setError('Failed to load data. Please try again.')
        } finally {
            setLoading(false)
        }
    }, [getToken])

    useEffect(() => {
        loadData()
    }, [loadData])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-bg-primary">
                <div className="w-10 h-10 border-3 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin-slow" />
                <div className="text-text-muted text-sm font-medium">Loading dashboard...</div>
            </div>
        )
    }

    const percentage = user ? (user.enrichments_used / user.enrichment_limit) * 100 : 0
    const displayName = user?.name || clerkUser?.fullName || clerkUser?.firstName || 'User'

    return (
        <div className="min-h-screen bg-bg-primary">
            <Navbar />

            <main className="max-w-[1100px] mx-auto px-8 py-8 max-md:px-4 max-md:py-5">
                <div className="mb-8">
                    <h1 className="text-[28px] font-extrabold mb-1 text-text-primary">
                        Welcome back, {displayName.split(' ')[0]} 👋
                    </h1>
                    <p className="text-text-muted text-[15px]">
                        Here's your enrichment overview at a glance
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-accent-red px-5 py-3 rounded-lg text-sm mb-5">
                        {error}
                    </div>
                )}

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-3 gap-5 mb-7 max-md:grid-cols-1">
                    <div className="card p-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-[3px] gradient-primary" />
                        <div className="text-sm text-text-muted font-medium mb-2">Credits Used</div>
                        <div className="text-3xl font-extrabold text-gradient">{user?.enrichments_used || 0}</div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-3">
                            <div
                                className="h-full rounded-full gradient-primary"
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                        </div>
                    </div>
                    <div className="card p-6">
                        <div className="text-sm text-text-muted font-medium mb-2">Credits Remaining</div>
                        <div className="text-3xl font-extrabold text-gradient">{user?.enrichments_remaining || 0}</div>
                        <div className="text-xs text-text-muted mt-3">
                            out of {user?.enrichment_limit || 0} total
                        </div>
                    </div>
                    <div className="card p-6">
                        <div className="text-sm text-text-muted font-medium mb-2">Current Plan</div>
                        <div className="text-3xl font-extrabold text-gradient capitalize">{user?.plan || 'Free'}</div>
                        <Link
                            to="/billing"
                            className="inline-block text-xs text-accent-blue font-medium mt-3 no-underline hover:underline"
                        >
                            Manage plan →
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                        <h2 className="text-lg font-bold text-text-primary">Recent Activity</h2>
                        <Link
                            to="/activity"
                            className="text-[13px] text-accent-blue font-medium no-underline hover:underline"
                        >
                            View all →
                        </Link>
                    </div>

                    {recentLogs.length === 0 ? (
                        <div className="py-12 px-6 text-center">
                            <div className="text-4xl mb-3">📋</div>
                            <h3 className="text-base font-bold mb-1 text-text-primary">No enrichments yet</h3>
                            <p className="text-text-muted text-sm max-w-[320px] mx-auto leading-relaxed">
                                Use the Chrome extension on any LinkedIn profile to start enriching.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {recentLogs.map((log) => {
                                const slug = (() => {
                                    try {
                                        const parts = new URL(log.linkedin_url).pathname.split('/').filter(Boolean)
                                        return parts[parts.length - 1] || log.linkedin_url
                                    } catch { return log.linkedin_url }
                                })()

                                const statusColors = {
                                    success: 'bg-green-50 text-accent-green',
                                    pending: 'bg-blue-50 text-accent-blue',
                                    retrying: 'bg-amber-50 text-accent-yellow',
                                    failed: 'bg-red-50 text-accent-red',
                                }

                                return (
                                    <div key={log.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-colors">
                                        <a
                                            href={log.linkedin_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-accent-blue font-medium no-underline hover:underline truncate max-w-[300px]"
                                        >
                                            {slug}
                                        </a>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[log.status] || ''}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                            {log.status}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
