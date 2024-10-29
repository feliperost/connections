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

  // wrong guess effect: gets the selected words, adds classes, and removes them after a delay
  const wrongGuessEffect = () => {
    
    const wordElements = document.querySelectorAll('.selected-word');

    // [&>*] is used to pass the bg color class only to the child of this element (the WordBox itself)
    wordElements.forEach((wordElement) => {
      wordElement.classList.add('pointer-events-none', 'shake', '[&>*]:bg-stone-400'); 
    });

    setTimeout(() => {
      wordElements.forEach((wordElement) => {
        wordElement.classList.remove('pointer-events-none', 'shake', '[&>*]:bg-stone-400');
      });
    }, 1200)
  };

  // function for the submit button. checks if the guess is correct/wrong, and applies according effects
  // first it checks for 4 selected words of the same group
  const handleSubmit = () => {
      // disable submit button immediately after clicking
      setIsSubmitDisabled(true);
  
      // selector to apply 'jump' effect on selected words
      const wordElements = document.querySelectorAll('.selected-word');
  
      // disable clicks on submitted selected words by adding 'pointer-events-none' class
      wordElements.forEach((wordElement) => {
        wordElement.classList.add('pointer-events-none'); 
      });
  
      // if your guess is all from the same group, it's added to this variable
      const allSameGroup = selectedWords.every(word => word.group === selectedWords[0].group);

      // checks if only 3 of the selected words are from the same group (one away... effect)
      const almostCorrect = selectedWords.filter(word => word.group === selectedWords[0].group).length === 3;
  
      // applies 'jump' effect one word at a time with a delay between them
      wordElements.forEach((wordElement, index) => {
        setTimeout(() => {
          wordElement.classList.add('jump');
          // removes 'jump' class after effect duration (400ms here)
          setTimeout(() => {
            wordElement.classList.remove('jump');
          }, 400);
        }, index * 80); // delay added to make the effect sequential
      });
  
      // reveal "One away..." popup if only 3 words match
      if (almostCorrect) {
        const popup = document.getElementById('one-away-popup');
        if (popup) {  // ensure popup exists
          popup.classList.remove('hidden'); // show popup
          setTimeout(() => {
            popup.classList.add('hidden'); // hide popup again
          }, 1500);
        }
      }
      
      // setTimeout is used here to let effects run before reacting accordingly to guess (correct/wrong)
      setTimeout(() => {
        if (allSameGroup) {
          setLockedWords(prevLocked => [...prevLocked, selectedWords]); // adds selected words to locked words
          setSelectedWords([]); // clears selected words
  
          // re-enables submit button after a delay
          setTimeout(() => {
            setIsSubmitDisabled(false);
          }, 1500);
  
        } else {
          // if the guess is wrong, removes 1 'life' and applies the shake effect...
          setMistakesRemaining(prev => prev - 1);
          wrongGuessEffect();
  
          // and re-enables submit button after a delay
          setTimeout(() => {
            setIsSubmitDisabled(false);
          }, 1500);
        }
      }, 800); // waits for all jump effects to finish before checking the guess
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

  // state that controls help modal visibility
  const [isHelpVisible, setIsHelpVisible] = useState(false); 

  const openHelp = () => {
    setIsHelpVisible(true);
  }

  const closeHelp = () => {
    setIsHelpVisible(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-15">

      <div className="flex flex-col items-center w-[624px] mt-20">
        <div>
          <p className="">This is a study project trying to recreate the NY Times game <a className="text-blue-600 font-semibold hover:underline hover:text-blue-400" href="https://www.nytimes.com/games/connections" target="_blank">Connections</a>.</p>
        </div>

        <p>The code for the project can be accessed <a className="text-blue-600 font-semibold hover:underline hover:text-blue-400" href="https://github.com/feliperost/connections" target="_blank">here</a>.</p>

        <div className="mt-5">Make groups of 4!</div>

        <div className="self-end relative mb-5">
          <button onClick={openHelp} className="absolute top-0 right-0 p-2 w-[40px] rounded-full bg-blue-500 text-white font-bold hover:bg-blue-400 transition">?</button>
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
                  
                  return (
                    <li key={index} className={`${isSelected ? 'selected-word' : ''}`}>
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
          <div className="flex items-center justify-center w-full my-4">
            <p>Mistakes remaining:</p>
            <span className="ml-2 text-5xl w-[105px] flex justify-start">
              {/* creates a array of 4 elements (our player tries) and assign and index to them, using "_" to ignore the first argument of the function as we will only use their index. later, it applies opacity 100 when mistakesRemaining is bigger than the index, and applies opacity 0 when mistakesRemaining is smaller than the index (meaning a mistake has been made)*/}
              {Array.from({ length: 4 }, (_, index) => (
                <span
                  key={index}
                  className={`transition-opacity duration-450 ${
                    index < mistakesRemaining ? 'opacity-100' : 'opacity-0'
                  }`}>•
                </span>
              ))}
            </span>
          </div>

          <div id="one-away-popup" className="hidden fixed top-1/3 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow-lg transition-opacity duration-450">
            One away...
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
                    {word.word}{index < words.length - 1 && ", "}
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


// analyse https://codepip.com/codections/ to try and replicate some things:
// 1. how classes are hidden.
// maybe study this: https://stackoverflow.com/questions/50649474/hiding-innerhtml-when-another-element-class-is-displaynone and https://www.quora.com/Is-it-possible-to-hide-certain-attributes-of-HTML-tags-in-the-production-so-that-user-do-not-know-their-values-when-they-see-the-source-code-of-the-webpage-in-Chrome-debugger 

// 2. how the wordboxes move into place after a correct guess.

// block flex grid table
// alter join limit select
// host port query scheme