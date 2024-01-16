'use client'

import Image from 'next/image'
import { MdRestartAlt } from 'react-icons/md'
import { FaBackward, FaForward, FaStepBackward, FaStepForward, FaPause, FaPlay } from 'react-icons/fa'
import ElementButton from '@/components/PlayButton'
import { useState, useEffect } from 'react'
import { originalCards } from '@/lists/arrayElements'
import { BsGithub } from 'react-icons/bs'

interface GameCard{
  id:number
  image:string
  name:string

}

export default function Home() {

  const [currentId, setCurrentId] = useState(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [cards, setCards] = useState<GameCard[]>([])
  const [speed, setSpeed] = useState<number>(3000)
  const [activeButtonValue, setActiveButtonValue] = useState<number | null>(null);
  const [history, setHistory] = useState([])

  useEffect(() => {
    setCards([...originalCards].sort(() => Math.random() - 0.5));
  }, [originalCards]);
  
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const playNextImage = () => {
      setCurrentId((prevId) => (prevId + 1) % cards.length);
    };

    const logName = () => {
      console.log(cards[currentId + 1].name);
    };

    if (isPlaying) {
      intervalId = setInterval(() => {
        playNextImage();
        logName();
        speak(cards[currentId + 1].name)
      }, speed); // 1000 milliseconds = 1 second
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying, cards.length, currentId]);

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying && currentId === 0){
      speak("Corre y se va con")
      speak(cards[0].name)
    }
  }

  const handleIncrement = () => {
    console.log(cards.length)
    if (currentId < cards.length-1){
      setCurrentId(currentId+1)
    }
    speak(cards[currentId+1].name)
  }

  const handleDecrement = () => {
    if (currentId > 0){
      setCurrentId(currentId-1)
    }
    speak(cards[currentId-1].name)
  }

  const refresh = () => {
    setCards([...originalCards].sort(() => Math.random() - 0.5));
    setCurrentId(0)
    setIsPlaying(false)
  }


  const speak = (word:string) => {
    const voices = speechSynthesis.getVoices();
    let utterance = new SpeechSynthesisUtterance(word);
    utterance.pitch = 0; //changes pitch
    utterance.voice = voices[1]; // Choose a specific voice

    speechSynthesis.speak(utterance)
  }

  const regulateSpeed = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const buttonValue = parseInt(event.currentTarget.value, 10);

    if (activeButtonValue !== null) {
      const prevActiveButton = document.querySelector(`button[value="${activeButtonValue}"]`);
      if (prevActiveButton) {
        prevActiveButton.className = 'px-5 py-2 rounded-full shadow-md transition duration-1000 ease-out';
      }
    }

    event.currentTarget.className = 'px-5 py-2 rounded-full shadow-md bg-red-500 text-white'

    setActiveButtonValue(buttonValue);

    setSpeed(parseInt(event.currentTarget.value))
  }

  return (
    <main className='flex flex-col items-center h-full mt-5 justify-center gap-10 md:mt-16'>
      <div className=''>
        <button onClick={refresh}>
          <MdRestartAlt className='text-4xl'/>
        </button>
        <div className='mt-3 text-xl'>
          {currentId+1} / {cards.length}
        </div>
      </div>
      <div className='flex'>
        {
          
        }
          <img src={(cards.length > 0 && currentId !== 0) ? cards[currentId-1].image : ''} 
          className={`rounded-2xl transition-all border shadow-xl w-56 z-10 -rotate-6`} style={{ marginRight: '-190px' }}/>
          <img src={cards.length > 0 ? cards[currentId].image : ''} 
          className={`rounded-2xl border shadow-xl w-72 z-40 focus:outline-none focus:ring focus:ring-violet-300 
          ${isPlaying ? '' : ''}` }/>
          <img src={(cards.length > 0 && currentId >= 2 ) ? cards[currentId-2].image : ''} 
          className={`rounded-2xl border shadow-xl w-52 z-5 rotate-[9deg]`} style={{ marginLeft: '-200px' }}/>
      </div>
      <div className='flex gap-8 text-2xl'>
        <button onClick={()=>setCurrentId(0)}>
          <FaBackward></FaBackward>
        </button>
        <button onClick={handleDecrement}>
          <FaStepBackward></FaStepBackward>
        </button>
        <button className={`rounded-full shadow-lg p-5 transition ease-out duration-500 ${isPlaying ? " bg-red-500 text-white ": " "}`} 
        onClick={handlePlay}>
            {isPlaying ? <FaPause></FaPause> : <FaPlay></FaPlay>}
        </button>
        <button onClick={handleIncrement}>
          <FaStepForward></FaStepForward>
        </button>
        <button onClick={()=>setCurrentId(cards.length-1)}>
          <FaForward></FaForward>
        </button>
      </div>
      <div className='grid grid-flow-row grid-cols-4 gap-4 md:gap-5'>
        <button className='px-5 py-2 rounded-full shadow-md ' value={5000} onClick={regulateSpeed}><span className='font-bold'>5</span> s</button>
        <button className='px-5 py-2 rounded-full shadow-md' value={6000} onClick={regulateSpeed}><span className='font-bold'>6</span> s</button>
        <button className='px-5 py-2 rounded-full shadow-md' value={7000} onClick={regulateSpeed}><span className='font-bold'>7</span> s</button>
        <button className='px-5 py-2 rounded-full shadow-md' value={10000} onClick={regulateSpeed}><span className='font-bold'>10</span> s</button>
      </div>
    </main>
  )
}
