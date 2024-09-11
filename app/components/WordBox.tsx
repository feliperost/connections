"use client"; 
import { useState } from "react";

export type WordProps = { 
  word: string; 
  group: string;
};

const WordBox = ({ word, group }: WordProps) => {

  const [selected, setSelected] = useState(false)

  return (
    <>
      <button className={selected 
      ? "font-sans font-bold uppercase w-[150px] h-[80px] rounded-md border-solid border-2 p-2 text-center content-center bg-slate-400 hover:bg-slate-600 active:bg-slate-400"
      : "font-sans font-bold uppercase w-[150px] h-[80px] rounded-md border-solid border-2 p-2 text-center content-center bg-slate-100 hover:bg-slate-200 active:bg-slate-400"} 
      id={group}
        onClick={() => {
          setSelected(!selected)
          console.log(selected)
          console.log(word)
        }}>
            {word}
        </button>
    </>
  );
};

export default WordBox;