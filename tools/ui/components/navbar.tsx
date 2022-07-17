import Link from 'next/link'
import React from 'react'

function Navbar() {
  return (
    <nav className='flex flex-row h-12 w-full bg-gray-300 justify-start items-center px-4'>
      <Link href={'/'}>

        <h1>GeoBirds</h1>
      </Link>
    </nav>
  )
}

export default Navbar