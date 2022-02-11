import React from 'react'
import './home.css'
import { Link } from 'react-router-dom'
import { FaDiscord, FaTwitter } from 'react-icons/fa'

import Footer from '../../components/Footer';
import IntroduceCard from '../../components/IntroduceCard';

import { lannistAddress } from '../../constants/Addresses';

const Home = () => {
  const introduce = [
    {
      title: 'Diversified Investment Portfolio based on Defi',
      content: 'Our unique trading algorithm allows us invest in different DeFi projects, staking Pools, DAOs, NFT and other profitable projects in the Crypto space.  We are a community based project and we abide by decision of our community before we initiate any investment.'
    },
    {
      title: 'Income Guaranteed (Even from the White Walkers)',
      content: "Our long-term expertise aids us in keeping an eye out for bullish and bearish market patterns which keeps us in profit even during Winter when the market is down.  When repeated it means we stay bountiful with great yields and we ensure that you benefit from this yield as a Lannister will always pay his debts."
    },
    {
      title: 'The best Yields in all the seven Kingdoms',
      content: 'LANNISTER provides an excessive yield potential with a protocol that works. It efficiently aggregates return from protocol-owned liquidity with returns from DeFi protocols across many chains to allocate rewards and yield holders.'
    },
  ]

  const introduce_cards = introduce.map((element, index) => (
    <div className="col-lg-4" key={index} >
      <IntroduceCard title={element.title} content={element.content} />
    </div>
  ));

  // console.log(introduce_cards)

  return (
    <div className='home container'>
      {/* Logo */}
      <div className="container d-flex justify-content-center mt-3">
        <div>
          <div className="d-flex justify-content-center">
            <img src="logo512.png" alt="logo" className='logo' />
          </div>
          <div className="d-flex justify-content-center mt-4">
            <img src="assets/title.png" alt="title" className='title' />
          </div>
        </div>
      </div>

      <div className="container mt-5 px-5">
        <p className='fw-bold text-center fs-4'>Roaring your way towards Casterly Rock to earn passive income daily with the Lannister Financial's multi-chain yield farming protocol.</p>
        <p className='lineheight-08 fs-5 text-center text-muted'>Earn passive income daily with <span className='primary-green fw-bold'>6,100% APY</span></p>
        <p className='lineheight-08 fs-5 text-center text-muted'>Only 10 <span className='primary-red fw-bold'>$LNIST</span> tokens needed to get started - try it now.</p>
      </div>

      <div className="container text-center mt-2">
        <Link to='/app'>
          <button type='button' className='btn lnst-red-btn btn-large mt-3'><span className='fw-bold'>Launch App</span></button>
        </Link>
        <a type='button' className='btn lnst-red-btn btn-large mt-3' href={`https://pancakeswap.finance/swap?outputCurrency=${lannistAddress}`} target="_blank"><span className='fw-bold'>Buy $LNIST</span></a>
      </div>

      <div className="row mt-4">
        {introduce_cards}
      </div>

      <div className="container mt-5 px-4">
        <h3 className='mb-4 text-center'>Our Vision</h3>
        <p className='mx-0 fs-5'>In line with our name, <span className='primary-red fw-bold'>Lannister</span> which signifies wealth and power, our goal is to provide you with bountiful income through our diversified investment portfolio. All this will be achievable through a single <span className='primary-red fw-bold'>Lannister Node</span>.</p>
      </div>

      <div className="container mt-5">
        <h3 className='text-center'>How does <span className='primary-red fw-bold'>Lannister</span> and its <span className='primary-red fw-bold'>$LNIST token</span> work?</h3>
        <div className="row mt-4">
          <div className="col-lg-6 my-2">
            <p className='how-works-card'>You buy <span className='primary-red fw-bold'>10 $LNIST tokens</span> to create 1 Node and you get <span className='primary-red fw-bold'>0.7 $LNIST token</span> as daily rewards - for life!</p>
          </div>
          <div className="col-lg-6 my-2">
            <p className='how-works-card'><span className='primary-red fw-bold'>Our objective</span> is to help as many to generate passive income continuously with minimal effort. This is the reward people truly deserve and we are bringing this to you.</p>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <h3 className='mb-4 text-center'>Get started with <img src="assets/title_red.png" alt="title" className='title-red' /> now</h3>
        <div className="d-flex flex-row justify-content-between align-items-center">
          <p className='m-0'>Buy <span className='primary-red fw-bold'>$LNIST</span></p>
          <img src="assets/nextarrow.png" alt="arrow" style={{ height: '15px' }} />
          <p className='m-0'>Create a <span className='primary-green fw-bold'>Lannister-Node</span></p>
          <img src="assets/nextarrow.png" alt="arrow" style={{ height: '15px' }} />
          <p className='m-0'>Enjoy <span className='primary-almond fw-bold'>daily rewards</span></p>
        </div>
      </div>

      <div className="container mb-5">
        <h3 className='text-center'>JOIN OUR COMMUNITY</h3>
        <div className="d-flex justify-content-center mt-4">
          <a href="https://discord.gg/kyQgxgrzD9" target="_blank" style={{ color: 'white' }}>
            <FaDiscord className='community-icon' />
          </a>
          <a href="https://twitter.com/LannisterNodes" target="_blank" style={{ color: 'white' }}>
            <FaTwitter className='community-icon' />
          </a>
        </div>
      </div>

      <Footer />
    </div >
  )
}

export default Home;
