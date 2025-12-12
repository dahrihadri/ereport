import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

        {/* LEFT SIDE - Branding Section */}
        <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 p-8 lg:p-12 flex flex-col justify-between overflow-hidden">
          {/* Subtle decorative pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20">
              <div className="grid grid-cols-4 gap-3">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white rounded-full" />
                ))}
              </div>
            </div>
            <div className="absolute bottom-32 right-20">
              <div className="grid grid-cols-4 gap-3">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white rounded-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative w-16 h-16 bg-white rounded-lg p-2">
                <Image
                  src="/MCMC_Logo.png"
                  alt="MCMC Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-white text-2xl font-bold">MCMC</h2>
                <p className="text-blue-100 text-sm">Malaysian Communications and Multimedia Commission</p>
              </div>
            </div>
          </div>

          {/* Main message */}
          <div className="relative z-10 my-auto">
            <h1 className="text-white text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              DMDPR<br />Management System
            </h1>
            <p className="text-blue-100 text-lg lg:text-xl max-w-md">
              Streamline your divisional monthly performance reporting with our 3-tier approval workflow system.
            </p>
          </div>

          {/* Footer info */}
          <div className="relative z-10">
            <p className="text-blue-100 text-sm">
              Secure access powered by Azure Active Directory
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - Login Section */}
        <div className="flex items-center justify-center p-8 lg:p-12 bg-gray-50">
          <div className="w-full max-w-md">
            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 lg:p-10">
              {/* Welcome message */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600">
                  Sign in to access your dashboard
                </p>
              </div>

              {/* Single Sign-On Section */}
              <div className="mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800 font-medium mb-1">
                    Single Sign-On (SSO)
                  </p>
                  <p className="text-xs text-blue-600">
                    Use your MCMC organizational account to sign in
                  </p>
                </div>

                {/* Azure AD Button */}
                <Link
                  href="/dashboard"
                  className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl text-center"
                >
                  Sign in with Azure AD
                </Link>
              </div>

              {/* Help text */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-2">
                  <span className="font-semibold">Need help?</span>
                </p>
                <p className="text-xs text-gray-500">
                  Contact IT Support if you&apos;re having trouble accessing your account.
                </p>
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-8">
              <p className="text-xs text-gray-500 text-center mb-3">
                © 2025 Malaysian Communications and Multimedia Commission. All rights reserved.
              </p>
              <div className="flex justify-center gap-6 text-xs">
                <Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  Terms of Use
                </Link>
                <Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
