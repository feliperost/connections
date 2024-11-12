"use client";

interface ResultsModalProps {
  closeResults: () => void;
}

const ResultsModal = ({ closeResults }: ResultsModalProps)  => {

    const handleClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // checks for outside click to close modal
        if (event.target === event.currentTarget) {
            closeResults();
        }
      };

  return (
    <div className="fade-in">
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={handleClickOutside}>
            <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full relative">
                
            <h2 className="text-2xl font-bold mb-4">Results</h2>
            <p className="mb-2">• Display the following info:</p>
            <p className="mb-2">Squares representing the tries the player made</p>
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
