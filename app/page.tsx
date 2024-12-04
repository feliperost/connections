"use client"; 
import WordBox from "./components/WordBox";
import HelpModal from "./components/HelpModal";
import HintModal from "./components/HintModal";
import StatsModal from "./components/StatsModal";
import ResultsModal from "./components/ResultsModal";
import useLogic from "./components/useLogic";
import { useState, useEffect } from "react";
import { Lightbulb, SquareChartGantt, CircleHelp } from 'lucide-react';

interface UserStats {
  userId: string;
  gamesCompleted: number;
  winPercentage: number;
  currentStreak: number;
  maxStreak: number;
  perfectPuzzles: number;
  mistakeHistogram: { [key: string]: number };
}

export default function Home() {
  const { puzzleData } = useLogic();

  // state of selected words
  const [selectedWords, setSelectedWords] = useState<{ word: string; group: string }[]>([]);

  // state of tries (showed in the results on game over)
  const [guessedWords, setGuessedWords] = useState<{ word: string; group: string }[][]>([]);

  // state to hold the shuffled words
  const [shuffledWords, setShuffledWords] = useState<{ word: string; group: string }[]>([]);

  // state for locked words, pressing submit makes them static when all 4 are from the same group and display them at the top of grid
  const [lockedWords, setLockedWords] = useState<{ word: string; group: string }[][]>([]);

  // state to control game lifes (number of tries and mistakes the user can make)
  const [mistakesRemaining, setMistakesRemaining] = useState(4);

  // used to control user stats (used in stats and results modals)
  const [userStats, setUserStats] = useState<UserStats | null>(null);

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
    if (puzzleData.words && puzzleData.words.length > 0 && shuffledWords.length === 0) {
      setShuffledWords(shuffleArray(puzzleData.words)); // shuffles only if shuffledWords is empty
    }
  }, [puzzleData.words, shuffledWords.length]); // this ensures the shuffle happens when words are first loaded

  // used to make a initial request to server, triggering the creation of a new user if it doesnt already exists... it 
  useEffect(() => {
    const userId = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userId="))
      ?.split("=")[1];
  
    if (!userId) {
      fetch("http://localhost:5000/initializeUser", {
        method: "POST",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("User initialized:", data);
        })
        .catch((error) => console.error("Error initializing user:", error));
    }
  }, []);

  // fetching the user data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // getting the browser cookie
        const userId = document.cookie
          .split("; ")
          .find((row) => row.startsWith("userId="))
          ?.split("=")[1];
      
        const response = await fetch(`http://localhost:5000/stats/${userId}`, {
          credentials: "include", // includes cookies on request
        });
  
        if (response.ok) {
          const data: UserStats = await response.json();
          setUserStats(data);
        } else {
          const errorData = await response.json();
          console.error("Error fetching stats:", errorData);
        }
      } catch (error) {
        console.log("Error fetching stats:", error);
      }
    };
  
    fetchStats();
  }, []);

  // game over stats to be sent to the backend, and used in user stats
  useEffect(() => {
    if (mistakesRemaining === 0) {
      const userId = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userId="))
        ?.split("=")[1];
  
      if (!userId) {
        console.error("User ID not found in cookies.");
        return;
      }
  
      console.log("User ID retrieved from cookies:", userId);
  
      const resetSreak = { currentStreak: 0 };
  
      fetch(`http://localhost:5000/stats/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetSreak),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update stats");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Stats successfully updated:", data);
        })
        .catch((error) => {
          console.error("Error updating stats:", error);
        });
    }
  }, [mistakesRemaining]);
  

  // function to shuffle words when the "Shuffle" button is clicked
  const handleShuffle = () => {
    setShuffledWords(shuffleArray(puzzleData.words)); 
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
    // checks if only 3 of the selected words are from the same group (one away... effect)
    const almostCorrect = selectedWords.filter(word => word.group === selectedWords[0].group).length === 3;

    // reveal "One away..." popup if only 3 words match
    if (almostCorrect) {
      const popup = document.getElementById('one-away-popup');
      if (popup) {  // ensure popup exists
        popup.classList.remove('hidden'); // show popup
        setTimeout(() => {
          popup.classList.add('hidden'); // hide popup again
        }, 2000);
      }
    }

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
      // disables submit button immediately after clicking
      setIsSubmitDisabled(true);
  
      // selector to apply 'jump' effect on selected words
      const wordElements = document.querySelectorAll('.selected-word');
  
      // disable clicks on submitted selected words by adding 'pointer-events-none' class
      wordElements.forEach((wordElement) => {
        wordElement.classList.add('pointer-events-none'); 
      });
  
      // if your guess is all from the same group, it's added to this variable
      const allSameGroup = selectedWords.every(word => word.group === selectedWords[0].group);
  
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
      
      // setTimeout is used here to let effects run before reacting accordingly to guess (correct/wrong)
      setTimeout(() => {
        if (allSameGroup) {
          setLockedWords(prevLocked => [...prevLocked, selectedWords]); // adds selected words to locked words
          setSelectedWords([]); // clears selected words

          // adds selected words to guessedWords
          setGuessedWords(prevGuessedWords => [...prevGuessedWords, selectedWords]);

          // re-enables submit button after a delay
          setTimeout(() => {
            setIsSubmitDisabled(false);    
          }, 1500);
  
        } else {
          // if the guess is wrong, removes 1 'life' and applies the shake effect...
          setMistakesRemaining(prev => prev - 1);
          wrongGuessEffect();

          // adds selected words to guessedWords even if the guess is wrong
          setGuessedWords(prevGuessedWords => [...prevGuessedWords, selectedWords]);

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
      case "4 colors":
        return "bg-purple-400/90"; 
      case "3 fruits":
        return "bg-blue-200"; 
      case "1 countries":
        return "bg-yellow-200"; 
      case "2 animals":
        return "bg-lime-500/60"; 
      default:
        return "bg-gray-400"; 
    }
  };

  // states that controls help and hint modals visibility
  const [isHelpVisible, setIsHelpVisible] = useState(false); 
  const [isHintVisible, setIsHintVisible] = useState(false); 
  const [isStatsVisible, setIsStatsVisible] = useState(false); 
  const [isResultsVisible, setIsResultsVisible] = useState(false); 

  const openHelp = () => {
    setIsHelpVisible(true);
  }
  const openHint = () => {
    setIsHintVisible(true);
  }
  const openStats = () => {
    setIsStatsVisible(true);
  }
  const openResults = () => {
    setIsResultsVisible(true);
  }

  const closeHelp = () => {
    setIsHelpVisible(false);
  };
  const closeHint = () => {
    setIsHintVisible(false);
  };
  const closeStats = () => {
    setIsStatsVisible(false);
  };
  const closeResults = () => {
    setIsResultsVisible(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center">

      <div className="flex flex-col items-center w-[624px] mt-12">
        <div>
          <p className="">This is a study project trying to recreate the NY Times game <a className="text-blue-600 font-semibold hover:underline hover:text-blue-400" href="https://www.nytimes.com/games/connections" target="_blank">Connections</a>.</p>
        </div>

        <p>The code for the project can be accessed <a className="text-blue-600 font-semibold hover:underline hover:text-blue-400" href="https://github.com/feliperost/connections" target="_blank">here</a>.</p>

        <div className="flex flex-col items-center w-[624px] mt-5">
          <div className="flex self-end relative place-content-end">
            <button onClick={openHelp} className="top-0 right-0 p-2 ml-2 w-[40px] rounded-full bg-blue-500 text-white font-bold hover:bg-blue-400 transition">
              <CircleHelp />
            </button>
            {isHelpVisible && <HelpModal closeHelp={closeHelp} />}

            <button onClick={openStats} className="top-0 right-0 p-2 ml-2 w-[40px] rounded-full bg-blue-500 text-white font-bold hover:bg-blue-400 transition">
              <SquareChartGantt />
            </button>
            {isStatsVisible && <StatsModal closeStats={closeStats} userStats={userStats}/>}

            <button onClick={openHint} className="top-0 right-0 p-2 ml-2 w-[40px] rounded-full bg-blue-500 text-white font-bold hover:bg-blue-400 transition">
            <Lightbulb />
            </button>
            {isHintVisible && <HintModal closeHint={closeHint} />}
          </div>
          
        <hr className="my-3 border-black rounded w-[100%]"></hr>

        </div>
          <p>Make groups of 4!</p>  
      </div>
  
      {/* initial check to see if the game can be played. if there are 0 mistakes remaining, GAME OVER case down below. */}
      {mistakesRemaining > 0 ? (
        <>
          <div className="mt-8">
            {/* render of correct guesses */}
            {lockedWords.map((groupWords, index) => (
              <div key={index} className={`rounded-md text-center mt-2 h-[80px] w-[624px] text-lg transition p-2 ${getColorByGroup(groupWords[0].group)}`}>
                <div className=" font-bold uppercase mt-1">
                  {groupWords[0].group.slice(2)}
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

          <div id="one-away-popup" className="hidden fixed top-1/3 bg-gray-800 text-white px-4 py-2 rounded shadow-lg fade-in-out">
            One away...
          </div>          
  
          <div className="">
            <button
              className="mx-2 transition ease-in-out font-sans font-semibold h-[50px] rounded-full border-solid border-[1px] border-black p-2 px-5 text-center content-center bg-none disabled:opacity-30"
              onClick={handleShuffle}
              disabled={mistakesRemaining <= 0 || isSubmitDisabled}>
              Shuffle
            </button>
  
            <button
              className="mx-2 transition ease-in-out font-sans font-semibold h-[50px] rounded-full border-solid border-[1px] border-black p-2 px-5 text-center content-center bg-none disabled:opacity-30"
              onClick={deselectAll}
              disabled={selectedWords.length < 1 || mistakesRemaining <= 0 || isSubmitDisabled}>
              Deselect all
            </button>
  
            <button
              className="mx-2 transition ease-in-out font-sans font-semibold w-[120px] h-[50px] rounded-full border-solid border-[1px] border-black p-2 px-5 text-center text-white content-center bg-black disabled:bg-transparent disabled:opacity-30 disabled:border-black disabled:cursor-auto disabled:text-black"
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
            {organizeWordsByGroup(shuffledWords)
              // sort groups by the complexity number (first character of group string)
              .sort(([groupA], [groupB]) => parseInt(groupA[0]) - parseInt(groupB[0]))
              .map(([group, words], index) => (
                <div
                  key={index}
                  className={`rounded-md text-center mt-2 h-[80px] w-[624px] text-lg transition p-2 ${getColorByGroup(group)}`}
                >
                  {/* renders group name without the complexity number */}
                  <div className="font-bold uppercase mt-1">
                    {group.slice(2)} {/* removes the first two characters (e.g., "1 ") */}
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
            <div className="flex flex-col items-center">
              <button
                className="mt-5 mx-2 transition ease-in-out font-sans font-semibold h-[50px] rounded-full border-solid border-[1px] border-black p-2 px-5 text-center content-center bg-none disabled:opacity-30"
                onClick={openResults}
              >
                View Results
              </button>
            </div>
            {isResultsVisible && <ResultsModal guessedWords={guessedWords} closeResults={closeResults} userStats={userStats}/>}
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