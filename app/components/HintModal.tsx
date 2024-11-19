"use client";
import Image from "next/image";

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
            <p className="mb-2">• Click the button to reveal it.</p>

            <div className="flex mt-2">
                <p className="font-bold mr-2">Hint 1:</p>
                <input type="checkbox" id="checker1" className="checker"/>
                <label htmlFor="checker1" className="toggle">Reveal</label>
                <div className="spoiler">
                    <p className="hint">Text for hint 1.</p>
                </div>
            </div>

            <div className="flex mt-2">
                <p className="font-bold mr-2">Hint 2:</p>
                <input type="checkbox" id="checker2" className="checker"/>
                <label htmlFor="checker2" className="toggle">Reveal</label>
                <div className="spoiler">
                    <p className="hint">Text for hint 2.</p>
                </div>
            </div>

            <div className="flex mt-2">
                <p className="font-bold mr-2">Hint 3:</p>
                <input type="checkbox" id="checker3" className="checker"/>
                <label htmlFor="checker3" className="toggle">Reveal</label>
                <div className="spoiler">
                    <p className="hint">Text for hint 3.</p>
                </div>
            </div>

            <div className="flex mt-2">
                <p className="font-bold mr-2">Hint 4:</p>
                <input type="checkbox" id="checker4" className="checker"/>
                <label htmlFor="checker4" className="toggle">Reveal</label>
                <div className="spoiler">
                    <p className="hint">Text for hint 4.</p>
                </div>
            </div>
            
            <button onClick={closeHint} className="p-2 rounded absolute top-2 right-2">
                <Image src={"https://www.svgrepo.com/show/521564/close.svg"} width={20} height={20} alt="Close stats button"/>
            </button>
            </div>
        </div>
    </div>
    );
};

export default HintModal;
