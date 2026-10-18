
import { config } from "@/data/config";

// unauthenticated github api = 60 req/hr per ip; 5min cache -> ~12 req/hr
// throws on failure: errors aren't cached, so bad fetch retries next request
export async function getGithubStars(): Promise<number> {
  const res = await fetch(
    `https://api.github.com/repos/${config.githubUsername}/${config.githubRepo}`,
    { headers: { Accept: "application/vnd.github+json" }, cache: "force-cache" },
  );
  if (!res.ok) {
    throw new Error(`GitHub API responded with ${res.status}`);
  }

  const data = await res.json();
  if (typeof data.stargazers_count !== "number") {
    throw new Error("Unexpected GitHub API response shape");
  }
  return data.stargazers_count;
}
