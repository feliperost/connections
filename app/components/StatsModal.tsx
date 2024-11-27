"use client";
import { useState, useEffect } from "react";
import { X } from 'lucide-react';

interface StatsModalProps {
  closeStats: () => void;
}

interface UserStats {
    userId: string;
    gamesCompleted: number;
    winPercentage: number;
    currentStreak: number;
    maxStreak: number;
    perfectPuzzles: number;
    mistakeHistogram: { [key: string]: number };
  }

const StatsModal = ({ closeStats }: StatsModalProps)  => {

    const [userStats, setUserStats] = useState<UserStats | null>(null);

    // fetching the user data
    useEffect(() => {
        const fetchStats = async () => {
          try {
            // getting the browser cookie
            const userId = document.cookie
              .split("; ")
              .find((row) => row.startsWith("userId="))
              ?.split("=")[1];
          
            const response = await fetch(`http://localhost:5000/stats/${userId}`, {
              credentials: "include", // includes cookies on request
            });
      
            if (response.ok) {
              const data: UserStats = await response.json();
              setUserStats(data);
            } else {
              const errorData = await response.json();
              console.error("Error fetching stats:", errorData);
            }
          } catch (error) {
            console.log("Error fetching stats:", error);
          }
        };
      
        fetchStats();
      }, []);

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
                    <div className="text-xl">{userStats?.winPercentage}</div>
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

            <p>{userStats?.perfectPuzzles}</p>
              
            <p>Mistake Histogram: A graph showing the number of puzzles you have solved with 0 to 4 mistakes. Horizontal bars graph.</p>
            
            <button onClick={closeStats} className="p-2 rounded absolute top-2 right-2">
                <X />
            </button>

            </div>
        </div>
    </div>
    );
};

export default StatsModal;
