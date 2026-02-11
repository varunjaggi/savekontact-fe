import { SignIn } from '@clerk/clerk-react'

export default function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary relative">
            <div className="w-full max-w-md flex justify-center">
                <SignIn />
            </div>
        </div>
    )
}
