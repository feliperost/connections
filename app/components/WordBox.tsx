"use client"; 
import { useState } from "react";

export type WordProps = { 
  word: string; 
  group: string;
  selectedWords: { word: string; group: string }[]; // global state
  lockedWords: { word: string; group: string }[]; // locked (static colored effect) state
  toggleWordSelection: (word: string, group: string, isSelected: boolean) => void; // function from parent
};

const WordBox = ({ word, group, selectedWords, lockedWords, toggleWordSelection }: WordProps) => {

  // const to check if the word is selected
  const isSelected = selectedWords.some(selected => selected.word === word); 

  // const to check if the word is locked (part of the words locked after submit)
  const isLocked = lockedWords.some(locked => locked.word === word); 

  const handleClick = () => {
    // prevents interaction with locked words
    if (isLocked) {
      return;
    }

    // prevents selecting more than 4 words
    if (!isSelected && selectedWords.length >= 4) {
      return;
    }

    // toggles the word selection
    toggleWordSelection(word, group, isSelected);
  };

  return (
    <button
      className={isLocked 
        ? "font-sans font-bold uppercase w-[150px] h-[80px] rounded-md border-solid border-2 p-2 text-center content-center bg-red-500"
        : isSelected 
        ? "font-sans font-bold uppercase w-[150px] h-[80px] rounded-md border-solid border-2 p-2 text-center content-center bg-slate-400 hover:bg-slate-600 active:bg-slate-400"
        : "font-sans font-bold uppercase w-[150px] h-[80px] rounded-md border-solid border-2 p-2 text-center content-center bg-slate-100 hover:bg-slate-200 active:bg-slate-400"}
      id={group}
      onClick={handleClick}>
      {word}
    </button>
  );
};

export default WordBox;
