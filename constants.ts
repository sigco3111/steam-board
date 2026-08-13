// 참고: 브라우저에서 직접 Steam API를 호출하면 CORS(Cross-Origin Resource Sharing) 오류가 발생합니다.
// 해결: 자체 Vercel serverless 프록시 (steam-board.vercel.app/api/cors?url=...)를 통해 호출
// 참고: services/steamService.ts의 fetchSteamAPI가 자동으로 CORS 프록시 prefix 적용
export const STEAM_API_BASE_URL = 'https://api.steampowered.com';

// Steam API 엔드포인트
export const GET_PLAYER_SUMMARIES_URL = `${STEAM_API_BASE_URL}/ISteamUser/GetPlayerSummaries/v0002/`;
export const GET_OWNED_GAMES_URL = `${STEAM_API_BASE_URL}/IPlayerService/GetOwnedGames/v0001/`;
export const GET_PLAYER_ACHIEVEMENTS_URL = `${STEAM_API_BASE_URL}/ISteamUserStats/GetPlayerAchievements/v0001/`;
export const GET_RECENTLY_PLAYED_GAMES_URL = `${STEAM_API_BASE_URL}/IPlayerService/GetRecentlyPlayedGames/v0001/`;
export const GET_GLOBAL_ACHIEVEMENT_PERCENTAGES_URL = `${STEAM_API_BASE_URL}/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/`;
export const GET_BADGES_URL = `${STEAM_API_BASE_URL}/IPlayerService/GetBadges/v0001/`;
export const GET_NEWS_FOR_APP_URL = `${STEAM_API_BASE_URL}/ISteamNews/GetNewsForApp/v0002/`;
