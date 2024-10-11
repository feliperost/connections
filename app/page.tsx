"use client"; 
import WordBox from "./components/WordBox";
import HelpModal from "./components/HelpModal";
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
      
  // state to control the submit button
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  // function for the submit button
  // first it checks for 4 selected words of the same group
  const handleSubmit = () => {
    if (selectedWords.length === 4) {
      // disable submit button immediately after clicking
      setIsSubmitDisabled(true);
  
      // selector to apply 'jump' effect on selected words
      const wordElements = document.querySelectorAll('.selected-word');
      wordElements.forEach((wordElement) => {
        wordElement.classList.add('jump');
      });

      // if you guess is all from the same group, its added to this variable
      const allSameGroup = selectedWords.every(word => word.group === selectedWords[0].group);
  
      // applies and removes 'jump' class after effect is done
      setTimeout(() => {
        wordElements.forEach((wordElement) => {
          wordElement.classList.remove('jump');
        });
  
        // here it checks for a correct or wrong guess based on the variable created above
        if (allSameGroup) {
          setLockedWords(prevLocked => [...prevLocked, selectedWords]);
          setSelectedWords([]); // clear selected words
  
          // re-enables submit button
          setIsSubmitDisabled(false);
  
        } else {
          // if the guess is wrong, removes 1 'life' and applies the shake effect
          setMistakesRemaining(prev => prev - 1);
          wrongGuessEffect();
  
          // re-enables submit button
          setIsSubmitDisabled(false);
        }
      }, 500); // jump effect time in ms
    }
    console.log('selected words:', selectedWords);
  };
  
  

  // clears all selected words (resets the selectedWords array)
  const deselectAll = () => {
    setSelectedWords([]); 
  };

  // function to organize words by their group to display them when the game is over
  // it reduces the array into an object of grouped words
  const organizeWordsByGroup = (words: { word: string; group: string }[]) => {
    return Object.entries(
      words.reduce((groupedWords, wordItem) => {
        // reduce is a method that iterates through the words array. groupedWords (an "accumulator") is an object that will collect the words by their groups.
        if (!groupedWords[wordItem.group]) groupedWords[wordItem.group] = [];
        groupedWords[wordItem.group].push(wordItem);
        return groupedWords;
      }, {} as { [key: string]: { word: string; group: string }[] })
      // /\ this is the initial value for the accumulator groupedWords ({}). its an object with string keys (the group names) and arrays of word objects as values
    );
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

  const [isHelpVisible, setIsHelpVisible] = useState(false); // state that controls help modal visibility

  const openHelp = () => {
    setIsHelpVisible(true);
  }

  const closeHelp = () => {
    setIsHelpVisible(false);
  };

  const [isShaking, setIsShaking] = useState(false);

  const wrongGuessEffect = () => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 1000);
  };


  return (
    <main className="flex min-h-screen flex-col items-center p-15">

      <div className="w-[624px] mt-20">
        <div className="text-center">Make groups of 4</div>
        <div className="relative mb-5">
          <button onClick={openHelp} className="absolute top-0 right-0 bg-blue-500 text-white p-2 rounded-lg">?</button>
          {isHelpVisible && <HelpModal closeHelp={closeHelp} />}
        </div>
      </div>
  
      {/* initial check to see if the game can be played. if there are 0 mistakes remaining, GAME OVER case down below. */}
      {mistakesRemaining > 0 ? (
        <>
          <div className="mt-8">
            {/* render of correct guesses */}
            {lockedWords.map((groupWords, index) => (
              <div key={index} className={`rounded-md text-center mt-2 h-[80px] w-[624px] text-lg transition p-2 ${getColorByGroup(groupWords[0].group)}`}>
                <div className=" font-bold uppercase mt-1">
                  {groupWords[0].group}
                </div>
                <div className="flex justify-center font-sans uppercase">
                  <p>{groupWords[0].word + ', '}</p>
                  <p>{groupWords[1].word + ', '}</p>
                  <p>{groupWords[2].word + ', '}</p>
                  <p>{groupWords[3].word}</p>
                </div>
              </div>
            ))}
          </div>
  
          <div className="mt-2">
            {/* here it displays the remaining words, filtering first the locked ones from correct guesses above */}
            {/* flat() is used so we can iterate through the array */}
            <ul className="grid grid-cols-4 gap-2">
              {shuffledWords
                .filter(wordItem => !lockedWords.flat().some(lockedWord => lockedWord.word === wordItem.word))
                .map((wordItem, index) => {
                  const isSelected = selectedWords.some(selectedWord => selectedWord.word === wordItem.word); // used to check for selected words
                  const shouldShake = isShaking && isSelected; // used to check and apply shake effect only if word is selected and isShaking is true
                  
                  return (
                    <li key={index} className={`${isSelected ? 'selected-word' : ''} ${shouldShake ? 'shake' : ''}`}>
                      <WordBox
                        word={wordItem.word}
                        group={wordItem.group}
                        selectedWords={selectedWords} // current state
                        toggleWordSelection={toggleWordSelection} // toggling function
                      />
                    </li>
                  );
                })}
            </ul>

          </div>
  
          {/* display of mistakes, reaches game over if mistakesRemaining is 0. 
          .repeat repeats "•" according to number of mistakes remaining. */}
          <div className="flex items-center justify-start w-100 my-4">
            <p>Mistakes remaining:</p>
            <span className="ml-2 text-5xl">
              {"• ".repeat(mistakesRemaining)}
            </span>
          </div>
  
          <div className="">
            <button
              className="mx-2 transition ease-in-out font-sans font-semibold w-[120px] h-[50px] rounded-full border-solid border-[1px] border-black p-2 text-center content-center bg-none disabled:opacity-30"
              onClick={handleShuffle}
              disabled={mistakesRemaining <= 0}>
              Shuffle
            </button>
  
            <button
              className="mx-2 transition ease-in-out font-sans font-semibold w-[120px] h-[50px] rounded-full border-solid border-[1px] border-black p-2 text-center content-center bg-none disabled:opacity-30"
              onClick={deselectAll}
              disabled={selectedWords.length < 1 || mistakesRemaining <= 0}>
              Deselect all
            </button>
  
            <button
              className="mx-2 transition ease-in-out font-sans font-semibold w-[120px] h-[50px] rounded-full border-solid border-[1px] border-black p-2 text-center text-white content-center bg-black disabled:bg-zinc-50 disabled:opacity-30 disabled:border-black disabled:cursor-auto disabled:text-black"
              onClick={handleSubmit}
              disabled={selectedWords.length !== 4 || mistakesRemaining <= 0 || isSubmitDisabled}> 
              Submit
            </button>
          </div>
        </>
      ) : (
        // GAME OVER: words are organized and displayed by group 
        <div>
          <div className="fade-in mt-8">
            {/* organizing words by group */}
            {organizeWordsByGroup(shuffledWords).map(([group, words], index) => (
              <div key={index} className={`rounded-md text-center mt-2 h-[80px] w-[624px] text-lg transition p-2 ${getColorByGroup(group)}`}>
                {/* renders group name */}
                <div className="font-bold uppercase mt-1">
                  {group}
                </div>
                {/* renders the words in the group */}
                <ul className="flex justify-center font-sans uppercase">
                  {words.map((word, index) => (
                    <li key={index}>
                    {word.word}
                    {index < words.length - 1 && ", "}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </main> 
  );
}