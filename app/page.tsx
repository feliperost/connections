"use client"; 
import WordBox from "./components/WordBox";
import useLogic from "./components/useLogic";
import { useState } from "react";

export default function Home() {
  const { words } = useLogic();

  // global state of selected words
  const [selectedWords, setSelectedWords] = useState<{ word: string; group: string }[]>([]);

  // function to add or remove word&group from an array when user clicks the word button
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

  // for now, it only logs the selected words. later we will work on other functionalities
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
          {words?.map((wordItem, index) => (
            <li key={index}>
              <WordBox 
                word={wordItem.word} 
                group={wordItem.group} 
                selectedWords={selectedWords} // Passa o estado atual
                toggleWordSelection={toggleWordSelection} // Função de alternância
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
      <button onClick={handleSubmit}>Submit</button>
    </main>
  );
}
