export default function PlanUsage({ user }) {
    if (!user) return null

    const { plan, enrichments_used, enrichment_limit, enrichments_remaining } = user
    const percentage = (enrichments_used / enrichment_limit) * 100

    let fillClass = 'gradient-primary'
    if (percentage >= 100) fillClass = 'bg-accent-red'
    else if (percentage >= 70) fillClass = 'gradient-warning'

    return (
        <div className="card p-7 mb-7 relative overflow-hidden">
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] gradient-primary" />

            <div className="flex items-center justify-between mb-5">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-accent-blue rounded-full text-[13px] font-semibold uppercase tracking-wide">
                    <span>✦</span>
                    {plan} Plan
                </div>
                <div className="flex gap-8 max-md:gap-5">
                    <div className="text-center">
                        <div className="text-[28px] font-extrabold text-gradient max-md:text-[22px]">
                            {enrichments_used}
                        </div>
                        <div className="text-xs text-text-muted font-medium mt-0.5">Used</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[28px] font-extrabold text-gradient max-md:text-[22px]">
                            {enrichments_remaining}
                        </div>
                        <div className="text-xs text-text-muted font-medium mt-0.5">Remaining</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[28px] font-extrabold text-gradient max-md:text-[22px]">
                            {enrichment_limit}
                        </div>
                        <div className="text-xs text-text-muted font-medium mt-0.5">Total</div>
                    </div>
                </div>
            </div>

            <div className="mt-2">
                <div className="flex justify-between mb-2">
                    <span className="text-[13px] text-text-muted font-medium">
                        Enrichment credits used
                    </span>
                    <span className="text-[13px] text-text-primary font-semibold">
                        {enrichments_used} / {enrichment_limit}
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
    )
}
