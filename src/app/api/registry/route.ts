import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Fetch directly from the raw GitHub user content
        // Alternatively, we could fetch via the GitHub REST API if auth is needed.
        const url = 'https://raw.githubusercontent.com/naman-cap/yaml-fixer/main/endpoints-registry.json';

        // Add a cache buster parameter to ensure we get the latest
        const timestamp = new Date().getTime();
        const response = await fetch(`${url}?t=${timestamp}`, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

        if (!response.ok) {
            console.error(`Failed to fetch registry from GitHub: ${response.status} ${response.statusText}`);
            throw new Error(`Failed to fetch registry from GitHub: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching registry:', error);
        return NextResponse.json(
            { error: 'Failed to fetch registry' },
            { status: 500 }
        );
    }
}
