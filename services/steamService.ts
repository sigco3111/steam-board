import { 
    GET_PLAYER_SUMMARIES_URL, 
    GET_OWNED_GAMES_URL, 
    GET_PLAYER_ACHIEVEMENTS_URL,
    GET_RECENTLY_PLAYED_GAMES_URL,
    GET_GLOBAL_ACHIEVEMENT_PERCENTAGES_URL,
    GET_BADGES_URL,
    GET_NEWS_FOR_APP_URL
} from '../constants';
import { 
    IPlayerSummary, 
    IOwnedGamesResponse, 
    IGame, 
    IPlayerAchievementsResponse, 
    IRecentlyPlayedGamesResponse, 
    IRecentlyPlayedGame,
    IGlobalAchievementPercentages,
    IBadgesResponse,
    INewsForAppResponse,
    INewsItem
} from '../types';

// Helper function to handle fetch requests and errors
async function fetchSteamAPI<T,>(url: string): Promise<T> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorBody = await response.text().catch(() => '(could not read error body)');
            throw new Error(`Steam API 요청 실패: ${response.status} ${response.statusText}. 응답: ${errorBody}`);
        }
        const data = await response.json();
        // Steam API can return an empty response object for private profiles or invalid IDs
        if (Object.keys(data).length === 0 || (data.response && Object.keys(data.response).length === 0)) {
            return null as T;
        }
        return data;
    } catch (e: any) {
        if (e.message.includes('Failed to fetch')) {
             throw new Error('네트워크 오류 또는 CORS 프록시 문제일 수 있습니다. 프록시 서버가 응답하지 않는 것 같습니다.');
        }
        // Re-throw other errors, potentially from JSON parsing or the manual error thrown above
        throw e;
    }
}

export const getPlayerSummaries = async (steamId: string, apiKey: string): Promise<IPlayerSummary | null> => {
    if (!apiKey) throw new Error("Steam API 키가 필요합니다.");
    const url = `${GET_PLAYER_SUMMARIES_URL}?key=${apiKey}&steamids=${steamId}`;
    try {
        const data = await fetchSteamAPI<{ response: { players: IPlayerSummary[] } }>(url);
        return data?.response?.players[0] || null;
    } catch (error) {
        console.error("Error fetching player summaries:", error);
        throw error;
    }
};

export const getOwnedGames = async (steamId: string, apiKey: string): Promise<IGame[]> => {
    if (!apiKey) throw new Error("Steam API 키가 필요합니다.");
    const url = `${GET_OWNED_GAMES_URL}?key=${apiKey}&steamid=${steamId}&format=json&include_appinfo=1&include_played_free_games=1`;
    try {
        const data = await fetchSteamAPI<{ response: IOwnedGamesResponse }>(url);
        if (!data || !data.response || !data.response.games) return [];
        
        return data.response.games;
    } catch (error) {
        console.error("Error fetching owned games:", error);
        throw error;
    }
};

export const getRecentlyPlayedGames = async (steamId: string, apiKey: string): Promise<IRecentlyPlayedGame[]> => {
    if (!apiKey) throw new Error("Steam API 키가 필요합니다.");
    const url = `${GET_RECENTLY_PLAYED_GAMES_URL}?key=${apiKey}&steamid=${steamId}&format=json`;
    try {
        const data = await fetchSteamAPI<{ response: IRecentlyPlayedGamesResponse }>(url);
        if (!data || !data.response || !data.response.games) return [];
        return data.response.games;
    } catch (error) {
        console.error("Error fetching recently played games:", error);
        throw new Error("최근 플레이한 게임 정보를 불러오는데 실패했습니다.");
    }
}

export const getPlayerAchievements = async (steamId: string, appId: number, apiKey: string): Promise<IPlayerAchievementsResponse | null> => {
    if (!apiKey) throw new Error("Steam API 키가 필요합니다.");
    const url = `${GET_PLAYER_ACHIEVEMENTS_URL}?key=${apiKey}&steamid=${steamId}&appid=${appId}&l=korean`;
    try {
        const data = await fetchSteamAPI<IPlayerAchievementsResponse>(url);
        
        if (!data) {
            // This can happen for games without stats, private profiles, or other API issues handled by fetchSteamAPI
            return null;
        }

        // The achievements API can return an error object even with a 200 OK status, e.g., {"playerstats":{"error":"Requested app has no stats","success":false}}
        if(data.playerstats && (data.playerstats as any).error) {
            // This is an expected case for games without achievements, so we don't throw an error, just return null.
            console.warn(`Note: Could not get achievements for appID ${appId}. Reason: ${(data.playerstats as any).error}`);
            return null;
        }

        if (!data.playerstats || !data.playerstats.success) {
            return null;
        }
        return data;
    } catch (error) {
        // This will catch network errors from fetchSteamAPI or other unexpected issues.
        console.error(`Error fetching player achievements for appID ${appId}:`, error);
        // Return null to allow other operations (like perfect game calculation) to continue without crashing.
        return null;
    }
};

export const getGlobalAchievementPercentages = async (appId: number, apiKey: string): Promise<IGlobalAchievementPercentages | null> => {
    // Note: This specific endpoint might not require an API key, but it's good practice to include it for consistency
    // if other similar endpoints do. However, the official docs suggest it doesn't. We'll try without.
    const url = `${GET_GLOBAL_ACHIEVEMENT_PERCENTAGES_URL}?gameid=${appId}`;
     try {
        const data = await fetchSteamAPI<{ achievementpercentages: IGlobalAchievementPercentages['achievementpercentages'] }>(url);
        return data ? { achievementpercentages: data.achievementpercentages } : null;
    } catch (error) {
        console.error("Error fetching global achievement percentages:", error);
        return null; // Return null on error instead of throwing to not break the UI
    }
};

export const getPlayerBadges = async (steamId: string, apiKey: string): Promise<IBadgesResponse | null> => {
    if (!apiKey) throw new Error("Steam API 키가 필요합니다.");
    const url = `${GET_BADGES_URL}?key=${apiKey}&steamid=${steamId}`;
    try {
        const data = await fetchSteamAPI<{ response: IBadgesResponse }>(url);
        return data?.response || null;
    } catch (error) {
        console.error("Error fetching player badges:", error);
        return null;
    }
};

export const getNewsForApp = async (appId: number, apiKey: string): Promise<INewsItem[] | null> => {
    if (!apiKey) throw new Error("Steam API 키가 필요합니다.");
    // count=5: 5 aitems, maxlength=300: 300 characters
    const url = `${GET_NEWS_FOR_APP_URL}?appid=${appId}&count=5&maxlength=300&format=json`;
    try {
        const data = await fetchSteamAPI<INewsForAppResponse>(url);
        return data?.appnews?.newsitems || null;
    } catch (error) {
        console.error(`Error fetching news for appID ${appId}:`, error);
        return null; // Don't crash the app if news fails
    }
};