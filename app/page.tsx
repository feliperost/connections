"use client"; 

import WordBox from "./components/WordBox";
import useLogic from "./components/useLogic";
import { useState } from "react";

export default function Home() {
  const { words } = useLogic()

  // global state of selected words
  const [selectedWords, setSelectedWords] = useState<{ word: string, group: string }[]>([]); 

  // function to add and remove word&group from an array when user clicks the word button
  const toggleWordSelection = (word: string, group: string, isSelected: boolean) => {
    if (isSelected) {
      // if button state is selected and the user clicks it, it means the user wants to remove the clicked word from the list. 
      setSelectedWords(prevWords => prevWords.filter(selectedWord => selectedWord.word !== word));
    } else {
      // if button state is not selected (which means the user now wants to select and add the word), adds the word to selected words list.
      setSelectedWords(prevWords => [...prevWords, { word, group }]);
    }
  };

  const handleSubmit = () => {
    console.log('selected words:', selectedWords);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="">
        Make groups of 4
      </div>

      <div>

        <ul className="grid grid-cols-4 gap-4">
          {words?.map((word, group) => (
            <li key={group}>
              <WordBox {...word} 
              toggleWordSelection={toggleWordSelection}
              />
              
            </li>
          ))}
        </ul>
      </div>

      <div className="">
        Mistakes remaining:
      </div>

      <button>Shuffle</button>
      <button>Deselect all</button>
      <button className="font-sans font-bold uppercase w-[150px] h-[80px] rounded-md border-solid border-2 p-2 text-center content-center bg-slate-400 hover:bg-slate-600 active:bg-slate-400" 
      onClick={handleSubmit}>Submit</button>

    </main>
  );
}