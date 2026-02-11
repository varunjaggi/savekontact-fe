import { NavLink } from 'react-router-dom'
import { UserButton, useUser } from '@clerk/clerk-react'

export default function Navbar() {
    const { user, isLoaded } = useUser()

    return (
        <header className="bg-white border-b border-border px-8 h-16 flex items-center justify-between sticky top-0 z-50 max-md:px-4">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 gradient-primary rounded-lg flex items-center justify-center text-lg text-white">
                    ⚡
                </div>
                <span className="text-lg font-bold text-text-primary hidden sm:inline">Save Kontact</span>
                <nav className="flex items-center gap-1 ml-6 pl-6 border-l border-border max-md:ml-3 max-md:pl-3">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 no-underline ${isActive
                                ? 'text-accent-blue bg-accent-blue/8 font-semibold'
                                : 'text-text-muted hover:text-text-primary hover:bg-gray-100'
                            }`
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/activity"
                        className={({ isActive }) =>
                            `px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 no-underline ${isActive
                                ? 'text-accent-blue bg-accent-blue/8 font-semibold'
                                : 'text-text-muted hover:text-text-primary hover:bg-gray-100'
                            }`
                        }
                    >
                        Activity
                    </NavLink>
                    <NavLink
                        to="/integrations"
                        className={({ isActive }) =>
                            `px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 no-underline ${isActive
                                ? 'text-accent-blue bg-accent-blue/8 font-semibold'
                                : 'text-text-muted hover:text-text-primary hover:bg-gray-100'
                            }`
                        }
                    >
                        Integrations
                    </NavLink>
                    <NavLink
                        to="/billing"
                        className={({ isActive }) =>
                            `px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 no-underline ${isActive
                                ? 'text-accent-blue bg-accent-blue/8 font-semibold'
                                : 'text-text-muted hover:text-text-primary hover:bg-gray-100'
                            }`
                        }
                    >
                        Billing
                    </NavLink>
                </nav>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5">
                    {/* Clerk UserButton handles Avatar + Local SignOut + Account Mgmt */}
                    <UserButton />
                    {isLoaded && user && (
                        <span className="text-sm font-semibold text-text-primary hidden sm:inline">
                            {user.fullName || user.firstName || user.primaryEmailAddress?.emailAddress}
                        </span>
                    )}
                </div>
            </div>
        </header>
    )
}
