import { WordProps } from "./WordBox";

interface PuzzleData {
    puzzleNumber: string;
    words: WordProps[];
}

const useLogic = () => {
    const puzzleData: PuzzleData = {
        puzzleNumber: '01',
        words: [
            { word: 'Grape', group: '3 fruits' },
            { word: 'Apple', group: '3 fruits' },
            { word: 'Watermelon', group: '3 fruits' },
            { word: 'Orange', group: '3 fruits' },
            { word: 'Blue', group: '4 colors' },
            { word: 'Red', group: '4 colors' },
            { word: 'Green', group: '4 colors' },
            { word: 'Yellow', group: '4 colors' },
            { word: 'Dog', group: '2 animals' },
            { word: 'Cat', group: '2 animals' },
            { word: 'Chicken', group: '2 animals' },
            { word: 'Bird', group: '2 animals' },
            { word: 'Brazil', group: '1 countries' },
            { word: 'France', group: '1 countries' },
            { word: 'India', group: '1 countries' },
            { word: 'South Africa', group: '1 countries' },
        ]
    };
  return {puzzleData}
};

export default useLogic;
