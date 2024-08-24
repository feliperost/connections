"use client"; 

import WordBox from "./components/WordBox";
import useLogic from "./components/useLogic";
import { useState } from "react";

export default function Home() {
  const { words } = useLogic()

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
              {/* colocar onClick para togglear o selected e active => entre selected e !selected/\ */}
            </li>
          ))}
        </ul>
      </div>

      <div className="">
        Mistakes remaining:
      </div>

      <button>Shuffle</button>
      <button>Deselect all</button>
      <button>Submit</button>

    </main>
  );
}


// <ul className='@apply list-none w-full p-0'>
// {words.map((item, index)=>(
//     <li className='@apply mx-0 my-2.5' key={index}>
//         <div className="w-[150px] h-[80px] rounded-md border-solid border-2 p-2 text-center content-center bg-slate-100">
//         {item.word}
//         </div>
//     </li>
// ))}
// </ul>