"use client";
import { X } from 'lucide-react';
import useLogic from "./useLogic";


interface HintModalProps {
  closeHint: () => void;
}

const HintModal = ({ closeHint }: HintModalProps)  => {

    const { puzzleData } = useLogic();

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
            <p className="mb-2">Each category has a different difficulty level. Yellow is the simplest, and purple is the most difficult. Click or tap each button to reveal one of the words in that category.</p>

            <div className="flex flex-col mt-2">
                <p className="font-semibold mr-2">🟨 Straightforward</p>
                <input type="checkbox" id="checker1" className="checker"/>
                <label htmlFor="checker1" className="toggle">Reveal</label>
                <div className="spoiler">
                    <p className="hint">{puzzleData.words.find(word => word.group.startsWith('1'))?.word.toUpperCase()}</p>
                </div>
            </div>

            <div className="flex flex-col mt-2">
                <p className="font-semibold mr-2">🟩 ⬇️</p>
                <input type="checkbox" id="checker2" className="checker"/>
                <label htmlFor="checker2" className="toggle">Reveal</label>
                <div className="spoiler">
                    <p className="hint">{puzzleData.words.find(word => word.group.startsWith('2'))?.word.toUpperCase()}</p>
                </div>
            </div>

            <div className="flex flex-col mt-2">
                <p className="font-semibold mr-2">🟦 ⬇️</p>
                <input type="checkbox" id="checker3" className="checker"/>
                <label htmlFor="checker3" className="toggle">Reveal</label>
                <div className="spoiler">
                    <p className="hint">{puzzleData.words.find(word => word.group.startsWith('3'))?.word.toUpperCase()}</p>
                </div>
            </div>

            <div className="flex flex-col mt-2">
                <p className="font-semibold mr-2">🟪 Tricky</p>
                <input type="checkbox" id="checker4" className="checker"/>
                <label htmlFor="checker4" className="toggle">Reveal</label>
                <div className="spoiler">
                    <p className="hint">{puzzleData.words.find(word => word.group.startsWith('4'))?.word.toUpperCase()}</p>
                </div>
            </div>
            
            <button onClick={closeHint} className="p-2 rounded absolute top-2 right-2">
                <X/>
            </button>
            </div>
        </div>
    </div>
    );
};

export default HintModal;
