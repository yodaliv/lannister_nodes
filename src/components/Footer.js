import React from 'react'

export default function Footer () {
  return (
    <div className='container mt-4'>
      <div className="d-flex flex-wrap justify-content-between align-items-center">
        <img src="assets/text-logo.png" alt="text-logo" className='text-logo' />
        <span>&copy; {new Date().getFullYear()} Copyright Lannister.financial</span>
      </div>
    </div>
  )
}
