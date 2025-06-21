import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PlaidApi, Configuration, PlaidEnvironments } from 'plaid';

const plaidClient = new PlaidApi(new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV as keyof typeof PlaidEnvironments],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
}));

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // For now, we'll hardcode a test access token since we haven't implemented storage yet
    // In a real app, you'd fetch this from your database using the userId
    const TEST_ACCESS_TOKEN = 'access-sandbox-test-token'; // This won't work yet

    // TODO: Replace with actual access token from database
    // const userBankConnection = await getUserBankConnection(userId);
    // if (!userBankConnection) {
    //   return NextResponse.json({ error: "No bank accounts connected" }, { status: 404 });
    // }

    console.log('Fetching accounts for user:', userId);
    
    // For now, return mock data to show the UI structure
    const mockAccounts = [
      {
        account_id: 'mock_checking',
        name: 'Checking Account',
        type: 'depository',
        subtype: 'checking',
        balances: {
          available: 2500.50,
          current: 2500.50
        }
      },
      {
        account_id: 'mock_savings',
        name: 'Savings Account', 
        type: 'depository',
        subtype: 'savings',
        balances: {
          available: 15000.00,
          current: 15000.00
        }
      }
    ];

    return NextResponse.json({ accounts: mockAccounts });

  } catch (error: any) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json({ 
      error: "Failed to fetch accounts",
      details: error.message 
    }, { status: 500 });
  }
} 