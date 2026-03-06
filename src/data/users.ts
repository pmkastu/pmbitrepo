// Users data loaded from users_1500.json for leaderboard and mock data

export interface AppUser {
  user_name: string;
  streak: number;
  last_login: string | null;
  total_points: number;
  mastery_data: {
    Technical: number;
    "Soft Skills": number;
    "General Knowledge": number;
  };
  badges: string[];
  daily_goal: number;
  completed_today: number;
}

let _users: AppUser[] = [];
let _loaded = false;
let _loadPromise: Promise<void> | null = null;

export async function loadUsers(): Promise<AppUser[]> {
  if (_loaded) return _users;
  if (_loadPromise) {
    await _loadPromise;
    return _users;
  }
  _loadPromise = fetch("/data/users_1500.json")
    .then((res) => res.json())
    .then((data: AppUser[]) => {
      _users = data;
      _loaded = true;
    })
    .catch((err) => {
      console.error("Failed to load users:", err);
      _users = [];
      _loaded = true;
    });
  await _loadPromise;
  return _users;
}

export function getUsers(): AppUser[] {
  return _users;
}

// Get top users by total_points
export function getLeaderboard(limit = 20): AppUser[] {
  return [..._users].sort((a, b) => b.total_points - a.total_points).slice(0, limit);
}

// Get top users by streak
export function getStreakLeaderboard(limit = 20): AppUser[] {
  return [..._users].sort((a, b) => b.streak - a.streak).slice(0, limit);
}

export { _users as users };
