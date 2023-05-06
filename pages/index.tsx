import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <div className="text-black flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-12 text-center">
        <h1 className="font-bold text-4xl mb-4">Welcome to Waste-To-Wow!</h1>
        <p className="text-lg mb-8">Your go-to source for upcycling waste and reducing environmental impact.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow-md rounded-md p-4">
            <h2 className="font-bold text-xl mb-2">Find a Guide</h2>
            <p>Discover guides and tutorials on how to upcycle waste into useful items, from plastic to tires.</p>
            <Link href="/ViewAll">
              <span className="bg-blue-500 hover:bg-indigo text-black py-2 px-4 rounded-md mt-4 inline-block">Get Started</span>
            </Link>
          </div>
          <div className="bg-white shadow-md rounded-md p-4">
            <h2 className="font-bold text-xl mb-2">Submit a Guide</h2>
            <p>Share your own upcycling projects and guides with the community and help make a positive impact on the environment.</p>
            <Link href="/Add">
              <span className="bg-blue-500 hover:bg-blue-600 text-black py-2 px-4 rounded-md mt-4 inline-block">Get Started</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
