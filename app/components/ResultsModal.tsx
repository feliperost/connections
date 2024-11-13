"use client";

interface ResultsModalProps {
  closeResults: () => void;
  guessedWords: { word: string; group: string }[][];
}

const ResultsModal = ({ closeResults, guessedWords }: ResultsModalProps)  => {

    const handleClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // checks for outside click to close modal
        if (event.target === event.currentTarget) {
            closeResults();
        }
      };
    const getColorByGroup = (group: string) => {
    switch (group) {
        case "countries":
        return "🟪"; 
        case "animals":
        return "🟦"; 
        case "fruits":
        return "🟨"; 
        case "colors":
        return "🟩"; 
        default:
        return "■"; 
        }
    };

  return (
    <div className="fade-in">
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={handleClickOutside}>
            <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full relative">
            
            <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">Results</h2>
                <p className="mb-2">Game summary</p>
                <div className="flex flex-col items-center">
                    {guessedWords.map((guess, index) => (
                        <div key={index} className="flex">
                        {guess.map((word) => (
                            <span key={word.word}>{getColorByGroup(word.group)}</span>
                        ))}
                        </div>
                    ))}
                </div>
            </div>
            <p className="mb-2">• Display the following info:</p>
            <p className="mb-2">• Plus games completed and</p>
            <p className="mb-2">• Win %</p>
            <p className="mb-2">• Current streak</p>
            <p className="mb-2">• Max streak</p>
            
            <button onClick={closeResults} className="p-2 bg-red-500 hover:bg-red-400 text-white rounded absolute top-2 right-2">Close</button>
            </div>
        </div>
    </div>
    );
};

export default ResultsModal;
