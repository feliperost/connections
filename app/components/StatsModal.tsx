"use client";
import { X } from 'lucide-react';
import useLogic from "./useLogic";

interface StatsModalProps {
  closeStats: () => void;
  userStats: UserStats | null;
}

interface UserStats {
    userId: string;
    gamesCompleted: number;
    currentStreak: number;
    maxStreak: number;
    perfectPuzzles: number;
    mistakeHistogram: { [key: string]: number };
  }

const StatsModal = ({ closeStats, userStats }: StatsModalProps)  => {

    const { puzzleData } = useLogic();

    // calculating the user win percentage 
    // completed games with default value of 0
    const completedGames = userStats?.gamesCompleted ?? 0; 
    // + is used to convert the string to number
    const totalGames = +puzzleData.puzzleNumber; 
    // calculates win% and rounds it
    const winPercentage = Math.round((completedGames / totalGames) * 100);


    const handleClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // checks for outside click to close modal
        if (event.target === event.currentTarget) {
            closeStats();
        }
      };

  return (
    <div className="fade-in">
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={handleClickOutside}>
            <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full relative">
                
            <h2 className="text-2xl font-bold mb-4">Statistics</h2>
            <hr className="my-3 border-black rounded"></hr>

            <div className="flex justify-center space-x-8 my-3">
                <div className="text-center">
                    <div className="text-xl">{userStats?.gamesCompleted}</div>
                    <div className="text-xs">Completed</div>
                </div>
                
                <div className="text-center">
                    <div className="text-xl">{winPercentage}</div>
                    <div className="text-xs">Win %</div>
                </div>

                <div className="text-center">
                    <div className="text-xl">{userStats?.currentStreak}</div>
                    <div className="text-xs">Current streak</div>
                </div>

                <div className="text-center">
                    <div className="text-xl">{userStats?.maxStreak}</div>
                    <div className="text-xs">Max Streak</div>
                </div>
            </div>

            <hr className="my-3 border-black rounded"></hr>
        
            <div className="text-center">
                    <div className="text-xl">{userStats?.perfectPuzzles}</div>
                    <div className="text-xs">Perfect Puzzles</div>
                </div>

            <hr className="my-3 border-black rounded"></hr>

            <h2 className="mb-2 font-bold text-sm">MISTAKE DISTRIBUTION</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-5 text-left pr-2 font-bold">0</span>
                <div
                  className="bg-gray-500/70 h-2 px-1 flex justify-end items-center text-white font-bold"
                  style={{ width: `${(userStats?.mistakeHistogram[0] || 0) * 12}px`,
                  minWidth: '18px',
                  height: '20px' }}
                >
                  {userStats?.mistakeHistogram[0]}
                </div>
              </div>

              <div className="flex items-center">
                <span className="w-5 text-left pr-2 font-bold">1</span>
                <div
                  className="bg-gray-500/70 h-2 px-1 flex justify-end items-center text-white font-bold"
                  style={{ width: `${(userStats?.mistakeHistogram[1] || 0) * 12}px`,
                  minWidth: '18px',
                  height: '20px' }}
                >
                  {userStats?.mistakeHistogram[1]}
                </div>
              </div>

              <div className="flex items-center">
                <span className="w-5 text-left pr-2 font-bold">2</span>
                <div
                  className="bg-gray-500/70 h-2 px-1 flex justify-end items-center text-white font-bold"
                  style={{ width: `${(userStats?.mistakeHistogram[2] || 0) * 12}px`,
                  minWidth: '18px',
                  height: '20px' }}
                >
                  {userStats?.mistakeHistogram[2]}
                </div>
              </div>

              <div className="flex items-center">
                <span className="w-5 text-left pr-2 font-bold">3</span>
                <div
                  className="bg-gray-500/70 h-2 px-1 flex justify-end items-center text-white font-bold"
                  style={{ width: `${(userStats?.mistakeHistogram[3] || 0) * 12}px`,
                  minWidth: '18px',
                  height: '20px' }}
                >
                  {userStats?.mistakeHistogram[3]}
                </div>
              </div>

              <div className="flex items-center">
                <span className="w-5 text-left pr-2 font-bold">4</span>
                <div
                  className="bg-gray-500/70 h-2 px-1 flex justify-end items-center text-white font-bold"
                  style={{ width: `${(userStats?.mistakeHistogram[4] || 0) * 12}px`,
                  minWidth: '18px',
                  height: '20px' }}
                >
                  {userStats?.mistakeHistogram[4]}
                </div>
              </div>
            </div>
      
            <p className="mt-2 text-sm text-gray-600">The graph shows the number of puzzles you have solved with 0 to 4 mistakes.</p>
            
            <button onClick={closeStats} className="p-2 rounded absolute top-2 right-2">
                <X />
            </button>

            </div>
        </div>
    </div>
    );
};

export default StatsModal;