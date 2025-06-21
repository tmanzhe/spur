import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PlaidApi, Configuration, PlaidEnvironments } from 'plaid';

const plaidClient = new PlaidApi(new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV!],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
}));

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { public_token } = await request.json();

  if (!public_token) {
    return NextResponse.json({ error: "Public token is required" }, { status: 400 });
  }

  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const { access_token, item_id } = response.data;

    // TODO: Save access_token and item_id to your database
    // For now, we'll just log them and return success
    console.log(`User ${userId} connected bank account:`, {
      access_token: access_token.substring(0, 10) + '...',
      item_id,
    });

    // In a real app, you would save these to your database:
    // await saveUserBankConnection(userId, access_token, item_id);

    return NextResponse.json({ 
      success: true,
      message: "Bank account connected successfully!"
    });
  } catch (error) {
    console.error("Error exchanging public token:", error);
    return NextResponse.json({ error: "Failed to exchange token" }, { status: 500 });
  }
} 