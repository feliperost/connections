"use client"; 
import { useState } from "react";

export type WordProps = { 
  word: string; 
  group: string;
  selectedWords: { word: string; group: string }[]; // global state
   // locked (static colored effect) state
  toggleWordSelection: (word: string, group: string, isSelected: boolean) => void; // function from parent
  isLocked?: boolean; // prop to handle locked words state
};

const WordBox = ({ word, group, selectedWords, toggleWordSelection, isLocked = false }: WordProps) => {

  // const to check if the word is selected
  const isSelected = selectedWords.some(selected => selected.word === word); 

  // for now the groups are hardcoded, later we will work on a logic to fix this
  const getColorByGroup = () => {
    switch (group) {
      case "countries":
        return "bg-purple-400/90"; 
      case "animals":
        return "bg-blue-200"; 
      case "fruits":
        return "bg-yellow-200"; 
      case "colors":
        return "bg-lime-500/60"; 
      default:
        return "bg-gray-400"; 
    }
  };

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
      className={`${isLocked ? getColorByGroup() : isSelected ? "bg-slate-400" : "bg-slate-100"} font-sans font-bold uppercase w-[150px] h-[80px] rounded-md border-solid border-2 p-2 text-center content-center`}
      id={group}
      onClick={handleClick}>
      {word}
    </button>
  );
};

export default WordBox;
