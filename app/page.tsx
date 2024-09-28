"use client"; 
import WordBox from "./components/WordBox";
import useLogic from "./components/useLogic";
import { useState, useEffect } from "react";

export default function Home() {
  const { words } = useLogic();

  // state of selected words
  const [selectedWords, setSelectedWords] = useState<{ word: string; group: string }[]>([]);

  // state to hold the shuffled words
  const [shuffledWords, setShuffledWords] = useState<{ word: string; group: string }[]>([]);

  // state for locked words, pressing submit makes them static when all 4 are from the same group and display them at the top of grid
  const [lockedWords, setLockedWords] = useState<{ word: string; group: string }[][]>([]);

  // state to control number of tries and mistakes the user can make
  const [mistakesRemaining, setMistakesRemaining] = useState(4);

  // shuffle function using Fisher-Yates algorithm
  const shuffleArray = (array: { word: string; group: string }[]) => {
    const shuffled = [...array]; // clone the array to avoid modifying the original one
    for (let i = shuffled.length - 1; i > 0; i--) { // goes through the array backwards
      const j = Math.floor(Math.random() * (i + 1)); // gets a random index from 0 to i
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // swap elements around with random index
    }
    return shuffled;
  };

  // useEffect to shuffle words when the component mounts
  useEffect(() => {
    if (words && words.length > 0 && shuffledWords.length === 0) {
      setShuffledWords(shuffleArray(words)); // shuffles only if shuffledWords is empty
    }
  }, [words, shuffledWords.length]); // this ensures the shuffle happens when words are first loaded

  // function to shuffle words when the "Shuffle" button is clicked
  const handleShuffle = () => {
    setShuffledWords(shuffleArray(words)); 
  };

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
      
  // handle submit, first it checks for 4 selected words of the same group
  const handleSubmit = () => {
    if (selectedWords.length === 4) {
      const allSameGroup = selectedWords.every(word => word.group === selectedWords[0].group);
      
      // if all 4 selected words are from the same group, sends them to locked words and resets selected words \/
      if (allSameGroup) {
        setLockedWords(prevLocked => [...prevLocked, selectedWords]);
        setSelectedWords([]);
      } else {
        // if they aren't all from same group, decrease mistakes remaining by 1
        setMistakesRemaining(prev => prev - 1);
      }
    }
    console.log('selected words:', selectedWords);
  };

  // clears all selected words (resets the selectedWords array)
  const deselectAll = () => {
    setSelectedWords([]); 
  };

  // function to organize words to display them when the game is over
  // gets the array and sorts it alphabetically
  const organizeWordsByGroup = (words: { word: string; group: string }[]) => {
    return words.sort((a, b) => a.group.localeCompare(b.group));
  };

  // changes the color of words and groups 
  // for now the groups are hardcoded (countries animals etc), later we will try to work on a logic to fix this
  const getColorByGroup = (group: string) => {
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-15">
      <div className="mt-20">
        Make groups of 4
      </div>
  
      {/* initial check to see if the game can be played. if there are 0 mistakes remaining, GAME OVER case below. */}
      {mistakesRemaining > 0 ? (
        <>
          <div>
            {/* a version of the WordBox component that only shows locked words&groups, and displays the group above of row of locked words */}
            {lockedWords.map((groupWords, index) => (
              <div key={index} className={`p-2 ${getColorByGroup(groupWords[0].group)}`}>
                {/* renders group name here */}
                <div className="text-center font-bold uppercase mb-2">
                  {groupWords[0].group}
                </div>
                {/* renders the locked words */}
                <ul className="grid grid-cols-4 gap-4">
                  {groupWords.map((wordItem, index) => (
                    <li key={index}>
                      <WordBox 
                        word={wordItem.word} 
                        group={wordItem.group} 
                        isLocked={true} // mark as locked (used to style the button)
                        // we are not passing selectedWords and toggleWordSelection as they are optional, so locked words can't be selected and changed
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
  
          <div className="mt-8">
            {/* here it displays the remaining words, filtering first the locked ones above */}
            {/* flat() is used so we can iterate through the array */}
            <ul className="grid grid-cols-4 gap-4">
              {shuffledWords
                .filter(wordItem => !lockedWords.flat().some(lockedWord => lockedWord.word === wordItem.word))
                .map((wordItem, index) => (
                  <li key={index}>
                    <WordBox
                      word={wordItem.word}
                      group={wordItem.group}
                      selectedWords={selectedWords} // current state
                      toggleWordSelection={toggleWordSelection} // toggling function
                    />
                  </li>
                ))}
            </ul>
          </div>
  
          {/* display of mistakes, reaches game over if mistakesRemaining is 0. later we will style these properly */}
          <div className="mt-8">
            Mistakes remaining: {mistakesRemaining}
          </div>
  
          <div className="mt-5">
            <button
              className="font-sans font-bold uppercase w-[150px] h-[80px] rounded-md border-solid border-2 p-2 text-center content-center bg-slate-400 hover:bg-slate-600 active:bg-slate-400"
              onClick={handleShuffle}
              disabled={mistakesRemaining <= 0}>
              Shuffle
            </button>
  
            <button
              className="font-sans font-bold uppercase w-[150px] h-[80px] rounded-md border-solid border-2 p-2 text-center content-center bg-slate-400 hover:bg-slate-600 active:bg-slate-400"
              onClick={deselectAll}
              disabled={mistakesRemaining <= 0}>
              Deselect all
            </button>
  
            <button
              className="font-sans font-bold uppercase w-[150px] h-[80px] rounded-md border-solid border-2 p-2 text-center content-center bg-slate-400 hover:bg-slate-600 active:bg-slate-400"
              onClick={handleSubmit}
              disabled={mistakesRemaining <= 0}>
              Submit
            </button>
          </div>
        </>
      ) : (
        // GAME OVER: words are organized and displayed by group 
        <div className="">
          {/* organizing words by group */}
          {Object.entries(
            shuffledWords.reduce((acc, wordItem) => {
              if (!acc[wordItem.group]) acc[wordItem.group] = [];
              acc[wordItem.group].push(wordItem);
              return acc;
            }, {} as { [key: string]: { word: string; group: string }[] })
          ).map(([group, words], index) => (
            <div key={index} className={`p-2 ${getColorByGroup(group)}`}>
              {/* renders group name */}
              <div className="text-center font-bold uppercase mb-2">
                {group}
              </div>
              {/* renders the words in the group */}
              <ul className="grid grid-cols-4 gap-4">
                {words.map((wordItem, index) => (
                  <li key={index}>
                    <WordBox 
                      word={wordItem.word} 
                      group={wordItem.group} 
                      isLocked={true} // mark as locked (used to style the button)
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}



