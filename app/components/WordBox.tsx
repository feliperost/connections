"use client"; 

export type WordProps = { 
  word: string; 
  group: string;
  selectedWords?: { word: string; group: string }[]; // global state
   // locked (static colored effect) state
  toggleWordSelection?: (word: string, group: string, isSelected: boolean) => void; // function from parent
  // some of these are optional (?) because we may not use them on page.tsx
};

const WordBox = ({ word, group, selectedWords = [], toggleWordSelection }: WordProps) => {

  // variable to check if the word is selected
  const isSelected = selectedWords.some(selected => selected.word === word); 

  const handleClick = () => {
    // prevents selecting more than 4 words, returns nothing
    if (!isSelected && selectedWords.length >= 4) {
      return;
    }
    // toggles the word selection
    toggleWordSelection?.(word, group, isSelected);
  };

  return (
    <button
      className={`${isSelected ? "bg-stone-600 text-stone-50" : "bg-stone-200"} text-balance text-lg leading-tight text-center content-center font-sans font-bold uppercase w-[150px] h-[80px] rounded-md p-2 transition ease-in-out`}
      id={group}
      onClick={handleClick}>
      {word}
    </button>
  );
};

export default WordBox;
