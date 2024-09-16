"use client"; 
import WordBox from "./components/WordBox";
import useLogic from "./components/useLogic";
import { useState, useEffect } from "react";

export default function Home() {
  const { words } = useLogic();

  // global state of selected words
  const [selectedWords, setSelectedWords] = useState<{ word: string; group: string }[]>([]);

  // state to hold the shuffled words
  const [shuffledWords, setShuffledWords] = useState<{ word: string; group: string }[]>([]);

  // shuffle function using Fisher-Yates algorithm
  const shuffleArray = (array: { word: string; group: string }[]) => {
    const shuffled = [...array]; // clone the array to avoid modifying the original one
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // swap elements
    }
    return shuffled;
  };

  // useEffect to shuffle words when the component mounts
  useEffect(() => {
    if (words && words.length > 0 && shuffledWords.length === 0) {
      setShuffledWords(shuffleArray(words)); // shuffle only if shuffledWords is empty
    }
  }, [words, shuffledWords.length]); // this ensures the shuffle happens when words are first loaded

  // function to shuffle words when the "Shuffle" button is clicked
  const handleShuffle = () => {
    setShuffledWords(shuffleArray(words)); 
    // reshuffles the words array when button is clicked
  };

  // state to track words that are locked (pressing submit makes them static when all 4 are from the same group)
  const [lockedWords, setLockedWords] = useState<{ word: string; group: string }[]>([]);

  // function to add or remove word&group from selected array when user clicks the word button
  const toggleWordSelection = (word: string, group: string, isSelected: boolean) => {
    if (isSelected) {
      // if button state is selected and the user clicks it, it means the user wants to remove the clicked word from the list.
      setSelectedWords(prevWords => prevWords.filter(w => w.word !== word));
    } else {
      // if button state is not selected (meaning the user now wants to select and add the word), adds the word to selected words list. to do it, there needs to be less than 4 words selected.
      if (selectedWords.length < 4) {
        setSelectedWords(prevWords => [...prevWords, { word, group }]);
      }
    }
  };

  // handle submit, checks for 4 selected words of the same group
  const handleSubmit = () => {
    if (selectedWords.length === 4) {
      // grabs the group of first selected word
      const group = selectedWords[0].group;

      // check if all selected words belong to the same group grabbed before
      const allSameGroup = selectedWords.every(word => word.group === group);

      if (allSameGroup) {
        // lock the words (make them static and change color to red)
        setLockedWords(prevLocked => [...prevLocked, ...selectedWords]);
        // clear the selected words after locking them
        deselectAll();
      }
    }
    console.log('selected words:', selectedWords);
  };

  // clears all selected words (resets the selectedWords array)
  const deselectAll = () => {
    setSelectedWords([]); 
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="">
        Make groups of 4
      </div>

      <div>
        <ul className="grid grid-cols-4 gap-4">
          {shuffledWords?.map((wordItem, index) => (
            <li key={index}>
              <WordBox 
                word={wordItem.word} 
                group={wordItem.group} 
                selectedWords={selectedWords} // current state
                lockedWords={lockedWords} // locked words state
                toggleWordSelection={toggleWordSelection} // toggling function
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="">
        Mistakes remaining:
      </div>

      <button className="font-sans font-bold uppercase w-[150px] h-[80px] rounded-md border-solid border-2 p-2 text-center content-center bg-slate-400 hover:bg-slate-600 active:bg-slate-400"
      onClick={handleShuffle}>Shuffle</button>

      <button 
      className="font-sans font-bold uppercase w-[150px] h-[80px] rounded-md border-solid border-2 p-2 text-center content-center bg-slate-400 hover:bg-slate-600 active:bg-slate-400"
      onClick={deselectAll}>Deselect all</button>

      <button 
      className="font-sans font-bold uppercase w-[150px] h-[80px] rounded-md border-solid border-2 p-2 text-center content-center bg-slate-400 hover:bg-slate-600 active:bg-slate-400" 
      onClick={handleSubmit}>Submit</button>
    </main>
  );
}
