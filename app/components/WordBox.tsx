"use client"; 

export type WordProps = { 
  word: string; 
  group: string;
  selected: boolean;
};

const WordBox = ({ word, group, selected }: WordProps) => {
  return (
    <>
        <div>
            <div id={group}>{word}</div>
        </div>
    </>
  );
};

export default WordBox;
