import React, { useState, useMemo } from 'react';
import { IGame } from '../types';
import { GameCard } from './GameCard';
import { ShuffleIcon } from './Icons';

interface GameGridProps {
    games: IGame[];
    onGameSelect: (game: IGame) => void;
    onRecommendRequest: () => void;
}

type FilterType = 'all' | 'played' | 'unplayed';
type SortType = 'playtime_desc' | 'name_asc' | 'last_played_desc';

export const GameGrid: React.FC<GameGridProps> = ({ games, onGameSelect, onRecommendRequest }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [sort, setSort] = useState<SortType>('last_played_desc');

    const processedGames = useMemo(() => {
        let gamesToShow = [...games];

        // 1. Filter by play status
        if (filter === 'played') {
            gamesToShow = gamesToShow.filter(g => g.playtime_forever > 0);
        } else if (filter === 'unplayed') {
            gamesToShow = gamesToShow.filter(g => g.playtime_forever === 0);
        }

        // 2. Filter by search term
        if (searchTerm) {
            gamesToShow = gamesToShow.filter(game =>
                game.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 3. Sort
        gamesToShow.sort((a, b) => {
            if (sort === 'name_asc') {
                return a.name.localeCompare(b.name);
            }
            if (sort === 'last_played_desc') {
                return b.rtime_last_played - a.rtime_last_played;
            }
            // Default sort is playtime_desc
            return b.playtime_forever - a.playtime_forever;
        });

        return gamesToShow;
    }, [games, searchTerm, filter, sort]);

    const FilterButton: React.FC<{
        label: string;
        type: FilterType;
    }> = ({ label, type }) => (
        <button
            onClick={() => setFilter(type)}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                filter === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <h3 className="text-2xl font-bold text-white whitespace-nowrap">보유 게임 목록</h3>
                    <button
                        onClick={onRecommendRequest}
                        disabled={games.length === 0}
                        className="flex items-center gap-2 px-3 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors text-sm"
                        title="플레이할 게임을 랜덤으로 추천받습니다."
                    >
                        <ShuffleIcon className="h-5 w-5" />
                        랜덤 게임 추천
                    </button>
                </div>
                 <input
                    type="text"
                    placeholder="게임 이름으로 검색..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
                />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                 <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">필터:</span>
                    <FilterButton label="모든 게임" type="all" />
                    <FilterButton label="플레이한 게임" type="played" />
                    <FilterButton label="미플레이 게임" type="unplayed" />
                </div>
                 <div className="flex items-center gap-2">
                    <label htmlFor="sort-select" className="text-sm text-gray-400">정렬:</label>
                    <select
                        id="sort-select"
                        value={sort}
                        onChange={e => setSort(e.target.value as SortType)}
                        className="bg-gray-700 border border-gray-600 rounded-lg text-sm px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="last_played_desc">마지막 플레이 시간순</option>
                        <option value="playtime_desc">플레이 시간순</option>
                        <option value="name_asc">이름순 (A-Z)</option>
                    </select>
                </div>
            </div>

            {processedGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {processedGames.map(game => (
                        <GameCard key={game.appid} game={game} onSelect={() => onGameSelect(game)} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-400">
                    <p>{searchTerm ? `'${searchTerm}'에 해당하는 게임이 없습니다.` : filter !== 'all' ? '해당 필터에 맞는 게임이 없습니다.' : '게임 정보를 불러올 수 없습니다.'}</p>
                </div>
            )}
        </div>
    );
};