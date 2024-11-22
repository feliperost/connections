"use client";
import { useState } from "react";
import { X } from 'lucide-react';
import useLogic from "./useLogic";


interface HintModalProps {
  closeHint: () => void;
}

const HintModal = ({ closeHint }: HintModalProps)  => {

    const { puzzleData } = useLogic();

    // controls hint visibility based on the group prefix (1,2,3,4)
    const [revealedHints, setRevealedHints] = useState<string[]>([]);

    const handleHintClick = (group: string) => {
    // verifies if clicked hint group is already in the array above. if not, adds it to the array.
      if (!revealedHints.includes(group)) {
        setRevealedHints([...revealedHints, group]);
      }
    };

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
            <p className="mb-2">Each category has a different difficulty level. Yellow is the simplest, and purple is the most difficult. Click or tap each level to reveal one of the words in that category.</p>

        <div>
            {/* we use an array with the group prefixes to iterate through */}
            {['1', '2', '3', '4'].map((groupPrefix) => (
            <div key={groupPrefix} className="flex flex-col mt-2">
                <p className="font-semibold mr-2 cursor-pointer hover:underline" onClick={() => handleHintClick(groupPrefix)}>
                    {groupPrefix === '1'
                    ? '🟨 Straightforward'
                    : groupPrefix === '2'
                    ? '🟩 ⬇️'
                    : groupPrefix === '3'
                    ? '🟦 ⬇️'
                    : groupPrefix === '4'
                    ? '🟪 Tricky'
                    : ''
                    }
                </p>
                {/* below, it checks if the group prefix is ​​in revealedHints. if it is, applies opacity-100 to make the hint visible. */}
                <div className={`opacity-0 transition-opacity duration-500 ${revealedHints.includes(groupPrefix) ? 'opacity-100' : ''}`}>
                    {puzzleData.words
                    .find((word) => word.group.startsWith(groupPrefix))
                    ?.word.toUpperCase()}
                </div>
            </div>
            ))}
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
