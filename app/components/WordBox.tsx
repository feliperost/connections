"use client"; 
import { useState } from "react";

export type WordProps = { 
  word: string; 
  group: string;
  toggleWordSelection: (word: string, group: string, isSelected: boolean) => void; 
  // toggle function coming through the parent /\
};

const WordBox = ({ word, group, toggleWordSelection }: WordProps) => {

  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    setSelected(!selected);

    // on click, adds or removes the word & group from the list of selected elements.
    toggleWordSelection(word, group, selected); 
    
  };

  return (
    <>
      <button
        className={selected 
          ? "font-sans font-bold uppercase w-[150px] h-[80px] rounded-md border-solid border-2 p-2 text-center content-center bg-slate-400 hover:bg-slate-600 active:bg-slate-400"
          : "font-sans font-bold uppercase w-[150px] h-[80px] rounded-md border-solid border-2 p-2 text-center content-center bg-slate-100 hover:bg-slate-200 active:bg-slate-400"}
        id={group}
        onClick={handleClick}
      >
        {word}
      </button>
    </>
  );
};

export default WordBox;
