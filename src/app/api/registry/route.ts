import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Use the GitHub API directly to bypass aggressive CDN caching on raw.githubusercontent.com
        const url = 'https://api.github.com/repos/naman-cap/yaml-fixer/contents/endpoints-registry.json';

        const timestamp = new Date().getTime();
        const response = await fetch(`${url}?t=${timestamp}`, {
            headers: {
                'Accept': 'application/vnd.github.v3.raw',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                // Always use token if available to prevent rate limits and force fresh data
                ...(process.env.GITHUB_TOKEN ? { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` } : {})
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
