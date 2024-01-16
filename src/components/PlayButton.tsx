'use client'

import { FC } from 'react'

import { FaBackward, FaForward, FaStepBackward, FaStepForward, FaPause, FaPlay } from 'react-icons/fa'


interface PlayButtonProps {
  isPlaying:boolean
}

export default function PlayButton({isPlaying}: PlayButtonProps){
    return (
        <button className='rounded-full shadow-lg p-5'>
            {isPlaying ? <FaPause></FaPause> : <FaPlay></FaPlay>}
        </button>
    )
}
