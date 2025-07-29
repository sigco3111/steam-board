import React, { useState } from 'react';

interface ApiKeyInputProps {
    onSave: (steamKey: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSave }) => {
    const [steamKey, setSteamKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (steamKey.trim()) {
            onSave(steamKey.trim());
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">API 키 설정</h2>
            <p className="text-gray-400 mb-6 text-center text-sm">
                스팀 대시보드를 사용하려면 Steam Web API 키가 필요합니다. 입력된 키는 브라우저에만 저장됩니다.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="steam-key" className="block text-sm font-medium text-gray-300 mb-2">
                        Steam Web API Key
                    </label>
                    <input
                        id="steam-key"
                        type="password"
                        value={steamKey}
                        onChange={(e) => setSteamKey(e.target.value)}
                        placeholder="Steam API 키를 입력하세요"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                     <a href="https://steamcommunity.com/dev/apikey" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline mt-1 block">
                        Steam 키 발급받기
                    </a>
                </div>
                <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-600 transition-colors"
                    disabled={!steamKey.trim()}
                >
                    키 저장 및 시작하기
                </button>
            </form>
        </div>
    );
};

// Add a simple fade-in animation for better UX
const style = document.createElement('style');
style.textContent = `
    @keyframes fade-in {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
        animation: fade-in 0.5s ease-out forwards;
    }
`;
document.head.append(style);