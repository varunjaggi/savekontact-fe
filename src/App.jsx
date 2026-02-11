import { Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Activity from './pages/Activity'
import Integrations from './pages/Integrations'
import Billing from './pages/Billing'

export default function App() {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <SignedOut>
                        <Login />
                    </SignedOut>
                }
            />
            <Route
                path="/"
                element={
                    <>
                        <SignedIn>
                            <Dashboard />
                        </SignedIn>
                        <SignedOut>
                            <RedirectToSignIn />
                        </SignedOut>
                    </>
                }
            />
            <Route
                path="/activity"
                element={
                    <>
                        <SignedIn>
                            <Activity />
                        </SignedIn>
                        <SignedOut>
                            <RedirectToSignIn />
                        </SignedOut>
                    </>
                }
            />
            <Route
                path="/integrations"
                element={
                    <>
                        <SignedIn>
                            <Integrations />
                        </SignedIn>
                        <SignedOut>
                            <RedirectToSignIn />
                        </SignedOut>
                    </>
                }
            />
            <Route
                path="/billing"
                element={
                    <>
                        <SignedIn>
                            <Billing />
                        </SignedIn>
                        <SignedOut>
                            <RedirectToSignIn />
                        </SignedOut>
                    </>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
