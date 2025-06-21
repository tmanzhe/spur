'use client';

import { useUser } from '@clerk/nextjs';
import PlaidLink from '@/components/PlaidLink';

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();

  // Show loading while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="grid items-center justify-items-center min-h-screen p-8">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="grid items-center justify-items-center min-h-screen p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Financial Tracker</h1>
          <p className="text-lg mb-8 text-gray-600">
            Please sign in using the button in the top right corner to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Financial Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress || 'User'}!
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Connect Your Bank Accounts</h2>
          <p className="text-gray-600 mb-6">
            Securely connect your bank accounts to start tracking your finances. 
            We use bank-level security to protect your data.
          </p>
          <PlaidLink 
            onSuccess={() => {
              console.log('Bank account connected successfully!');
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Total Balance</h3>
            <p className="text-2xl font-bold text-green-600">$0.00</p>
            <p className="text-sm text-gray-500">Connect accounts to see balance</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Monthly Spending</h3>
            <p className="text-2xl font-bold text-red-600">$0.00</p>
            <p className="text-sm text-gray-500">Connect accounts to see spending</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Savings Goal</h3>
            <p className="text-2xl font-bold text-blue-600">$0.00</p>
            <p className="text-sm text-gray-500">Set your savings target</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <p className="text-gray-500">Connect your bank accounts to see recent transactions</p>
        </div>
      </main>
    </div>
  );
} 