export interface PullRequest {
  number: number;
  title: string;
  author: string;
  url: string;
  votes: number;
  createdAt: string;
  isMergeable: boolean;
  checksPassed: boolean;
}

interface GitHubPR {
  number: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
  created_at: string;
  head: {
    sha: string;
  };
}

interface GitHubReaction {
  content: string;
}

interface GitHubPRDetail {
  mergeable: boolean | null;
}

interface GitHubCommitStatus {
  state: "failure" | "pending" | "success" | "error";
}

const GITHUB_REPO = "skridlevsky/openchaos";

export async function getOpenPRs(): Promise<PullRequest[]> {
  const [owner, repo] = GITHUB_REPO.split("/");

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls?state=open`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    }
  );

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Rate limited by GitHub API");
    }
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const prs: GitHubPR[] = await response.json();

  // Fetch reactions and status for each PR
  const prsWithVotes = await Promise.all(
    prs.map(async (pr) => {
      const votes = await getPRVotes(owner, repo, pr.number);
      const isMergeable = await getPRMergeStatus(owner, repo, pr.number);
      const checksPassed = await getCommitStatus(owner, repo, pr.head.sha);

      return {
        number: pr.number,
        title: pr.title,
        author: pr.user.login,
        url: pr.html_url,
        votes,
        createdAt: pr.created_at,
        isMergeable,
        checksPassed,
      };
    })
  );

  // Sort by votes descending
  return prsWithVotes.sort((a, b) => b.votes - a.votes);
}

async function getPRVotes(
  owner: string,
  repo: string,
  prNumber: number
): Promise<number> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/reactions`,
    {
      headers: {
        Accept: "application/vnd.github.squirrel-girl-preview+json",
      },
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) {
    return 0;
  }

  const reactions: GitHubReaction[] = await response.json();
  return reactions.filter((r) => r.content === "+1").length;
}

async function getPRMergeStatus(
  owner: string,
  repo: string,
  prNumber: number
): Promise<boolean> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) {
    return false;
  }

  const data: GitHubPRDetail = await response.json();
  return data.mergeable ?? false;
}

async function getCommitStatus(
  owner: string,
  repo: string,
  sha: string
): Promise<boolean> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits/${sha}/status`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 60 },
    }
  );

  if (!response.ok) {
    return false;
  }

  const data: GitHubCommitStatus = await response.json();
  return data.state === "success";
}
