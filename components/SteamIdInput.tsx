import React, { useState } from 'react';
import { LoadingSpinner, SearchIcon } from './Icons';

interface SteamIdInputProps {
    onSearch: (steamId: string) => void;
    isLoading: boolean;
}

export const SteamIdInput: React.FC<SteamIdInputProps> = ({ onSearch, isLoading }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(inputValue.trim());
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Steam ID64를 입력하세요 (예: 7656...)"
                    className="w-full pl-4 pr-28 py-3 bg-gray-800 border-2 border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="absolute inset-y-0 right-0 flex items-center justify-center px-6 m-1 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    disabled={isLoading}
                >
                    {isLoading ? <LoadingSpinner /> : <SearchIcon />}
                    <span className="ml-2">검색</span>
                </button>
            </div>
        </form>
    );
};
