'use client'

import Image from 'next/image'
import { MdRestartAlt } from 'react-icons/md'
import { FaBackward, FaForward, FaStepBackward, FaStepForward, FaPause, FaPlay } from 'react-icons/fa'
import ElementButton from '@/components/PlayButton'
import { useState, useEffect } from 'react'
import { originalCards } from '@/lists/arrayElements'
import { BsGithub, BsStack } from 'react-icons/bs'
import toast, { Toaster } from 'react-hot-toast'

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
  const [history, setHistory] = useState<GameCard[]>([])
  const [isHistoryOn, setIsHistoryOn] = useState<boolean>(false)
  const [hasBegun, setHasBegun] = useState<boolean>(false)
  const [maxId, setMaxId] = useState(0)

  useEffect(() => {
    setCards([...originalCards].sort(() => Math.random() - 0.5));
  }, [originalCards]);
  
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const playNextImage = () => {
      setCurrentId((prevId) => (prevId + 1) % cards.length);
    };

    const logName = () => {
      console.log(history[currentId]);
    };

    if (isPlaying) {
      intervalId = setInterval(() => {
        playNextImage();
        speak(cards[currentId + 1].name)
        setHistory(oldArray => [...oldArray, cards[currentId]])
        updateHistory(history)
        setMaxId(maxId+1)
        logName();
      }, speed); // 1000 milliseconds = 1 second
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying, cards.length, currentId, history.length]);

  function uniqueById(items:GameCard[]) {
    const set = new Set();
    return items.filter((item) => {
      const isDuplicate = set.has(item.id);
      set.add(item.id);
      return !isDuplicate;
    });
  }

  const updateHistory = (newItems:GameCard[]) => {
    setHistory((items) => {
      return uniqueById([...items, ...newItems]);
    });
  };

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
      setHistory(oldArray => [...oldArray, cards[currentId]])
      updateHistory(history)
    }
    speak(cards[currentId+1].name)
  }

  const handleDecrement = () => {
    if (currentId > 0){
      setCurrentId(currentId-1)
    }
    speak(cards[currentId-1].name)
  }

  const refresh = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setCards([...originalCards].sort(() => Math.random() - 0.5));
    setCurrentId(0)
    setHistory([])
    setIsPlaying(false)
    toast.success("Barajeadas Correctamente")
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
        prevActiveButton.className = 'px-5 py-2 rounded-full shadow-md transition duration-500 ease-out';
      }
    }

    event.currentTarget.className = 'px-5 py-2 rounded-full shadow-md bg-red-500 text-white'

    setActiveButtonValue(buttonValue);

    setSpeed(parseInt(event.currentTarget.value))
  }

  return (
    <main className='flex flex-col items-center h-full mt-5 justify-center gap-10 md:mt-16 text-slate-800'>
      <Toaster position="top-center"></Toaster>
      <div className='flex flex-col justify-center items-center mb-5'>
        <div className='flex gap-20'>
          <button className={`hover:animate-spin-once`} onClick={refresh}>
            <MdRestartAlt className='text-4xl'/>
          </button>
          <button onClick={() => {setIsHistoryOn(!isHistoryOn)}}>
            <BsStack className={`text-3xl trasition duration-300 ease-out ${isHistoryOn ? " text-red-500 text-4xl" : " " }`}/>
          </button>
        </div>
      </div>
      <div>
        {
          isHistoryOn ? 
          <div className="flex overflow-x-auto">
            {history.map((item, index) => (
              <div key={index} className="flex-none p-3">
                <img src={(cards.length > 0 && currentId !== 0) ? item.image : ''} 
                className={`rounded-2xl transition-all w-72 border fade-in`} />
              </div>
            ))}
          </div>
          :
          <div className='flex fade-in'>
            <img src={(cards.length > 0 && currentId !== 0) ? cards[currentId-1].image : ''} 
            className={`rounded-2xl transition-all border shadow-2xl w-64 h-full z-10 -rotate-6`} style={{ marginRight: '-200px' }}/>
            <img src={cards.length > 0 ? cards[currentId].image : ''} 
            className={`rounded-2xl border shadow-2xl w-72 z-40 focus:outline-none focus:ring focus:ring-violet-300 
            ${isPlaying ? '' : ''}` }/>
            <img src={(cards.length > 0 && currentId >= 2 ) ? cards[currentId-2].image : ''} 
            className={`rounded-2xl border shadow-2xl w-64 h-full z-5 rotate-[9deg]`} style={{ marginLeft: '-210px' }}/>
          </div>
        }
      </div>
      <div className='flex gap-8 text-2xl'>
        <button onClick={handleDecrement}>
          <FaStepBackward></FaStepBackward>
        </button>
        <button className={`rounded-full shadow-lg p-5 transition ease-out duration-500 ${isPlaying ? " bg-red-500 text-white animate-bounce": ""}`} 
        onClick={handlePlay}>
            {isPlaying ? <FaPause></FaPause> : <FaPlay></FaPlay>}
        </button>
        <button onClick={handleIncrement}>
          <FaStepForward></FaStepForward>
        </button>
      </div>
      <div className='grid grid-flow-row grid-cols-4 gap-4 md:gap-5'>
        <button className='px-5 py-2 rounded-full shadow-md' value={5000} onClick={regulateSpeed}><span className='font-bold'>5</span> s</button>
        <button className='px-5 py-2 rounded-full shadow-md' value={6000} onClick={regulateSpeed}><span className='font-bold'>6</span> s</button>
        <button className='px-5 py-2 rounded-full shadow-md' value={7000} onClick={regulateSpeed}><span className='font-bold'>7</span> s</button>
        <button className='px-5 py-2 rounded-full shadow-md' value={10000} onClick={regulateSpeed}><span className='font-bold'>10</span> s</button>
      </div>
    </main>
  )
}
