'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [hovered, setHovered] = useState<string | null>(null)

  const menuItems = [
    {
      path: '/roles',
      title: 'REGISTER ROLES',
      description: 'Assign roles to participants in the supply chain',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bgColor: 'bg-neo-primary',
    },
    {
      path: '/addmed',
      title: 'ORDER MATERIALS',
      description: 'Create new medicine orders in the system',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      bgColor: 'bg-neo-secondary',
    },
    {
      path: '/track',
      title: 'TRACK MATERIALS',
      description: 'Monitor medicine journey through the supply chain',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      bgColor: 'bg-neo-accent',
    },
    {
      path: '/supply',
      title: 'SUPPLY MATERIALS',
      description: 'Manage supply chain flow and transitions',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01" />
        </svg>
      ),
      bgColor: 'bg-[#FF9F1C]', // Orange
    },
  ]

  const supplyChainFlow = [
    { step: '1', label: 'Raw Material', icon: '🌱' },
    { step: '2', label: 'Manufacture', icon: '🏭' },
    { step: '3', label: 'Distribute', icon: '🚚' },
    { step: '4', label: 'Retail', icon: '🏪' },
    { step: '5', label: 'Consumer', icon: '👤' },
  ]

  return (
    <div className="min-h-screen bg-neo-bg font-mono text-neo-dark p-8">
      {/* Header */}
      <div className="container mx-auto px-4 py-8 mb-12 border-4 border-black bg-white shadow-neo">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-neo-primary border-4 border-black shadow-neo mb-6 transform hover:-translate-y-1 hover:shadow-neo-hover transition-all duration-200">
            <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-5xl font-black text-black mb-4 uppercase tracking-tighter">
            Supply Chain Manager
          </h1>
          <p className="text-xl font-bold text-gray-800 max-w-2xl mx-auto border-2 border-black bg-neo-accent p-2 inline-block shadow-neo-active">
            BLOCKCHAIN POWERED SYSTEM
          </p>
        </div>
      </div>

      {/* Supply Chain Flow Visualization */}
      <div className="mb-12 max-w-6xl mx-auto">
        <div className="bg-white border-4 border-black shadow-neo p-8">
          <h2 className="text-3xl font-black text-black mb-8 text-center uppercase border-b-4 border-black pb-4">Supply Chain Flow</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
            {supplyChainFlow.map((item, index) => (
              <div key={item.step} className="flex flex-col items-center relative z-10 flex-1 group">
                <div className="w-20 h-20 bg-neo-light border-4 border-black flex items-center justify-center text-4xl mb-3 shadow-neo transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-neo-hover group-hover:bg-neo-secondary">
                  {item.icon}
                </div>
                <div className="text-center bg-white border-2 border-black p-1 shadow-neo-active">
                  <div className="text-base font-bold text-black uppercase">{item.label}</div>
                  <div className="text-xs font-bold text-gray-600">Step {item.step}</div>
                </div>
                {index < supplyChainFlow.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-1/2 w-full h-1 bg-black -z-10">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-black w-4 h-4 rotate-45"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Menu Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            onMouseEnter={() => setHovered(item.path)}
            onMouseLeave={() => setHovered(null)}
            className={`
              group relative bg-white border-4 border-black p-8 shadow-neo
              transform transition-all duration-200
              hover:-translate-y-2 hover:shadow-neo-hover
              text-left overflow-hidden
            `}
          >
            <div className={`absolute inset-0 ${item.bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-200`} />

            <div className="flex items-start space-x-6 relative z-10">
              <div
                className={`
                  flex-shrink-0 w-24 h-24 border-4 border-black
                  ${item.bgColor}
                  flex items-center justify-center text-black
                  shadow-neo transition-transform duration-200
                  group-hover:rotate-3 group-hover:scale-110
                `}
              >
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-black text-black mb-2 uppercase">
                  {item.title}
                </h3>
                <p className="text-gray-800 font-bold text-sm mb-4 border-l-4 border-black pl-2">
                  {item.description}
                </p>
                <div className="inline-flex items-center bg-black text-white px-4 py-2 font-bold text-sm uppercase shadow-neo-active group-hover:bg-neo-accent group-hover:text-black transition-colors">
                  Get Started
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer Info */}
      <div className="text-center max-w-2xl mx-auto border-t-4 border-black pt-8">
        <p className="mb-2 font-bold text-lg">
          POWERED BY <span className="bg-neo-primary px-2 border-2 border-black shadow-neo-active">BLOCKCHAIN</span>
        </p>
        <p className="text-sm font-bold uppercase tracking-widest">
          Secure • Transparent • Traceable
        </p>
      </div>
    </div>
  )
}
