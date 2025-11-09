"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [userRole, setUserRole] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/auth/user');
      if (res.ok) {
        const data = await res.json();
        setUserRole(data.role);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
    });
    if (res.ok) {
      window.location.href = '/login';
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="hidden text-3xl font-bold leading-tight text-gray-900 sm:block">
            Dasbor Pengelolaan Kamar
          </h1>
          {isLoggedIn && (
            <div className="flex items-center">
              <div className="hidden md:flex md:items-center md:space-x-4">
                {userRole === 'ADMIN' && (
                  <>
                    <button
                      onClick={() => router.push('/')}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      List Kamar
                    </button>
                    <button
                      onClick={() => router.push('/logs')}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Log Aktivitas
                    </button>
                    <button
                      onClick={() => router.push('/admin/users')}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Manajemen Pengguna
                    </button>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Keluar
                </button>
              </div>
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
        {isMenuOpen && (
          <div className="mt-4 md:hidden">
            {userRole === 'ADMIN' && (
              <>
                <button
                  onClick={() => router.push('/')}
                  className="block w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  List Kamar
                </button>
                <button
                  onClick={() => router.push('/logs')}
                  className="block w-full px-4 py-2 mt-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Log Aktivitas
                </button>
                <button
                  onClick={() => router.push('/admin/users')}
                  className="block w-full px-4 py-2 mt-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Manajemen Pengguna
                </button>
              </>
            )}
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 mt-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
