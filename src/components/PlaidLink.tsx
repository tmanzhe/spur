'use client';

import { useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';

interface PlaidLinkProps {
  onSuccess?: () => void;
}

export default function PlaidLink({ onSuccess }: PlaidLinkProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // This function fetches the link token from our backend
  const fetchLinkToken = async () => {
    setLoading(true);
    try {
      console.log('Fetching link token...');
      const response = await fetch('/api/create_link_token', {
        method: 'POST',
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.linkToken) {
        setLinkToken(data.linkToken);
        console.log('Link token received successfully');
      } else {
        console.error('Error from API:', data.error);
        console.error('Error details:', data.details);
        alert(`Failed to initialize bank connection: ${data.error}${data.details ? '\nDetails: ' + data.details : ''}`);
      }
    } catch (error) {
      console.error('Network error fetching link token:', error);
      alert('Network error: Failed to connect to server. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  // This function handles the successful bank connection
  const onPlaidSuccess = async (public_token: string) => {
    try {
      const response = await fetch('/api/exchange_public_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_token }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Bank account connected successfully!');
        onSuccess?.();
      } else {
        console.error('Error:', data.error);
        alert('Failed to connect bank account. Please try again.');
      }
    } catch (error) {
      console.error('Error exchanging token:', error);
      alert('Failed to connect bank account. Please try again.');
    }
  };

  // Initialize Plaid Link
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: onPlaidSuccess,
    onExit: (err, metadata) => {
      if (err) {
        console.error('Plaid Link error:', err);
      }
      setLinkToken(null); // Reset for next time
    },
  });

  const handleClick = () => {
    if (linkToken && ready) {
      // If we already have a token, open the link
      open();
    } else {
      // Otherwise, fetch a new token first
      fetchLinkToken();
    }
  };

  // Auto-open Plaid Link when token is ready
  if (linkToken && ready) {
    open();
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 disabled:bg-blue-300 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
    >
      {loading ? 'Connecting...' : '🏦 Connect Bank Account'}
    </button>
  );
} 