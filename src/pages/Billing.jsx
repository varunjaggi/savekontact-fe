import { useState, useEffect, useCallback } from 'react'
import { fetchProfile } from '../lib/api'
import Navbar from '../components/Navbar'
import { useAuth } from '@clerk/clerk-react'

const PLANS = [
    {
        id: 'starter',
        name: 'Starter',
        price: '$9',
        credits: '100',
        label: 'People',
        description: 'Entry level access',
        popular: false,
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '$19',
        credits: '400–500',
        label: 'People',
        description: 'Best value for most',
        popular: true,
    },
    {
        id: 'unlimited',
        name: 'Unlimited',
        price: '$39',
        credits: 'Unlimited',
        label: 'People',
        description: 'For high volume needs',
        popular: false,
    },
]

export default function Billing() {
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

    const handleBuy = (plan) => {
        alert(`Payment integration coming soon! You selected the ${plan.name} plan for ${plan.price}.`)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-bg-primary">
                <div className="w-10 h-10 border-3 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin-slow" />
                <div className="text-text-muted text-sm font-medium">Loading billing...</div>
            </div>
        )
    }

    const percentage = user ? (user.enrichments_used / user.enrichment_limit) * 100 : 0
    let fillClass = 'gradient-primary'
    if (percentage >= 100) fillClass = 'bg-accent-red'
    else if (percentage >= 70) fillClass = 'gradient-warning'

    return (
        <div className="min-h-screen bg-bg-primary">
            <Navbar />

            <main className="max-w-[1100px] mx-auto px-8 py-8 max-md:px-4 max-md:py-5">
                <div className="mb-8">
                    <h1 className="text-[28px] font-extrabold mb-1 text-text-primary">Billing 💳</h1>
                    <p className="text-text-muted text-[15px]">
                        Manage your plan and purchase additional credits
                    </p>
                </div>

                {/* Current Plan Card */}
                <div className="card p-7 mb-7 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[3px] gradient-primary" />

                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold mb-2 text-text-primary">Current Plan</h2>
                            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-accent-blue rounded-full text-[13px] font-semibold uppercase tracking-wide">
                                <span>✦</span>
                                {user?.plan || 'Free'} Plan
                            </div>
                        </div>
                        <div className="flex gap-8 max-md:gap-5">
                            <div className="text-center">
                                <div className="text-[28px] font-extrabold text-gradient max-md:text-[22px]">
                                    {user?.enrichments_used || 0}
                                </div>
                                <div className="text-xs text-text-muted font-medium mt-0.5">Used</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[28px] font-extrabold text-gradient max-md:text-[22px]">
                                    {user?.enrichments_remaining || 0}
                                </div>
                                <div className="text-xs text-text-muted font-medium mt-0.5">Remaining</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[28px] font-extrabold text-gradient max-md:text-[22px]">
                                    {user?.enrichment_limit || 0}
                                </div>
                                <div className="text-xs text-text-muted font-medium mt-0.5">Total</div>
                            </div>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="text-[13px] text-text-muted font-medium">
                                Enrichment credits used
                            </span>
                            <span className="text-[13px] text-text-primary font-semibold">
                                {user?.enrichments_used || 0} / {user?.enrichment_limit || 0}
                            </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-[width] duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] relative ${fillClass}`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Available Plans */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-1 text-text-primary">Available Plans</h2>
                    <p className="text-text-muted text-sm">Choose a plan that fits your needs</p>
                </div>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5 max-md:grid-cols-1">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.id}
                            className={`card p-6 flex flex-col gap-4 transition-all duration-250 relative overflow-hidden group hover:-translate-y-0.5 hover:shadow-md ${plan.popular ? 'border-accent-blue/40 ring-1 ring-accent-blue/10' : ''
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 left-0 right-0 h-[3px] gradient-primary" />
                            )}

                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-xl font-bold text-text-primary">
                                        {plan.name}
                                    </div>
                                    <div className="text-xs text-text-muted font-medium mt-0.5">
                                        {plan.description}
                                    </div>
                                </div>
                                {plan.popular && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 bg-blue-50 text-accent-blue rounded-full text-[11px] font-semibold uppercase tracking-wide">
                                        Popular
                                    </span>
                                )}
                            </div>

                            <div className="mt-2">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-extrabold text-gradient">{plan.price}</span>
                                    {plan.price !== 'Free' && <span className="text-sm text-text-muted">/mo</span>}
                                </div>
                            </div>

                            <div className="flex items-baseline gap-1.5 pb-2 border-b border-gray-100">
                                <span className="text-lg font-bold text-text-primary">{plan.credits}</span>
                                <span className="text-sm text-text-muted font-medium">{plan.label}</span>
                            </div>

                            <button
                                className={`w-full py-2.5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-px mt-auto ${plan.popular
                                    ? 'gradient-primary text-white hover:shadow-md'
                                    : 'bg-gray-100 text-text-primary hover:bg-gray-200'
                                    }`}
                                onClick={() => handleBuy(plan)}
                            >
                                Upgrade to {plan.name}
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}
