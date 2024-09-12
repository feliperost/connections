"use client"; 
import { useState } from "react";

export type WordProps = { 
  word: string; 
  group: string;
  // global state coming through parent \/
  selectedWords: { word: string; group: string }[]; 
  // toggle function coming through the parent \/
  toggleWordSelection: (word: string, group: string, isSelected: boolean) => void; 
};

const WordBox = ({ word, group, selectedWords, toggleWordSelection }: WordProps) => {

  // const to check if the word is selected
  const isSelected = selectedWords.some(selected => selected.word === word); 

  const handleClick = () => {
    // this checks if the word the user wants to click is already selected, and checks if there are less than 4 words selected
    if (!isSelected && selectedWords.length >= 4) {
      return; 
      // if there are already 4 words selected, does nothing (blocking selecting more than 4 words)
    }

    // on click, adds or removes the word & group from the list of selected elements.
    toggleWordSelection(word, group, isSelected);
  };

  return (
    <button
      className={isSelected 
        ? "font-sans font-bold uppercase w-[150px] h-[80px] rounded-md border-solid border-2 p-2 text-center content-center bg-slate-400 hover:bg-slate-600 active:bg-slate-400"
        : "font-sans font-bold uppercase w-[150px] h-[80px] rounded-md border-solid border-2 p-2 text-center content-center bg-slate-100 hover:bg-slate-200 active:bg-slate-400"}
      id={group}
      onClick={handleClick}
    >
      {word}
    </button>
  );
};

export default WordBox;
