import React from 'react'

const IntroduceCard = ({ title, content }) => {
  return (
    <div className='introduce-card'>
      <p className="lead fw-bold primary-almond">{title}</p>
      <p className='introduce-content mb-0'>{content}</p>
    </div>
  )
}

export default IntroduceCard;