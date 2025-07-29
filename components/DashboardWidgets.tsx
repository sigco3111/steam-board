import React from 'react';
import { IGame, IRecentlyPlayedGame } from '../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ClockIcon, GamepadIcon, StarIcon, TrophyIcon, BadgeIcon } from './Icons';


// --- Dashboard Stats Widget ---
interface DashboardStatsProps {
    totalPlaytime: number;
    gameCount: number;
    mostPlayedGame: IGame | null;
    badgeCount: number;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode; }> = ({ icon, label, value }) => (
    <div className="bg-gray-800/80 p-4 rounded-lg flex items-center h-full">
        <div className="p-3 bg-gray-700/50 rounded-full mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <div className="text-xl font-bold text-white">{value}</div>
        </div>
    </div>
);

export const DashboardStats: React.FC<DashboardStatsProps> = ({ totalPlaytime, gameCount, mostPlayedGame, badgeCount }) => {
    const totalHours = Math.round(totalPlaytime / 60).toLocaleString();
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
                icon={<ClockIcon className="h-6 w-6 text-cyan-400" />}
                label="총 플레이 시간"
                value={<>{totalHours} <span className="text-base font-normal">시간</span></>}
            />
            <StatCard 
                icon={<GamepadIcon className="h-6 w-6 text-green-400" />}
                label="보유 게임"
                value={<>{gameCount.toLocaleString()} <span className="text-base font-normal">개</span></>}
            />
             <StatCard 
                icon={<BadgeIcon className="h-6 w-6 text-purple-400" />}
                label="총 보유 배지"
                value={<>{badgeCount.toLocaleString()} <span className="text-base font-normal">개</span></>}
            />
            <StatCard 
                icon={<StarIcon className="h-6 w-6 text-yellow-400" />}
                label="최다 플레이"
                value={mostPlayedGame ? <span className="truncate block max-w-[150px]">{mostPlayedGame.name}</span> : 'N/A'}
            />
        </div>
    );
};


// --- Playtime Chart Widget ---
interface PlaytimeChartProps {
    data: { name: string; value: number }[];
}

const COLORS = ['#06B6D4', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#3B82F6', '#6366F1'];

export const PlaytimeChart: React.FC<PlaytimeChartProps> = ({ data }) => {
    if (data.length === 0) {
        return (
             <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6 h-full flex items-center justify-center">
                <p className="text-gray-400">플레이 데이터가 부족하여 차트를 표시할 수 없습니다.</p>
            </div>
        )
    }

    const renderManualLegend = () => (
        <div className="w-full">
            <ul className="flex flex-wrap justify-center list-none p-0">
                {data.map((entry, index) => (
                    <li key={`item-${index}`} className="flex items-center text-xs text-gray-300 mx-3 my-1">
                        <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span>{entry.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6 h-[400px] flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">플레이 시간 분포 (시간)</h3>
            <div className="flex-grow min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius="80%"
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                                borderColor: '#4B5563',
                                borderRadius: '0.5rem'
                            }}
                            labelStyle={{ color: '#D1D5DB' }}
                            itemStyle={{ fontWeight: 'bold', color: '#FFFFFF' }}
                            formatter={(value: number, name: string) => [`${value.toLocaleString()} 시간`, name]}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            {renderManualLegend()}
        </div>
    );
};

// --- Recently Played Widget ---
interface RecentlyPlayedProps {
    games: IRecentlyPlayedGame[];
}

export const RecentlyPlayedSection: React.FC<RecentlyPlayedProps> = ({ games }) => {
    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6 h-full">
            <h3 className="text-xl font-bold text-white mb-4">최근 플레이</h3>
            {games.length > 0 ? (
                <div className="space-y-4">
                    {games.slice(0, 7).map(game => (
                        <div key={game.appid} className="flex items-center">
                             <img 
                                src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                                alt={game.name}
                                className="w-8 h-8 rounded mr-3"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold truncate">{game.name}</p>
                                <p className="text-xs text-gray-400">
                                    최근 2주: {(game.playtime_2weeks / 60).toFixed(1)}시간
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-sm mt-4">최근 2주간 플레이 기록이 없습니다.</p>
            )}
        </div>
    )
}