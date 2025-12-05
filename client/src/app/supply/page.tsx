'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadWeb3, getContract } from '@/lib/web3'

interface Medicine {
  id: string
  name: string
  description: string
  RMSid: string
  MANid: string
  DISid: string
  RETid: string
  stage: string
}

export default function Supply() {
  const router = useRouter()
  const [currentAccount, setCurrentAccount] = useState('')
  const [loader, setLoader] = useState(true)
  const [supplyChain, setSupplyChain] = useState<any>(null)
  const [med, setMed] = useState<{ [key: number]: Medicine }>({})
  const [medStage, setMedStage] = useState<string[]>([])
  const [rmsId, setRmsId] = useState('')
  const [manId, setManId] = useState('')
  const [disId, setDisId] = useState('')
  const [retId, setRetId] = useState('')
  const [soldId, setSoldId] = useState('')

  useEffect(() => {
    loadWeb3()
    loadBlockchainData()
  }, [])

  const loadBlockchainData = async () => {
    try {
      setLoader(true)
      const { contract, account } = await getContract()
      setSupplyChain(contract)
      setCurrentAccount(account)

      const medCtr = await contract.methods.medicineCtr().call()
      const medData: { [key: number]: Medicine } = {}
      const medStageData: string[] = []

      for (let i = 0; i < medCtr; i++) {
        medData[i] = await contract.methods.MedicineStock(i + 1).call()
        medStageData[i] = await contract.methods.showStage(i + 1).call()
      }

      setMed(medData)
      setMedStage(medStageData)
      setLoader(false)
    } catch (err: any) {
      const errorMessage = err?.message || 'The smart contract is not deployed to the current network'
      console.error('Error loading blockchain data:', err)
      alert(errorMessage)
      setLoader(false)
    }
  }

  const handlerChangeRMSId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRmsId(event.target.value)
  }

  const handlerChangeManId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setManId(event.target.value)
  }

  const handlerChangeDisId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDisId(event.target.value)
  }

  const handlerChangeRetId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRetId(event.target.value)
  }

  const handlerChangeSoldId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSoldId(event.target.value)
  }

  const handlerSubmitRMSsupply = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const receipt = await supplyChain.methods.RMSsupply(rmsId).send({ from: currentAccount })
      if (receipt) {
        loadBlockchainData()
        setRmsId('')
        alert('Raw materials supplied successfully!')
      }
    } catch (err: any) {
      let errorMessage = 'An error occurred!'
      if (err?.message) {
        errorMessage = err.message
      } else if (err?.error?.message) {
        errorMessage = err.error.message
      }

      // Check for common revert reasons
      if (errorMessage.includes('revert') || errorMessage.includes('require')) {
        if (errorMessage.includes('findRMS') || errorMessage.includes('findMAN') || errorMessage.includes('findDIS') || errorMessage.includes('findRET')) {
          errorMessage = 'Your account is not registered for this role. Please register your account first in the Roles page.'
        } else if (errorMessage.includes('stage') || errorMessage.includes('STAGE')) {
          errorMessage = 'Invalid stage transition. Make sure the medicine is in the correct stage for this operation.'
        } else if (errorMessage.includes('medicineID') || errorMessage.includes('_medicineID')) {
          errorMessage = 'Invalid medicine ID. Please check the medicine ID and try again.'
        } else {
          errorMessage = `Transaction failed: ${errorMessage}`
        }
      }

      console.error('Transaction error:', err)
      alert(errorMessage)
    }
  }

  const handlerSubmitManufacturing = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const receipt = await supplyChain.methods.Manufacturing(manId).send({ from: currentAccount })
      if (receipt) {
        loadBlockchainData()
        setManId('')
        alert('Manufacturing completed successfully!')
      }
    } catch (err: any) {
      let errorMessage = 'An error occurred!'
      if (err?.message) {
        errorMessage = err.message
      } else if (err?.error?.message) {
        errorMessage = err.error.message
      }

      // Check for common revert reasons
      if (errorMessage.includes('revert') || errorMessage.includes('require')) {
        if (errorMessage.includes('findRMS') || errorMessage.includes('findMAN') || errorMessage.includes('findDIS') || errorMessage.includes('findRET')) {
          errorMessage = 'Your account is not registered for this role. Please register your account first in the Roles page.'
        } else if (errorMessage.includes('stage') || errorMessage.includes('STAGE')) {
          errorMessage = 'Invalid stage transition. Make sure the medicine is in the correct stage for this operation.'
        } else if (errorMessage.includes('medicineID') || errorMessage.includes('_medicineID')) {
          errorMessage = 'Invalid medicine ID. Please check the medicine ID and try again.'
        } else {
          errorMessage = `Transaction failed: ${errorMessage}`
        }
      }

      console.error('Transaction error:', err)
      alert(errorMessage)
    }
  }

  const handlerSubmitDistribute = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const receipt = await supplyChain.methods.Distribute(disId).send({ from: currentAccount })
      if (receipt) {
        loadBlockchainData()
        setDisId('')
        alert('Distribution completed successfully!')
      }
    } catch (err: any) {
      let errorMessage = 'An error occurred!'
      if (err?.message) {
        errorMessage = err.message
      } else if (err?.error?.message) {
        errorMessage = err.error.message
      }

      // Check for common revert reasons
      if (errorMessage.includes('revert') || errorMessage.includes('require')) {
        if (errorMessage.includes('findRMS') || errorMessage.includes('findMAN') || errorMessage.includes('findDIS') || errorMessage.includes('findRET')) {
          errorMessage = 'Your account is not registered for this role. Please register your account first in the Roles page.'
        } else if (errorMessage.includes('stage') || errorMessage.includes('STAGE')) {
          errorMessage = 'Invalid stage transition. Make sure the medicine is in the correct stage for this operation.'
        } else if (errorMessage.includes('medicineID') || errorMessage.includes('_medicineID')) {
          errorMessage = 'Invalid medicine ID. Please check the medicine ID and try again.'
        } else {
          errorMessage = `Transaction failed: ${errorMessage}`
        }
      }

      console.error('Transaction error:', err)
      alert(errorMessage)
    }
  }

  const handlerSubmitRetail = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const receipt = await supplyChain.methods.Retail(retId).send({ from: currentAccount })
      if (receipt) {
        loadBlockchainData()
        setRetId('')
        alert('Retail completed successfully!')
      }
    } catch (err: any) {
      let errorMessage = 'An error occurred!'
      if (err?.message) {
        errorMessage = err.message
      } else if (err?.error?.message) {
        errorMessage = err.error.message
      }

      // Check for common revert reasons
      if (errorMessage.includes('revert') || errorMessage.includes('require')) {
        if (errorMessage.includes('findRMS') || errorMessage.includes('findMAN') || errorMessage.includes('findDIS') || errorMessage.includes('findRET')) {
          errorMessage = 'Your account is not registered for this role. Please register your account first in the Roles page.'
        } else if (errorMessage.includes('stage') || errorMessage.includes('STAGE')) {
          errorMessage = 'Invalid stage transition. Make sure the medicine is in the correct stage for this operation.'
        } else if (errorMessage.includes('medicineID') || errorMessage.includes('_medicineID')) {
          errorMessage = 'Invalid medicine ID. Please check the medicine ID and try again.'
        } else {
          errorMessage = `Transaction failed: ${errorMessage}`
        }
      }

      console.error('Transaction error:', err)
      alert(errorMessage)
    }
  }

  const handlerSubmitSold = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const receipt = await supplyChain.methods.sold(soldId).send({ from: currentAccount })
      if (receipt) {
        loadBlockchainData()
        setSoldId('')
        alert('Item marked as sold successfully!')
      }
    } catch (err: any) {
      let errorMessage = 'An error occurred!'
      if (err?.message) {
        errorMessage = err.message
      } else if (err?.error?.message) {
        errorMessage = err.error.message
      }

      // Check for common revert reasons
      if (errorMessage.includes('revert') || errorMessage.includes('require')) {
        if (errorMessage.includes('findRMS') || errorMessage.includes('findMAN') || errorMessage.includes('findDIS') || errorMessage.includes('findRET')) {
          errorMessage = 'Your account is not registered for this role. Please register your account first in the Roles page.'
        } else if (errorMessage.includes('stage') || errorMessage.includes('STAGE')) {
          errorMessage = 'Invalid stage transition. Make sure the medicine is in the correct stage for this operation.'
        } else if (errorMessage.includes('medicineID') || errorMessage.includes('_medicineID')) {
          errorMessage = 'Invalid medicine ID. Please check the medicine ID and try again.'
        } else {
          errorMessage = `Transaction failed: ${errorMessage}`
        }
      }

      console.error('Transaction error:', err)
      alert(errorMessage)
    }
  }

  const getStageColor = (stage: string) => {
    if (stage.includes('Ordered')) return 'bg-blue-200 text-black border-black'
    if (stage.includes('Raw Material')) return 'bg-green-200 text-black border-black'
    if (stage.includes('Manufacturing')) return 'bg-yellow-200 text-black border-black'
    if (stage.includes('Distribution')) return 'bg-purple-200 text-black border-black'
    if (stage.includes('Retail')) return 'bg-orange-200 text-black border-black'
    if (stage.includes('Sold')) return 'bg-gray-200 text-black border-black'
    return 'bg-gray-100 text-black border-black'
  }

  if (loader) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neo-bg">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-4 border-black border-t-transparent mx-auto mb-4 rounded-full"></div>
          <h1 className="text-2xl font-black text-black uppercase">Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neo-bg p-5 font-mono text-neo-dark">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white border-4 border-black shadow-neo p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-neo-secondary border-4 border-black flex items-center justify-center shadow-neo-active">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-black text-black uppercase">Supply Chain Flow</h1>
                <p className="text-gray-800 font-bold text-sm">Manage the flow of materials through the supply chain</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-neo-primary border-2 border-black text-black font-bold uppercase shadow-neo-active hover:shadow-neo-hover hover:-translate-y-1 transition-all flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              HOME
            </button>
          </div>
          <div className="text-xs font-bold bg-neo-light border-2 border-black p-2 inline-block shadow-neo-active">
            <span className="font-black">Account:</span> {currentAccount}
          </div>
        </div>

        {/* Flow Visualization */}
        <div className="bg-white border-4 border-black shadow-neo p-8 mb-8">
          <h2 className="text-2xl font-black text-black uppercase mb-8 flex items-center">
            <svg className="w-6 h-6 mr-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Supply Chain Process Flow
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 p-8 bg-neo-light border-2 border-black shadow-neo-active">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-neo-primary border-2 border-black flex items-center justify-center text-black font-black shadow-neo-active">
                1
              </div>
              <span className="text-xs mt-2 text-black font-black uppercase text-center">Order</span>
            </div>
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-neo-secondary border-2 border-black flex items-center justify-center text-black font-black shadow-neo-active">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-xs mt-2 text-black font-black uppercase text-center">RMS</span>
            </div>
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-neo-accent border-2 border-black flex items-center justify-center text-black font-black shadow-neo-active">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <span className="text-xs mt-2 text-black font-black uppercase text-center">Manufacture</span>
            </div>
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-neo-primary border-2 border-black flex items-center justify-center text-black font-black shadow-neo-active">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <span className="text-xs mt-2 text-black font-black uppercase text-center">Distribute</span>
            </div>
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-neo-secondary border-2 border-black flex items-center justify-center text-black font-black shadow-neo-active">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-xs mt-2 text-black font-black uppercase text-center">Retail</span>
            </div>
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-neo-accent border-2 border-black flex items-center justify-center text-black font-black shadow-neo-active">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs mt-2 text-black font-black uppercase text-center">Sold</span>
            </div>
          </div>
        </div>

        {/* Medicines Table */}
        <div className="bg-white border-4 border-black shadow-neo p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-black uppercase flex items-center">
              <svg className="w-6 h-6 mr-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Available Batteries
            </h2>
            <div className="px-4 py-2 bg-neo-secondary border-2 border-black text-black font-black text-sm shadow-neo-active">
              Total: {Object.keys(med).length} items
            </div>
          </div>

          {Object.keys(med).length === 0 ? (
            <div className="text-center py-12 bg-neo-light border-2 border-black border-dashed">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-600 font-bold text-lg uppercase">No batteries available yet</p>
              <p className="text-gray-500 font-bold text-sm mt-2">Add batteries in the Order Materials page</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-2 border-black">
                <thead>
                  <tr className="bg-neo-secondary border-b-2 border-black">
                    <th className="px-6 py-4 text-left text-sm font-black text-black uppercase border-r-2 border-black">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-black text-black uppercase border-r-2 border-black">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-black text-black uppercase border-r-2 border-black">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-black text-black uppercase">Current Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black">
                  {Object.keys(med).map((key) => {
                    const index = parseInt(key)
                    const stage = medStage[index]
                    return (
                      <tr key={key} className="hover:bg-neo-light transition-colors">
                        <td className="px-6 py-4 border-r-2 border-black">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-neo-secondary border-2 border-black rounded-none flex items-center justify-center text-black font-bold mr-3 shadow-neo-active">
                              {med[index].id}
                            </div>
                            <span className="font-bold text-black">{med[index].id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-black border-r-2 border-black">{med[index].name}</td>
                        <td className="px-6 py-4 text-gray-800 font-medium border-r-2 border-black">{med[index].description}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-bold border-2 ${getStageColor(stage)} shadow-neo-active`}>
                            {stage}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Supply Chain Steps */}
        <div className="space-y-8">
          {/* Step 1: RMS Supply */}
          <div className="bg-neo-light border-4 border-black shadow-neo p-8 relative">
            <div className="absolute -left-4 -top-4 w-12 h-12 bg-neo-primary border-4 border-black flex items-center justify-center text-black font-black text-xl shadow-neo-active z-10">
              1
            </div>
            <div className="flex items-center mb-6 pl-6">
              <div className="w-12 h-12 bg-neo-secondary border-2 border-black flex items-center justify-center mr-4 shadow-neo-active">
                <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="flex-1">
                <h5 className="text-xl font-black text-black uppercase">
                  Supply Raw Materials
                </h5>
                <p className="text-sm text-gray-800 font-bold mt-1">Only a registered Raw Material Supplier can perform this step</p>
              </div>
            </div>
            <form onSubmit={handlerSubmitRMSsupply} className="flex flex-col md:flex-row gap-4 pl-6">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <input
                  className="w-full pl-12 pr-4 py-4 border-2 border-black focus:ring-0 focus:shadow-neo-hover text-lg bg-white shadow-neo-active transition-all placeholder-gray-500 font-bold"
                  type="text"
                  onChange={handlerChangeRMSId}
                  placeholder="Enter Battery ID"
                  value={rmsId}
                  required
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-neo-primary border-2 border-black text-black font-black uppercase hover:bg-neo-secondary transition-all shadow-neo-active hover:shadow-neo-hover hover:-translate-y-1 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Supply
              </button>
            </form>
          </div>

          {/* Step 2: Manufacturing */}
          <div className="bg-neo-light border-4 border-black shadow-neo p-8 relative">
            <div className="absolute -left-4 -top-4 w-12 h-12 bg-neo-secondary border-4 border-black flex items-center justify-center text-black font-black text-xl shadow-neo-active z-10">
              2
            </div>
            <div className="flex items-center mb-6 pl-6">
              <div className="w-12 h-12 bg-neo-primary border-2 border-black flex items-center justify-center mr-4 shadow-neo-active">
                <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div className="flex-1">
                <h5 className="text-xl font-black text-black uppercase">
                  Manufacture
                </h5>
                <p className="text-sm text-gray-800 font-bold mt-1">Only a registered Manufacturer can perform this step</p>
              </div>
            </div>
            <form onSubmit={handlerSubmitManufacturing} className="flex flex-col md:flex-row gap-4 pl-6">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <input
                  className="w-full pl-12 pr-4 py-4 border-2 border-black focus:ring-0 focus:shadow-neo-hover text-lg bg-white shadow-neo-active transition-all placeholder-gray-500 font-bold"
                  type="text"
                  onChange={handlerChangeManId}
                  placeholder="Enter Battery ID"
                  value={manId}
                  required
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-neo-secondary border-2 border-black text-black font-black uppercase hover:bg-neo-primary transition-all shadow-neo-active hover:shadow-neo-hover hover:-translate-y-1 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Manufacture
              </button>
            </form>
          </div>

          {/* Step 3: Distribute */}
          <div className="bg-neo-light border-4 border-black shadow-neo p-8 relative">
            <div className="absolute -left-4 -top-4 w-12 h-12 bg-neo-accent border-4 border-black flex items-center justify-center text-black font-black text-xl shadow-neo-active z-10">
              3
            </div>
            <div className="flex items-center mb-6 pl-6">
              <div className="w-12 h-12 bg-neo-secondary border-2 border-black flex items-center justify-center mr-4 shadow-neo-active">
                <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="flex-1">
                <h5 className="text-xl font-black text-black uppercase">
                  Distribute
                </h5>
                <p className="text-sm text-gray-800 font-bold mt-1">Only a registered Distributor can perform this step</p>
              </div>
            </div>
            <form onSubmit={handlerSubmitDistribute} className="flex flex-col md:flex-row gap-4 pl-6">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <input
                  className="w-full pl-12 pr-4 py-4 border-2 border-black focus:ring-0 focus:shadow-neo-hover text-lg bg-white shadow-neo-active transition-all placeholder-gray-500 font-bold"
                  type="text"
                  onChange={handlerChangeDisId}
                  placeholder="Enter Battery ID"
                  value={disId}
                  required
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-neo-accent border-2 border-black text-black font-black uppercase hover:bg-neo-secondary transition-all shadow-neo-active hover:shadow-neo-hover hover:-translate-y-1 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Distribute
              </button>
            </form>
          </div>

          {/* Step 4: Retail */}
          <div className="bg-neo-light border-4 border-black shadow-neo p-8 relative">
            <div className="absolute -left-4 -top-4 w-12 h-12 bg-neo-primary border-4 border-black flex items-center justify-center text-black font-black text-xl shadow-neo-active z-10">
              4
            </div>
            <div className="flex items-center mb-6 pl-6">
              <div className="w-12 h-12 bg-neo-accent border-2 border-black flex items-center justify-center mr-4 shadow-neo-active">
                <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="flex-1">
                <h5 className="text-xl font-black text-black uppercase">
                  Retail
                </h5>
                <p className="text-sm text-gray-800 font-bold mt-1">Only a registered Retailer can perform this step</p>
              </div>
            </div>
            <form onSubmit={handlerSubmitRetail} className="flex flex-col md:flex-row gap-4 pl-6">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <input
                  className="w-full pl-12 pr-4 py-4 border-2 border-black focus:ring-0 focus:shadow-neo-hover text-lg bg-white shadow-neo-active transition-all placeholder-gray-500 font-bold"
                  type="text"
                  onChange={handlerChangeRetId}
                  placeholder="Enter Battery ID"
                  value={retId}
                  required
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-neo-primary border-2 border-black text-black font-black uppercase hover:bg-neo-accent transition-all shadow-neo-active hover:shadow-neo-hover hover:-translate-y-1 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Retail
              </button>
            </form>
          </div>

          {/* Step 5: Sold */}
          <div className="bg-neo-light border-4 border-black shadow-neo p-8 relative">
            <div className="absolute -left-4 -top-4 w-12 h-12 bg-neo-secondary border-4 border-black flex items-center justify-center text-black font-black text-xl shadow-neo-active z-10">
              5
            </div>
            <div className="flex items-center mb-6 pl-6">
              <div className="w-12 h-12 bg-neo-primary border-2 border-black flex items-center justify-center mr-4 shadow-neo-active">
                <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h5 className="text-xl font-black text-black uppercase">
                  Mark as Sold
                </h5>
                <p className="text-sm text-gray-800 font-bold mt-1">Only a registered Retailer can perform this step</p>
              </div>
            </div>
            <form onSubmit={handlerSubmitSold} className="flex flex-col md:flex-row gap-4 pl-6">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <input
                  className="w-full pl-12 pr-4 py-4 border-2 border-black focus:ring-0 focus:shadow-neo-hover text-lg bg-white shadow-neo-active transition-all placeholder-gray-500 font-bold"
                  type="text"
                  onChange={handlerChangeSoldId}
                  placeholder="Enter Battery ID"
                  value={soldId}
                  required
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-neo-secondary border-2 border-black text-black font-black uppercase hover:bg-neo-primary transition-all shadow-neo-active hover:shadow-neo-hover hover:-translate-y-1 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mark as Sold
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
