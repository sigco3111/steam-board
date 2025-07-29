import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { getPlayerSummaries, getOwnedGames, getPlayerAchievements, getRecentlyPlayedGames, getGlobalAchievementPercentages, getPlayerBadges, getNewsForApp } from './services/steamService';
import { SteamIdInput } from './components/SteamIdInput';
import { UserProfileCard } from './components/UserProfileCard';
import { GameGrid } from './components/GameGrid';
import { GameDetailModal } from './components/GameDetailModal';
import { IPlayerSummary, IGame, IPlayerAchievementsResponse, IRecentlyPlayedGame, IGlobalAchievementPercentages, IBadgesResponse, INewsItem } from './types';
import { WarningIcon } from './components/Icons';
import { ApiKeyInput } from './components/ApiKeyInput';
import { DashboardStats, PlaytimeChart, RecentlyPlayedSection } from './components/DashboardWidgets';
import { RecommendationModal } from './components/RecommendationModal';

const CACHE_KEY_PREFIX = 'steamDashboardCache';
const CACHE_DURATION_MS = 3600 * 1000; // 1 hour

const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`bg-gray-700/50 animate-pulse rounded-xl ${className}`} />
);

const DashboardSkeleton: React.FC = () => {
    return (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Profile Skeleton */}
            <div className="lg:col-span-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6 animate-pulse">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gray-700"></div>
                    <div className="flex-1 space-y-3 w-full sm:w-auto text-center sm:text-left">
                        <div className="h-8 w-48 bg-gray-700 rounded mx-auto sm:mx-0"></div>
                        <div className="h-4 w-32 bg-gray-700 rounded mx-auto sm:mx-0"></div>
                    </div>
                </div>
            </div>

            {/* Stats Skeleton */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SkeletonCard className="h-24" />
                <SkeletonCard className="h-24" />
                <SkeletonCard className="h-24" />
                <SkeletonCard className="h-24" />
            </div>

            {/* Widgets Skeleton */}
            <SkeletonCard className="lg:col-span-1 h-[400px]" />
            <SkeletonCard className="lg:col-span-2 h-[400px]" />

            {/* Game Grid Skeleton */}
            <div className="lg:col-span-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6 animate-pulse">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="h-8 w-48 bg-gray-700 rounded"></div>
                    <div className="h-10 w-full sm:w-64 bg-gray-700 rounded-lg"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {Array.from({ length: 10 }).map((_, i) => (
                         <div key={i} className="rounded-lg overflow-hidden bg-gray-800">
                            <SkeletonCard className="h-32 rounded-b-none" />
                            <div className="p-4 space-y-2">
                                <SkeletonCard className="h-4 w-3/4" />
                                <SkeletonCard className="h-4 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const App: React.FC = () => {
    const [steamApiKey, setSteamApiKey] = useState<string>(() => localStorage.getItem('steamApiKey') || '');
    
    const [steamId, setSteamId] = useState<string>('');
    const [playerSummary, setPlayerSummary] = useState<IPlayerSummary | null>(null);
    const [ownedGames, setOwnedGames] = useState<IGame[]>([]);
    const [recentlyPlayed, setRecentlyPlayed] = useState<IRecentlyPlayedGame[]>([]);
    const [badgesInfo, setBadgesInfo] = useState<IBadgesResponse | null>(null);
    const [selectedGame, setSelectedGame] = useState<IGame | null>(null);
    const [achievements, setAchievements] = useState<IPlayerAchievementsResponse | null>(null);
    const [globalAchievements, setGlobalAchievements] = useState<IGlobalAchievementPercentages | null>(null);
    const [news, setNews] = useState<INewsItem[] | null>(null);
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalContentLoading, setIsModalContentLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [recommendedGame, setRecommendedGame] = useState<IGame | null>(null);
    const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);

    const handleApiKeySave = (steamKey: string) => {
        localStorage.setItem('steamApiKey', steamKey);
        setSteamApiKey(steamKey);
    };

    const handleSearch = useCallback(async (searchSteamId: string) => {
        if (!searchSteamId) {
            setError('Steam ID를 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setError(null);
        
        try {
            const summary = await getPlayerSummaries(searchSteamId, steamApiKey);
            if (!summary) {
                throw new Error('유효한 Steam ID를 찾을 수 없습니다. 프로필이 공개 상태인지 확인해주세요.');
            }
            localStorage.setItem('steamId', searchSteamId);
            setPlayerSummary(summary);
            setSteamId(searchSteamId);

            const [gamesData, recentGamesData, badgesData] = await Promise.all([
                getOwnedGames(searchSteamId, steamApiKey),
                getRecentlyPlayedGames(searchSteamId, steamApiKey),
                getPlayerBadges(searchSteamId, steamApiKey)
            ]);
            
            setOwnedGames(gamesData);
            setRecentlyPlayed(recentGamesData);
            setBadgesInfo(badgesData);

             const cachePayload = {
                summary,
                games: gamesData,
                recentGames: recentGamesData,
                badges: badgesData,
                timestamp: Date.now()
            };
            localStorage.setItem(`${CACHE_KEY_PREFIX}_${searchSteamId}`, JSON.stringify(cachePayload));

        } catch (err: any) {
            setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
            setPlayerSummary(null);
            setOwnedGames([]);
            setRecentlyPlayed([]);
            setBadgesInfo(null);
        } finally {
            setIsLoading(false);
        }
    }, [steamApiKey]);

    useEffect(() => {
        const savedApiKey = localStorage.getItem('steamApiKey');
        const savedSteamId = localStorage.getItem('steamId');
        if (savedApiKey && savedSteamId) {
            const cachedDataString = localStorage.getItem(`${CACHE_KEY_PREFIX}_${savedSteamId}`);
            if(cachedDataString) {
                const { summary, games, recentGames, badges, timestamp } = JSON.parse(cachedDataString);
                if(Date.now() - timestamp < CACHE_DURATION_MS) {
                    setPlayerSummary(summary);
                    setOwnedGames(games);
                    setRecentlyPlayed(recentGames);
                    setBadgesInfo(badges);
                    setSteamId(savedSteamId);
                    setError(null);
                    return; // Use cached data
                }
            }
            handleSearch(savedSteamId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const dashboardData = useMemo(() => {
        if (!ownedGames || ownedGames.length === 0) {
            return { totalPlaytime: 0, mostPlayedGame: null, chartData: [] };
        }
        const totalPlaytime = ownedGames.reduce((acc, game) => acc + game.playtime_forever, 0);
        const mostPlayedGame = ownedGames.reduce((max, game) => (game.playtime_forever > max.playtime_forever ? game : max), ownedGames[0]);

        const topGames = [...ownedGames].sort((a, b) => b.playtime_forever - a.playtime_forever).slice(0, 7);
        const otherPlaytime = ownedGames.slice(7).reduce((acc, game) => acc + game.playtime_forever, 0);

        const chartData = topGames.map(game => ({
            name: game.name,
            value: Math.round(game.playtime_forever / 60)
        }));

        if (otherPlaytime > 0) {
             chartData.push({ name: '기타', value: Math.round(otherPlaytime / 60) });
        }

        return { totalPlaytime, mostPlayedGame, chartData };
    }, [ownedGames]);

    const handleGameSelect = useCallback(async (game: IGame) => {
        setSelectedGame(game);
        setIsModalContentLoading(true);
        setAchievements(null);
        setGlobalAchievements(null);
        setNews(null);
        setError(null);

        try {
            const [achievementData, globalData, newsData] = await Promise.all([
                getPlayerAchievements(steamId, game.appid, steamApiKey),
                getGlobalAchievementPercentages(game.appid, steamApiKey),
                getNewsForApp(game.appid, steamApiKey)
            ]);
            setAchievements(achievementData);
            setGlobalAchievements(globalData);
            setNews(newsData);
            
            // Calculate and store achievement percentage
            const playerAchievements = achievementData?.playerstats?.achievements;
            let percent = -1; // -1 indicates no data to calculate
            if (playerAchievements && playerAchievements.length > 0) {
                const unlockedCount = playerAchievements.filter(a => a.achieved === 1).length;
                percent = Math.round((unlockedCount / playerAchievements.length) * 100);
            } else if (achievementData?.playerstats?.success) {
                // Game has stats, but 0 achievements or player has 0 unlocked
                percent = 0;
            }
            
            if (percent !== -1) {
                setOwnedGames(prev => prev.map(g => g.appid === game.appid ? {...g, achievement_percent: percent} : g));
            }

        } catch (err: any) {
            console.error("업적 및 뉴스 정보 로딩 실패:", err);
            setError(`'${game.name}'의 상세 정보를 불러올 수 없습니다.`);
        } finally {
            setIsModalContentLoading(false);
        }
    }, [steamId, steamApiKey]);

    const handleRecommendClick = useCallback(() => {
        if (ownedGames.length === 0) return;

        // 우선 순위 1: 플레이하지 않은 게임
        const unplayedGames = ownedGames.filter(g => g.playtime_forever === 0);
        
        let gameToRecommend: IGame;

        if (unplayedGames.length > 0) {
            // 플레이하지 않은 게임 중에서 랜덤 선택
            gameToRecommend = unplayedGames[Math.floor(Math.random() * unplayedGames.length)];
        } else {
            // 모든 게임을 플레이했다면, 가장 적게 플레이한 10개 게임 중 랜덤 선택
            const sortedByPlaytime = [...ownedGames].sort((a,b) => a.playtime_forever - b.playtime_forever);
            const leastPlayed = sortedByPlaytime.slice(0, 10);
            gameToRecommend = leastPlayed[Math.floor(Math.random() * leastPlayed.length)];
        }

        setRecommendedGame(gameToRecommend);
        setIsRecommendModalOpen(true);
    }, [ownedGames]);

    const closeModal = () => {
        setSelectedGame(null);
        setAchievements(null);
        setGlobalAchievements(null);
        setNews(null);
    };
    
    const containerVariants: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    };

    const itemVariants: Variants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 100
        }
      }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                        스팀 대시보드
                    </h1>
                    <p className="text-gray-400 mt-2">당신의 Steam 프로필과 게임 통계를 분석해보세요.</p>
                </header>

                {!steamApiKey ? (
                    <ApiKeyInput onSave={handleApiKeySave} />
                ) : (
                    <>
                        <SteamIdInput onSearch={handleSearch} isLoading={isLoading} />
                
                        {isLoading && <DashboardSkeleton />}

                        {error && !isLoading && (
                             <div className="mt-8 max-w-2xl mx-auto bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative flex items-center gap-4">
                                <WarningIcon className="h-6 w-6 text-red-400"/>
                                <div>
                                    <strong className="font-bold">오류:</strong>
                                    <span className="block sm:inline ml-2">{error}</span>
                                </div>
                            </div>
                        )}
                        
                        {!isLoading && playerSummary && (
                            <motion.div 
                                className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                <motion.div className="lg:col-span-3" variants={itemVariants}>
                                    <UserProfileCard 
                                        player={playerSummary}
                                        badgesInfo={badgesInfo}
                                    />
                                </motion.div>
                                <motion.div className="lg:col-span-3" variants={itemVariants}>
                                    <DashboardStats 
                                        totalPlaytime={dashboardData.totalPlaytime}
                                        gameCount={ownedGames.length}
                                        mostPlayedGame={dashboardData.mostPlayedGame}
                                        badgeCount={badgesInfo?.badges?.length ?? 0}
                                    />
                                </motion.div>
                                <motion.div className="lg:col-span-1" variants={itemVariants}>
                                    <RecentlyPlayedSection games={recentlyPlayed} />
                                </motion.div>
                                <motion.div className="lg:col-span-2" variants={itemVariants}>
                                   <PlaytimeChart data={dashboardData.chartData} />
                                </motion.div>
                                 <motion.div className="lg:col-span-3" variants={itemVariants}>
                                    <GameGrid games={ownedGames} onGameSelect={handleGameSelect} onRecommendRequest={handleRecommendClick} />
                                </motion.div>
                            </motion.div>
                        )}

                        {selectedGame && (
                            <GameDetailModal 
                                isOpen={!!selectedGame}
                                onClose={closeModal}
                                game={selectedGame}
                                achievementsData={achievements}
                                globalAchievementsData={globalAchievements}
                                newsData={news}
                                isLoading={isModalContentLoading}
                            />
                        )}

                        <RecommendationModal 
                            isOpen={isRecommendModalOpen}
                            onClose={() => setIsRecommendModalOpen(false)}
                            onReroll={handleRecommendClick}
                            game={recommendedGame}
                        />
                    </>
                )}
                 <footer className="text-center mt-12 text-gray-500 text-sm">
                    <p>Powered by Steam Web API. Not affiliated with Valve Corp.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;