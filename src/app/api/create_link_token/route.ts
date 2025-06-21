import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PlaidApi, Configuration, PlaidEnvironments, Products, CountryCode } from 'plaid';

console.log('Environment check:', {
  PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID ? 'SET' : 'MISSING',
  PLAID_SECRET: process.env.PLAID_SECRET ? 'SET' : 'MISSING',
  PLAID_ENV: process.env.PLAID_ENV
});

const plaidClient = new PlaidApi(new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV as keyof typeof PlaidEnvironments],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
}));

export async function POST(request: Request) {
  console.log('POST /api/create_link_token called');
  
  try {
    // FIXED: await the auth() function
    const authData = await auth();
    console.log('Full auth data:', authData);
    
    const { userId } = authData;
    console.log('User ID from Clerk:', userId);

    if (!userId) {
      console.log('No user ID found - user not authenticated');
      console.log('Request headers:', Object.fromEntries(request.headers.entries()));
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const requestBody = {
      user: {
        // This is the key part: associating the Plaid item with your user.
        client_user_id: userId,
      },
      client_name: 'My Financial App',
      products: [Products.Auth, Products.Transactions],
      country_codes: [CountryCode.Ca],
      language: 'en',
    };

    console.log('Calling Plaid linkTokenCreate with request:', JSON.stringify(requestBody, null, 2));

    const response = await plaidClient.linkTokenCreate(requestBody);
    const linkToken = response.data.link_token;
    
    console.log('Successfully created link token');
    return NextResponse.json({ linkToken });
  } catch (error: any) {
    console.error("Detailed error creating link token:");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error response:", error.response?.data);
    console.error("Full error:", error);
    
    return NextResponse.json({ 
      error: "Failed to create link token",
      details: error.message 
    }, { status: 500 });
  }
} 