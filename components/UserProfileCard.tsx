import React, { useMemo } from 'react';
import { IPlayerSummary, IBadgesResponse } from '../types';

interface UserProfileCardProps {
    player: IPlayerSummary;
    badgesInfo: IBadgesResponse | null;
}

const personaStates: { [key: number]: { text: string; color: string } } = {
    0: { text: "오프라인", color: "text-gray-400" },
    1: { text: "온라인", color: "text-green-400" },
    2: { text: "바쁨", color: "text-red-400" },
    3: { text: "자리 비움", color: "text-yellow-400" },
    4: { text: "수면", color: "text-blue-400" },
    5: { text: "거래 희망", color: "text-cyan-400" },
    6: { text: "플레이 희망", color: "text-purple-400" },
};

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ player, badgesInfo }) => {
    const status = personaStates[player.personastate] || personaStates[0];

    const hasBadgeInfo = badgesInfo && badgesInfo.player_level > 0;
    
    const xpProgress = useMemo(() => {
        if (!hasBadgeInfo) return 0;
        const current = badgesInfo.player_xp_needed_current_level;
        const needed = badgesInfo.player_xp_needed_to_level_up;
        const totalForLevel = current + needed;
        return totalForLevel > 0 ? (current / totalForLevel) * 100 : 0;
    }, [badgesInfo, hasBadgeInfo]);

    const getCountryFlagEmoji = (countryCode: string | undefined) => {
        if (!countryCode) return '🌍';
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    }
    
    const circumference = 2 * Math.PI * 15.9; // 2 * PI * r (r=15.9 for viewBox 36)

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-28 h-28 flex-shrink-0">
                    {hasBadgeInfo && (
                        <div className="absolute inset-0" title={`현재 경험치: ${badgesInfo.player_xp_needed_current_level.toLocaleString()} / 다음 레벨까지: ${badgesInfo.player_xp_needed_to_level_up.toLocaleString()} XP`}>
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="15.9" fill="none" className="stroke-current text-gray-700" strokeWidth="2"></circle>
                                <circle
                                    cx="18"
                                    cy="18"
                                    r="15.9"
                                    fill="none"
                                    className="stroke-current text-blue-400 transition-all duration-500"
                                    strokeWidth="2"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={circumference - (xpProgress / 100) * circumference}
                                    strokeLinecap="round"
                                    transform="rotate(-90 18 18)"
                                ></circle>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-full" style={{ margin: '14px' }}>
                                <span className="text-2xl font-bold text-white" title={`Level ${badgesInfo.player_level}`}>{badgesInfo.player_level}</span>
                            </div>
                        </div>
                    )}
                    <img
                        src={player.avatarfull}
                        alt={player.personaname}
                        className={`rounded-full shadow-md absolute inset-0 m-auto ${hasBadgeInfo ? 'w-[80px] h-[80px]' : 'w-24 h-24 border-4 border-gray-600'}`}
                    />
                </div>

                <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-3xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                        {player.personaname}
                        <span title={player.loccountrycode}>{getCountryFlagEmoji(player.loccountrycode)}</span>
                    </h2>
                    <div className="flex items-center justify-center sm:justify-start gap-4 mt-2">
                        <span className={`font-semibold ${status.color}`}>● ${status.text}</span>
                        <a href={player.profileurl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                            프로필 보기
                        </a>
                    </div>
                     {hasBadgeInfo && (
                        <div className="mt-2 text-sm text-gray-400" title={`총 경험치: ${badgesInfo.player_xp.toLocaleString()}`}>
                           XP: {badgesInfo.player_xp_needed_current_level.toLocaleString()} / {(badgesInfo.player_xp_needed_current_level + badgesInfo.player_xp_needed_to_level_up).toLocaleString()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};