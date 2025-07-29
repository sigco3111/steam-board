import React, { useMemo, useState } from 'react';
import { IGame, IPlayerAchievementsResponse, IGlobalAchievementPercentages, INewsItem } from '../types';
import { LoadingSpinner, TrophyIcon, GlobeIcon, NewsIcon } from './Icons';

interface GameDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    game: IGame;
    achievementsData: IPlayerAchievementsResponse | null;
    globalAchievementsData: IGlobalAchievementPercentages | null;
    newsData: INewsItem[] | null;
    isLoading: boolean;
}

const UnlockedAchievementIcon: React.FC<{ isRare: boolean }> = ({ isRare }) => (
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ring-1 ${isRare ? 'bg-yellow-500/20 ring-yellow-500' : 'bg-green-500/20 ring-green-500'}`}>
         <TrophyIcon className={`h-6 w-6 ${isRare ? 'text-yellow-300' : 'text-green-300'}`} />
    </div>
);
const LockedAchievementIcon: React.FC = () => (
    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center ring-1 ring-gray-600 opacity-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
    </div>
);

export const GameDetailModal: React.FC<GameDetailModalProps> = ({ isOpen, onClose, game, achievementsData, globalAchievementsData, newsData, isLoading }) => {
    const [activeTab, setActiveTab] = useState<'achievements' | 'news'>('achievements');

    // When the modal is opened for a new game, reset to the achievements tab
    React.useEffect(() => {
        if (isOpen) {
            setActiveTab('achievements');
        }
    }, [isOpen, game.appid]);

    if (!isOpen) return null;

    const processedAchievements = useMemo(() => {
        if (!achievementsData?.playerstats?.achievements) {
            return { unlockedCount: 0, totalCount: 0, percentage: 0, achievements: [] };
        }
        
        const playerAchievements = achievementsData.playerstats.achievements;
        const globalAchievementsMap = new Map(
            globalAchievementsData?.achievementpercentages.achievements.map(a => [a.name, a.percent])
        );

        const merged = playerAchievements.map(ach => {
            const globalPercentValue = globalAchievementsMap.get(ach.apiname);
            return {
                ...ach,
                global_percent: typeof globalPercentValue === 'number' ? globalPercentValue.toFixed(2) : undefined,
            };
        });

        const unlocked = merged.filter(a => a.achieved === 1).length;
        const total = merged.length;
        const percent = total > 0 ? Math.round((unlocked / total) * 100) : 0;
        
        const sorted = [...merged].sort((a, b) => {
            if (a.achieved !== b.achieved) {
                return b.achieved - a.achieved;
            }
             if(a.global_percent && b.global_percent) {
                return parseFloat(a.global_percent) - parseFloat(b.global_percent);
            }
            return b.unlocktime - a.unlocktime;
        });

        return { unlockedCount: unlocked, totalCount: total, percentage: percent, achievements: sorted };
    }, [achievementsData, globalAchievementsData]);

    const cleanBBCode = (text: string) => {
      // Simple regex to remove common BBCode tags but keep content
      return text.replace(/\[\/?(b|i|u|url|quote|h1|img|list|olist|\*)[^\]]*\]/gi, '').replace(/\[url=.*?\](.*?)\[\/url\]/gi, '$1').trim();
    };

    const renderAchievements = () => {
        const { unlockedCount, totalCount, percentage, achievements } = processedAchievements;
        if (totalCount === 0) {
            return (
                <div className="text-center py-10 text-gray-400">
                    이 게임에는 업적이 없거나, 프로필에서 업적 정보를 불러올 수 없습니다.
                </div>
            );
        }
        return (
            <>
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-teal-300">달성률</span>
                        <span className="font-bold text-white">{unlockedCount} / {totalCount} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-4">
                        <div 
                            className="bg-gradient-to-r from-teal-400 to-blue-500 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {achievements.map((ach) => {
                        const isRare = ach.achieved && ach.global_percent ? parseFloat(ach.global_percent) < 10 : false;
                        return (
                            <div key={ach.apiname} className={`flex items-center p-3 rounded-lg ${ach.achieved ? 'bg-gray-700/50' : 'bg-gray-900/50'}`}>
                                {ach.achieved ? 
                                    <UnlockedAchievementIcon isRare={isRare} /> : 
                                    <LockedAchievementIcon />
                                }
                                <div className="ml-4 flex-1">
                                    <h4 className={`font-bold ${isRare ? 'text-yellow-300' : ach.achieved ? 'text-white' : 'text-gray-400'}`}>{ach.name || ach.apiname}</h4>
                                    <p className="text-sm text-gray-400">{ach.description || '설명 없음'}</p>
                                </div>
                                <div className="text-right space-y-1">
                                    {ach.achieved && ach.unlocktime ? (
                                        <div className="text-xs text-gray-500">
                                            <p>{new Date(ach.unlocktime * 1000).toLocaleDateString('ko-KR')}</p>
                                        </div>
                                    ): null}
                                    {ach.global_percent && (
                                        <div className={`flex items-center justify-end text-xs gap-1 ${isRare ? 'text-yellow-400' : 'text-gray-400'}`}>
                                            <GlobeIcon className="h-4 w-4" />
                                            <span>{ach.global_percent}%</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </>
        );
    };

    const renderNews = () => {
        if (!newsData || newsData.length === 0) {
            return <div className="text-center py-10 text-gray-400">이 게임에 대한 최신 뉴스가 없습니다.</div>;
        }

        return (
            <div className="space-y-4">
                {newsData.map(item => (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" key={item.gid} className="block bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-200">
                        <h4 className="font-bold text-white text-lg mb-1">{item.title}</h4>
                        <div className="text-xs text-gray-400 mb-2">
                           <span>{new Date(item.date * 1000).toLocaleDateString('ko-KR')}</span> - <span className="font-semibold">{item.feedlabel}</span>
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-3">
                            {cleanBBCode(item.contents)}
                        </p>
                    </a>
                ))}
            </div>
        );
    };

    const TabButton: React.FC<{tabName: 'achievements' | 'news', label: string, icon: React.ReactNode}> = ({ tabName, label, icon }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tabName
                ? 'border-blue-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
            }`}
        >
            {icon}
            {label}
        </button>
    )

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-white">{game.name}</h2>
                        <p className="text-sm text-gray-400">게임 상세 정보</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                </header>

                <div className="px-6 border-b border-gray-700 flex-shrink-0">
                    <nav className="flex space-x-2">
                        <TabButton tabName="achievements" label="업적" icon={<TrophyIcon className="h-5 w-5"/>} />
                        <TabButton tabName="news" label="최신 뉴스" icon={<NewsIcon className="h-5 w-5"/>} />
                    </nav>
                </div>

                <div className="p-6 overflow-y-auto flex-grow">
                    {isLoading ? (
                         <div className="flex justify-center items-center h-64">
                            <LoadingSpinner className="h-10 w-10"/>
                        </div>
                    ) : (
                        activeTab === 'achievements' ? renderAchievements() : renderNews()
                    )}
                </div>
            </div>
        </div>
    );
};