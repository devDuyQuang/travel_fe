import type { TeamMember } from "@/types/team-member";

const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL || "http://api.localhost:8000";
const API_URL = `${API_ORIGIN.replace(/\/$/, "")}/api`;

type TeamResponse = {
  success?: boolean;
  data?: TeamMember[];
};

export async function getTeamMembers(options: { team?: boolean; quickPanel?: boolean; limit?: number } = {}) {
  try {
    const params = new URLSearchParams();
    if (options.team) params.set("team", "1");
    if (options.quickPanel) params.set("quick_panel", "1");
    if (options.limit) params.set("per_page", String(options.limit));

    const response = await fetch(`${API_URL}/team-members?${params.toString()}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return [];
    const json = (await response.json()) as TeamResponse;
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}
