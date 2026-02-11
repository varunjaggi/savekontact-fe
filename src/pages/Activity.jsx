import { useState, useEffect, useCallback } from 'react'
import { fetchProfile, fetchLogs } from '../lib/api'
import LogsTable from '../components/LogsTable'
import Navbar from '../components/Navbar'
import { useAuth } from '@clerk/clerk-react'

export default function Activity() {
    const { getToken } = useAuth()
    const [user, setUser] = useState(null)
    const [logs, setLogs] = useState([])
    const [pagination, setPagination] = useState({ page: 1, total: 0, total_pages: 1 })
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState(null)

    const loadData = useCallback(async (page = 1, showLoading = false) => {
        try {
            if (showLoading) setRefreshing(true)
            const token = await getToken()
            const [profileData, logsData] = await Promise.all([
                fetchProfile(token),
                fetchLogs(token, page),
            ])
            setUser(profileData)
            setLogs(logsData.logs)
            setPagination({
                page: logsData.page,
                total: logsData.total,
                total_pages: logsData.total_pages,
            })
            setError(null)
        } catch (err) {
            console.error(err)
            setError('Failed to load data. Please try again.')
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [getToken])

    useEffect(() => {
        loadData(1)
    }, [loadData])

    useEffect(() => {
        const interval = setInterval(() => {
            loadData(pagination.page)
        }, 30000)
        return () => clearInterval(interval)
    }, [loadData, pagination.page])

    const handleRefresh = () => {
        loadData(pagination.page, true)
    }

    const handlePageChange = (newPage) => {
        loadData(newPage, true)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-bg-primary">
                <div className="w-10 h-10 border-3 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin-slow" />
                <div className="text-text-muted text-sm font-medium">Loading activity...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-bg-primary">
            <Navbar />

            <main className="max-w-[1100px] mx-auto px-8 py-8 max-md:px-4 max-md:py-5">
                <div className="mb-8">
                    <h1 className="text-[28px] font-extrabold mb-1 text-text-primary">Activity 📋</h1>
                    <p className="text-text-muted text-[15px]">
                        All your enrichment history in one place
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-accent-red px-5 py-3 rounded-lg text-sm mb-5">
                        {error}
                    </div>
                )}

                <LogsTable
                    logs={logs}
                    pagination={pagination}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    onPageChange={handlePageChange}
                />
            </main>
        </div>
    )
}
