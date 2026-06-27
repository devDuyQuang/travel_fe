export type TeamMember = {
  id: number;
  name: string;
  slug: string;
  job_title?: string | null;
  department?: string | null;
  avatar?: string | null;
  phone?: string | null;
  email?: string | null;
  zalo_url?: string | null;
  facebook_url?: string | null;
  linkedin_url?: string | null;
  short_description?: string | null;
  show_on_team?: boolean;
  show_in_quick_panel?: boolean;
};
