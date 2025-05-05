import React from 'react'
import { Button } from "@/components/ui/button";

const SaveDoc = () => {
  return (
    <div className='flex flex-col gap-4'>
      <input type="text"  className='border p-2' placeholder='Document Name' />
      <Button>Create</Button>
    </div>
  )
}

export default SaveDoc
