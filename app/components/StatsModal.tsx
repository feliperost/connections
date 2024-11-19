"use client";
import Image from "next/image";

interface StatsModalProps {
  closeStats: () => void;
}

const StatsModal = ({ closeStats }: StatsModalProps)  => {

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

            <p>Dummy data for now.</p>
            <div className="flex justify-center space-x-8 mt-4">
                <div className="text-center">
                    <div className="text-xl">15</div>
                    <div className="text-xs">Completed</div>
                </div>

                <div className="text-center">
                    <div className="text-xl">55</div>
                    <div className="text-xs">Win %</div>
                </div>

                <div className="text-center">
                    <div className="text-xl">0</div>
                    <div className="text-xs">Current streak</div>
                </div>

                <div className="text-center">
                    <div className="text-xl">2</div>
                    <div className="text-xs">Max Streak</div>
                </div>
            </div>
            <hr className="my-3 border-black rounded"></hr>
            <div className="text-center">
                    <div className="text-xl">0</div>
                    <div className="text-xs">Perfect Puzzles</div>
                </div>
            <hr className="my-3 border-black rounded"></hr>

            <p>Mistake Histogram: A graph showing the number of puzzles you have solved with 0 to 4 mistakes. Horizontal bars graph.</p>
            
            <button onClick={closeStats} className="p-2 rounded absolute top-2 right-2">
                <Image src={"https://www.svgrepo.com/show/521564/close.svg"} width={20} height={20} alt="Close stats button"/>
            </button>

            </div>
        </div>
    </div>
    );
};

export default StatsModal;
