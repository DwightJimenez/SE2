import React from 'react'



const Settings = () => {
  const auth = JSON.parse(sessionStorage.getItem("authState"));
  return (
    <div className="mb-4 h-full bg-gray-100 rounded-lg shadow-xl dark:bg-gray-900 p-4">
      <p className='text-3xl'>Settings</p>
      
      <p className=''>{auth.username}</p>
    </div>
  )
}

export default Settings
