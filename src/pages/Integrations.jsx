import { useState, useEffect, useCallback } from 'react'
import { fetchProfile } from '../lib/api'
import Navbar from '../components/Navbar'
import { useAuth } from '@clerk/clerk-react'

const INTEGRATIONS = [
    {
        id: 'notion',
        name: 'Notion',
        icon: '📝',
        description: 'Sync enriched profiles directly to your Notion databases.',
        available: true,
    },
    {
        id: 'slack',
        name: 'Slack',
        icon: '💬',
        description: 'Get real-time enrichment notifications in your Slack channels.',
        available: false,
    },
    {
        id: 'zapier',
        name: 'Zapier',
        icon: '⚡',
        description: 'Connect to 5,000+ apps with Zapier automations.',
        available: false,
    },
    {
        id: 'webhook',
        name: 'Webhook API',
        icon: '🔗',
        description: 'Send enriched data to any URL via custom webhooks.',
        available: false,
    },
]

export default function Integrations() {
    const { getToken } = useAuth()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const loadUser = useCallback(async () => {
        try {
            const token = await getToken()
            const data = await fetchProfile(token)
            setUser(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [getToken])

    useEffect(() => {
        loadUser()
    }, [loadUser])

    const handleConnect = (integration) => {
        alert(`Notion integration coming soon! This will open the Notion OAuth flow.`)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-bg-primary">
                <div className="w-10 h-10 border-3 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin-slow" />
                <div className="text-text-muted text-sm font-medium">Loading integrations...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-bg-primary">
            <Navbar />

            <main className="max-w-[1100px] mx-auto px-8 py-8 max-md:px-4 max-md:py-5">
                <div className="mb-8">
                    <h1 className="text-[28px] font-extrabold mb-1 text-text-primary">Integrations 🔌</h1>
                    <p className="text-text-muted text-[15px]">
                        Connect your favorite tools to automate enrichment workflows
                    </p>
                </div>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5 max-md:grid-cols-1">
                    {INTEGRATIONS.map((integration) => (
                        <div
                            key={integration.id}
                            className={`card p-7 flex flex-col gap-4 transition-all duration-250 relative overflow-hidden group ${!integration.available
                                    ? 'opacity-60'
                                    : 'hover:border-accent-blue/30 hover:-translate-y-0.5 hover:shadow-md'
                                }`}
                        >
                            {integration.available && (
                                <div className="absolute top-0 left-0 right-0 h-[3px] gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-250" />
                            )}

                            <div className="w-[52px] h-[52px] bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-2xl">
                                {integration.icon}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2.5 mb-1.5">
                                    <h3 className="text-[17px] font-bold text-text-primary">
                                        {integration.name}
                                    </h3>
                                    {!integration.available && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 bg-amber-50 text-accent-yellow rounded-full text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap">
                                            Coming Soon
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-text-muted leading-relaxed">
                                    {integration.description}
                                </p>
                            </div>

                            {integration.available ? (
                                <button
                                    className="self-start px-6 py-2.5 gradient-primary text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-px hover:shadow-md"
                                    onClick={() => handleConnect(integration)}
                                >
                                    Connect
                                </button>
                            ) : (
                                <button
                                    className="self-start px-6 py-2.5 bg-gray-100 text-text-muted border-none rounded-lg text-sm font-semibold cursor-not-allowed"
                                    disabled
                                >
                                    Coming Soon
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
