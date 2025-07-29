// 참고: 브라우저에서 직접 Steam API를 호출하면 CORS(Cross-Origin Resource Sharing) 오류가 발생합니다.
// 이를 해결하기 위해 CORS 프록시를 사용하여 API 요청을 중계합니다.
// 참고: CORS 프록시는 불안정할 수 있으며, 작동하지 않을 경우 다른 프록시로 교체해야 할 수 있습니다.
export const STEAM_API_BASE_URL = 'https://cors.eu.org/https://api.steampowered.com';

// Steam API 엔드포인트
export const GET_PLAYER_SUMMARIES_URL = `${STEAM_API_BASE_URL}/ISteamUser/GetPlayerSummaries/v0002/`;
export const GET_OWNED_GAMES_URL = `${STEAM_API_BASE_URL}/IPlayerService/GetOwnedGames/v0001/`;
export const GET_PLAYER_ACHIEVEMENTS_URL = `${STEAM_API_BASE_URL}/ISteamUserStats/GetPlayerAchievements/v0001/`;
export const GET_RECENTLY_PLAYED_GAMES_URL = `${STEAM_API_BASE_URL}/IPlayerService/GetRecentlyPlayedGames/v0001/`;
export const GET_GLOBAL_ACHIEVEMENT_PERCENTAGES_URL = `${STEAM_API_BASE_URL}/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/`;
export const GET_BADGES_URL = `${STEAM_API_BASE_URL}/IPlayerService/GetBadges/v0001/`;
export const GET_NEWS_FOR_APP_URL = `${STEAM_API_BASE_URL}/ISteamNews/GetNewsForApp/v0002/`;