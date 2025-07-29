export interface IPlayerSummary {
    steamid: string;
    personaname: string;
    profileurl: string;
    avatarfull: string;
    personastate: number;
    communityvisibilitystate: number;
    profilestate?: number;
    lastlogoff?: number;
    realname?: string;
    primaryclanid?: string;
    timecreated?: number;
    loccountrycode?: string;
    locstatecode?: string;
    loccityid?: number;
}

export interface IGame {
    appid: number;
    name: string;
    playtime_forever: number;
    img_icon_url: string;
    img_logo_url: string;
    rtime_last_played: number;
    achievement_percent?: number;
}

export interface IOwnedGamesResponse {
    game_count: number;
    games: IGame[];
}

export interface IRecentlyPlayedGame {
    appid: number;
    name: string;
    playtime_2weeks: number;
    playtime_forever: number;
    img_icon_url: string;
    img_logo_url: string;
}

export interface IRecentlyPlayedGamesResponse {
    total_count: number;
    games: IRecentlyPlayedGame[];
}

export interface IAchievement {
    apiname: string;
    achieved: number;
    unlocktime: number;
    name?: string;
    description?: string;
}

export interface IPlayerAchievementsResponse {
    playerstats: {
        steamID: string;
        gameName: string;
        achievements: IAchievement[];
        success: boolean;
    }
}

export interface IGlobalAchievement {
    name: string;
    percent: number;
}

export interface IGlobalAchievementPercentages {
    achievementpercentages: {
        achievements: IGlobalAchievement[];
    }
}

export interface IBadge {
    badgeid: number;
    level: number;
    completion_time: number;
    xp: number;
    scarcity: number;
    appid?: number;
    border_color?: number;
}

export interface IBadgesResponse {
    badges: IBadge[];
    player_xp: number;
    player_level: number;
    player_xp_needed_to_level_up: number;
    player_xp_needed_current_level: number;
}

export interface INewsItem {
    gid: string;
    title: string;
    url: string;
    is_external_url: boolean;
    author: string;
    contents: string;
    feedlabel: string;
    date: number; // Unix timestamp
    feedname: string;
    feed_type: number;
    appid: number;
}

export interface INewsForAppResponse {
    appnews: {
        appid: number;
        newsitems: INewsItem[];
    };
}