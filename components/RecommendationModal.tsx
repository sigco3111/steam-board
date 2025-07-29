import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { IGame } from '../types';
import { ClockIcon } from './Icons';

interface RecommendationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onReroll: () => void;
    game: IGame | null;
}

export const RecommendationModal: React.FC<RecommendationModalProps> = ({ isOpen, onClose, onReroll, game }) => {
    
    const imageUrl = game ? `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg` : '';
    const hoursPlayed = game ? (game.playtime_forever / 60).toFixed(1) : '0';

    const backdropVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants: Variants = {
        hidden: { opacity: 0, scale: 0.9, y: 50 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
        exit: { opacity: 0, scale: 0.9, y: -50, transition: { duration: 0.2 } },
    };
    
    return (
        <AnimatePresence>
            {isOpen && game && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 backdrop-blur-sm p-4"
                    onClick={onClose}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={backdropVariants}
                >
                    <motion.div
                        className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden"
                        onClick={e => e.stopPropagation()}
                        variants={modalVariants}
                    >
                        {/* Image Section */}
                        <div className="md:w-1/2 relative h-64 md:h-auto">
                             <img
                                src={imageUrl}
                                alt={game.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.currentTarget.src = `https://dummyimage.com/460x215/2c2c2c/ffffff&text=${encodeURIComponent(game.name)}` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-gray-800/50 md:to-gray-800"></div>
                        </div>

                        {/* Content Section */}
                        <div className="md:w-1/2 flex flex-col">
                            <div className="p-6 md:p-8 flex-grow flex flex-col justify-center items-center md:items-start text-center md:text-left">
                                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mb-2">
                                    오늘의 추천 게임!
                                </h2>
                                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>{game.name}</h3>
                                
                                <div className="text-gray-300 mb-6 min-h-[40px] flex items-center text-lg">
                                    {game.playtime_forever > 0 ? (
                                        <div className="flex items-center">
                                           <ClockIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                                           <span>총 {hoursPlayed} 시간 플레이</span>
                                        </div>
                                    ) : (
                                        <p className="font-semibold text-green-400">새로운 모험을 시작해보세요! (미플레이)</p>
                                    )}
                                </div>
                            </div>
                            
                             <footer className="p-4 bg-gray-900/50 flex justify-end gap-3 mt-auto">
                                <button
                                    onClick={onReroll}
                                    className="px-5 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                                >
                                    다시 추천
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    닫기
                                </button>
                            </footer>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};