'use client';

const arrayImages = Array.from({ length: 20 }, (_, i) => `/assets/${i + 1}.svg`);

import {
  addTransitionType,
  startTransition,
  useState,
  ViewTransition
} from 'react';
import './projects.css';
import './project2.css';
export function Project() {
  const [show, setShow] = useState(true);
  const [indexFirstImage, setIndexFirsImage] = useState(0);
  const [indexSecondImage, setIndexSecondImage] = useState(19);

  function handlePrev() {
    startTransition(() => {
      addTransitionType(show ? 'slide-out-left' : 'slide-in-right');
      addTransitionType(show ? 'slide-in-right-2' : 'slide-out-left-2');
      setShow(!show);
    });
  }

  function handleNext() {
    startTransition(() => {
      addTransitionType(show ? 'slide-out-right' : 'slide-in-left');
      addTransitionType(show ? 'slide-in-left-2' : 'slide-out-right-2');
      setShow(!show);
    });
  }

  return (
    <article className='min-h-screen relative flex place-content-center flex-wrap h-screen z-20 '>
      <aside className='w-full h-[50vmin] flex flex-wrap place-content-center backdrop-blur-[3vmax]  bg-blue-400/40 relative'>
        {!show ? (
          <ViewTransition
            enter={{
              'slide-in-left-2': 'slide-in-left',
              'slide-in-right-2': 'slide-in-right'
            }}
            exit={{
              'slide-out-left-2': 'slide-out-left',
              'slide-out-right-2': 'slide-out-right'
            }}
          >
            <img
              className='w-[28vmax] h-[45vmin] border-[0.1vmax] border-solid border-black'
              src={arrayImages[indexSecondImage]}
              alt='Svg '
            />
          </ViewTransition>
        ) : null}
        {show ? (
          <ViewTransition
            enter={{
              'slide-in-left': 'slide-in-left',
              'slide-in-right': 'slide-in-right'
            }}
            exit={{
              'slide-out-left': 'slide-out-left',
              'slide-out-right': 'slide-out-right'
            }}
          >
            <img
              className='w-[28vmax] h-[45vmin] border-[0.1vmax] border-solid border-black absolute -translate-1/2 left-1/2 top-1/2'
              src={arrayImages[indexFirstImage]}
              alt='Svg '
            />
          </ViewTransition>
        ) : null}
      </aside>
      <section className='absolute left-1/2 -translate-x-1/2 bottom-[2vmax] flex gap-[1vmax]'>
        {[
          { otherClassName: 'scale-x-[-1] border-cyan-300', fn: handlePrev },
          { otherClassName: 'border-amber-300', fn: handleNext }
        ].map(({ otherClassName, fn }, i) => (
          <img
            key={i}
            src='/assets/arrow.gif'
            alt='Arrow Right'
            className={`w-[3.2vmax] h-[3.2vmax] border-[0.1vmax] border-solid rounded-full  object-contain active:opacity-20 select-none ${otherClassName}`}
            draggable={false}
            onClick={fn}
          />
        ))}
      </section>
    </article>
  );
}
