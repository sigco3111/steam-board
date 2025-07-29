import React, { useMemo } from 'react';
import { IGame } from '../types';
import { ClockIcon, TrophyIcon, CalendarIcon } from './Icons';

interface GameCardProps {
    game: IGame;
    onSelect: (game: IGame) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onSelect }) => {
    const imageUrl = `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`;
    const hoursPlayed = (game.playtime_forever / 60).toFixed(1);
    const isPerfect = game.achievement_percent === 100;
    
    const lastPlayedDate = useMemo(() => {
        if (!game.rtime_last_played) return null;
        const date = new Date(game.rtime_last_played * 1000);
        return date.toLocaleDateString('ko-KR');
    }, [game.rtime_last_played]);

    return (
        <div 
            onClick={() => onSelect(game)}
            className="group bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:shadow-blue-500/30 hover:ring-2 hover:ring-blue-500 flex flex-col relative"
        >
            {isPerfect && (
                <div 
                    className="absolute top-2 right-2 z-10 p-1 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full shadow-lg"
                    title="모든 도전과제 달성!"
                >
                    <TrophyIcon className="h-5 w-5 text-white" />
                </div>
            )}
            <div className="relative">
                <img 
                    src={imageUrl} 
                    alt={game.name} 
                    className="w-full h-32 object-cover"
                    onError={(e) => { e.currentTarget.src = `https://dummyimage.com/460x215/2c2c2c/ffffff&text=${encodeURIComponent(game.name)}` }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300"></div>
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between">
                <h4 className="text-md font-semibold text-white truncate group-hover:text-blue-400 transition-colors">{game.name}</h4>
                <div className="mt-2 space-y-1 text-sm text-gray-400">
                    <div className="flex items-center">
                       <ClockIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
                       <span>{hoursPlayed} 시간</span>
                    </div>
                    {lastPlayedDate && (
                         <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
                            <span>{lastPlayedDate}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};