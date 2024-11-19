"use client";
import Image from "next/image";

interface HelpModalProps {
  closeHelp: () => void;
}

const HelpModal = ({ closeHelp }: HelpModalProps)  => {

    const handleClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // checks for outside click to close modal
        if (event.target === event.currentTarget) {
          closeHelp();
        }
      };

  return (
    <div className="fade-in">
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={handleClickOutside}>
            <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full relative">
            <h2 className="text-2xl font-bold mb-4">How to play</h2>
            <p className="mb-2">• Your challenge is to figure out the connecting theme between groups of words. Each group has 4 words and exactly one solution.</p>
            <p className="mb-2">• The game may trick you with words that seem to belong to multiple categories.</p>
            <p className="mb-2">• Click the words to select them, and click <b>Submit</b> to check if your guess is correct.</p>
            <p className="mb-2">• You can make 4 mistakes before the game is over.</p>
            <p className="mb-2">• For development purposes, the words and groups may be very easy to identify.</p>

            <button onClick={closeHelp} className="p-2 rounded absolute top-2 right-2">
                <Image src={"https://www.svgrepo.com/show/521564/close.svg"} width={20} height={20} alt="Close stats button"/>
            </button>
            </div>
        </div>
    </div>
    );
};

export default HelpModal;
