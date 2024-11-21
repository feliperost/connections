"use client";
import { X } from 'lucide-react';
import useLogic from "./useLogic";

interface ResultsModalProps {
  closeResults: () => void;
  guessedWords: { word: string; group: string }[][];
}

const ResultsModal = ({ closeResults, guessedWords }: ResultsModalProps)  => {

    const { puzzleData } = useLogic();

    const handleClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // checks for outside click to close modal
        if (event.target === event.currentTarget) {
            closeResults();
        }
      };

    const getColorByGroup = (group: string) => {
    switch (group) {
        case "1 countries":
        return "🟨"; 
        case "2 animals":
        return "🟩"; 
        case "3 fruits":
        return "🟦"; 
        case "4 colors":
        return "🟪"; 
        default:
        return "■"; 
        }
    };

    // function to copy results (game summary) to clipboard
    const shareResults = () => {
        const results = guessedWords.map((guess) => 
            // combines squares into a string
            guess.map((word) => getColorByGroup(word.group)).join("")) 
            // then adds a line break every guess (4 items)
            .join("\n");

        navigator.clipboard.writeText(`Connections Puzzle #${puzzleData.puzzleNumber}\n\n${results}`);

        const popup = document.getElementById("copied-results-popup");
        if (popup) {
            popup.classList.remove("hidden"); 
            setTimeout(() => {
                popup.classList.add("hidden"); 
            }, 2000);
        }
    };

  return (
    <div className="fade-in">
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={handleClickOutside}>
            <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full relative">
            
            <h2 className="text-2xl font-bold mb-4">Results</h2>
            <hr className="my-3 border-black rounded"></hr>

            <div className="flex justify-center space-x-8 my-3">
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

            <div id="copied-results-popup" className="hidden fixed top-1/3 bg-gray-800 text-white px-4 py-2 rounded shadow-lg fade-in-out">
            Copied results to clipboard!
            </div>   

            </div>

            <hr className="my-3 border-black rounded"></hr>
                
                {/* creating the squares representing the player's game summary */}
                <div id="game-summary" className="flex flex-col items-center">
                <p className="mb-2">Puzzle #{puzzleData.puzzleNumber} Summary</p>
                    {guessedWords.map((guess, index) => (
                        <div key={index} className="flex" id="results">
                        {guess.map((word) => (
                            <p key={word.word}>{getColorByGroup(word.group)}</p>
                        ))}
                        </div>
                    ))}
                </div>

            <div className="flex flex-col items-center">
                <button
                    className="mx-2 mt-8 transition ease-in-out font-sans font-semibold h-[50px] rounded-full border-solid border-[1px] border-black p-2 px-5 text-center content-center bg-none"
                    onClick={shareResults}>
                    Share your results
                </button>
            </div>

            <button onClick={closeResults} className="p-2 rounded absolute top-2 right-2">
                <X/>
            </button>

            </div>
        </div>
    </div>
    );
};

export default ResultsModal;
