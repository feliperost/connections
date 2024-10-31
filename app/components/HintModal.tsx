"use client";

interface HintModalProps {
  closeHint: () => void;
}

const HintModal = ({ closeHint }: HintModalProps)  => {

    const handleClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // checks for outside click to close modal
        if (event.target === event.currentTarget) {
            closeHint();
        }
      };

  return (
    <div className="fade-in">
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={handleClickOutside}>
            <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full relative">
            <h2 className="text-2xl font-bold mb-4">Need a hint?</h2>
            <p className="mb-2">• Put here hints that reveal when user clicks them.</p>
            <p>Hint 1: <b>[blocked text]</b>. </p>
            <p>Hint 2: <b>[blocked text]</b>. </p>

            
            <p>When blocked text is clicked, it reveals a word/phrase to help the player.</p>

            <button onClick={closeHint} className="p-2 bg-red-500 hover:bg-red-400 text-white rounded absolute top-2 right-2">Close</button>
            </div>
        </div>
    </div>
    );
};

export default HintModal;
