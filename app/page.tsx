"use client"; 

import WordBox from "./components/WordBox";
import useLogic from "./components/useLogic";
import { useState } from "react";

export default function Home() {
  const { words } = useLogic()

  const [selectedWords, setSelectedWords] = useState([]);

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
              <WordBox {...word} />

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