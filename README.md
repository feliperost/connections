## Connections
This is a study project trying to recreate the NY Times game "Connections". Play the original: https://www.nytimes.com/games/connections

## How to play
- There are 16 words displayed and scrambled. The challenge is to figure out the connecting theme between a group of words.
- Each group has 4 words and exactly one solution. The game may trick you with words that seem to belong to multiple categories.
- Click the words to select them, and click "Submit" to check if your guess is correct.
- You can make 4 mistakes before the game is over.

## Breaking down the development thought process
- We need to be able to display words coming through a list in a 4x4 grid.
- Each word belongs to a group, and there are 4 groups total (each word is a word&group pair).
- The user must be able to select and de-select words.
- We need to limit to a maxixum of 4 selected words.
- We need to create a button that shuffles and scrambles again the displayed words (rearranging the words may help the player).
- If the words submitted are from the same group, they are moved to a state of locked non-interactable words, which displays the correct words so far. when all 4 groups are found and there are no more words to be selected, the game ends and the player wins.
- If the words selected and submitted are NOT from the same group, the user makes a mistake, and loses 1 'life'.
- We need to display how many mistakes remaining the player have, which may change as the game goes on.
- If there are no more mistakes remaining, the game is over, and the correct solution is displayed.
- We need to work on the visual aspect of the game: smooth transitions, shaking when the words submitted are wrong, etc.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.



