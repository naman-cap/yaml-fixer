import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export async function POST(request: Request) {
    try {
        const { specs, registry } = await request.json();

        // Check for GITHUB_TOKEN
        const token = process.env.GITHUB_TOKEN;
        if (!token) {
            return NextResponse.json({ error: "GITHUB_TOKEN env variable is missing on server." }, { status: 500 });
        }

        const octokit = new Octokit({ auth: token });
        const owner = "naman-cap";
        const repo = "yaml-fixer";
        const branch = "main";

        // 1. Get branch reference
        const { data: refData } = await octokit.git.getRef({
            owner,
            repo,
            ref: `heads/${branch}`,
        });
        const commitSha = refData.object.sha;

        // 2. Get commit details
        const { data: commitData } = await octokit.git.getCommit({
            owner,
            repo,
            commit_sha: commitSha,
        });
        const treeSha = commitData.tree.sha;

        // 3. Create blobs for specs and registry
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tree: any[] = [];

        if (registry) {
            const { data: blob } = await octokit.git.createBlob({
                owner,
                repo,
                content: JSON.stringify(registry, null, 2),
                encoding: "utf-8",
            });
            tree.push({
                path: "endpoints-registry.json",
                mode: "100644",
                type: "blob",
                sha: blob.sha,
            });
        }

        for (const spec of specs) {
            const { data: blob } = await octokit.git.createBlob({
                owner,
                repo,
                content: spec.content,
                encoding: "utf-8",
            });
            tree.push({
                path: `specs/${spec.filename}`, // Maintain split files under 'specs/' folder
                mode: "100644",
                type: "blob",
                sha: blob.sha,
            });
        }

        // 4. Create a new tree
        const { data: newTree } = await octokit.git.createTree({
            owner,
            repo,
            base_tree: treeSha,
            tree,
        });

        // 5. Create new commit
        const { data: newCommit } = await octokit.git.createCommit({
            owner,
            repo,
            message: "feat: auto-split and upload API specs, update registry",
            tree: newTree.sha,
            parents: [commitSha],
        });

        // 6. Update reference
        await octokit.git.updateRef({
            owner,
            repo,
            ref: `heads/${branch}`,
            sha: newCommit.sha,
        });

        return NextResponse.json({ success: true, commitUrl: newCommit.html_url });
    } catch (error: unknown) {
        console.error("GitHub push error:", error);
        const msg = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
