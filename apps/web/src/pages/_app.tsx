import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { type AppType } from 'next/app';
import { Inter } from 'next/font/google';

import '~/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={`font-sans ${inter.variable}`}>
      <DndProvider backend={HTML5Backend}>
        <Component {...pageProps} />
      </DndProvider>
    </main>
  );
};

export default MyApp;
