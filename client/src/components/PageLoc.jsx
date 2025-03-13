import React from 'react'

const PageLoc = ({currentPage}) => {
  return (
    <div className='flex sticky top-14 z-40  mb-4 p-4 bg-white w-full dark:bg-black rounded-lg shadow-lg'>
      <span className='text-2xl'>{currentPage}</span>
    </div>
  )
}

export default PageLoc
