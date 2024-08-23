import { WordProps } from "./WordBox";

const useLogic = () => {
    const words: WordProps[] = [
        {
            word: 'Grape',
            group: 'fruits',
            selected: false
        },
        {
            word: 'Apple',
            group: 'fruits',
            selected: false
        },
        {
            word: 'Watermelon',
            group: 'fruits',
            selected: false
        },
        {
            word: 'Orange',
            group: 'fruits',
            selected: false
        },
        {
            word: 'Blue',
            group: 'colors',
            selected: false
        },
        {
            word: 'Red',
            group: 'colors',
            selected: false
        },
        {
            word: 'Green',
            group: 'colors',
            selected: false
        },
        {
            word: 'Yellow',
            group: 'colors',
            selected: false
        },
        {
            word: 'Dog',
            group: 'animals',
            selected: false
        },
        {
            word: 'Cat',
            group: 'animals',
            selected: false
        },
        {
            word: 'Chicken',
            group: 'animals',
            selected: false
        },
        {
            word: 'Bird',
            group: 'animals',
            selected: false
        },
        {
            word: 'Brazil',
            group: 'countries',
            selected: false
        },
        {
            word: 'France',
            group: 'countries',
            selected: false
        },
        {
            word: 'India',
            group: 'countries',
            selected: false
        },
        {
            word: 'South Africa',
            group: 'countries',
            selected: false
        },
    ]
  return {words}
};

export default useLogic;
