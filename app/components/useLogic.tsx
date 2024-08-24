import { WordProps } from "./WordBox";

const useLogic = () => {
    const words: WordProps[] = [
        {
            word: 'Grape',
            group: 'fruits'
        },
        {
            word: 'Apple',
            group: 'fruits'
        },
        {
            word: 'Watermelon',
            group: 'fruits'
        },
        {
            word: 'Orange',
            group: 'fruits'
        },
        {
            word: 'Blue',
            group: 'colors'
        },
        {
            word: 'Red',
            group: 'colors'
        },
        {
            word: 'Green',
            group: 'colors'
        },
        {
            word: 'Yellow',
            group: 'colors'
        },
        {
            word: 'Dog',
            group: 'animals'
        },
        {
            word: 'Cat',
            group: 'animals'
        },
        {
            word: 'Chicken',
            group: 'animals'
        },
        {
            word: 'Bird',
            group: 'animals'
        },
        {
            word: 'Brazil',
            group: 'countries'
        },
        {
            word: 'France',
            group: 'countries'
        },
        {
            word: 'India',
            group: 'countries'
        },
        {
            word: 'South Africa',
            group: 'countries'
        },
    ]
  return {words}
};

export default useLogic;
