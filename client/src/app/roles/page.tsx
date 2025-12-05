'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadWeb3, getContract } from '@/lib/web3'
import { checkIsOwner, getContractOwner } from '@/lib/contractUtils'

interface Role {
  addr: string
  id: string
  name: string
  place: string
}

export default function AssignRoles() {
  const router = useRouter()
  const [currentAccount, setCurrentAccount] = useState('')
  const [loading, setLoading] = useState(true)
  const [supplyChain, setSupplyChain] = useState<any>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [contractOwner, setContractOwner] = useState<string>('')
  const [roles, setRoles] = useState<{
    rms: Role[]
    man: Role[]
    dis: Role[]
    ret: Role[]
  }>({
    rms: [],
    man: [],
    dis: [],
    ret: [],
  })

  const [newRole, setNewRole] = useState({
    address: '',
    name: '',
    place: '',
    type: 'rms',
  })

  useEffect(() => {
    loadWeb3()
    loadBlockchainData()
  }, [])

  const loadBlockchainData = async () => {
    try {
      setLoading(true)
      const { contract, account } = await getContract()
      setSupplyChain(contract)
      setCurrentAccount(account)

      const rmsCount = await contract.methods.rmsCtr().call()
      const manCount = await contract.methods.manCtr().call()
      const disCount = await contract.methods.disCtr().call()
      const retCount = await contract.methods.retCtr().call()

      const rms = await Promise.all(
        Array(parseInt(rmsCount))
          .fill(null)
          .map((_, i) => contract.methods.RMS(i + 1).call())
      )
      const man = await Promise.all(
        Array(parseInt(manCount))
          .fill(null)
          .map((_, i) => contract.methods.MAN(i + 1).call())
      )
      const dis = await Promise.all(
        Array(parseInt(disCount))
          .fill(null)
          .map((_, i) => contract.methods.DIS(i + 1).call())
      )
      const ret = await Promise.all(
        Array(parseInt(retCount))
          .fill(null)
          .map((_, i) => contract.methods.RET(i + 1).call())
      )

      setRoles({ rms, man, dis, ret })

      // Check if current account is the owner
      const ownerStatus = await checkIsOwner()
      setIsOwner(ownerStatus)
      const owner = await getContractOwner()
      if (owner) setContractOwner(owner)

      setLoading(false)
    } catch (err: any) {
      const errorMessage = err?.message || 'The smart contract is not deployed to the current network'
      console.error('Error loading blockchain data:', err)
      alert(errorMessage)
      setLoading(false)
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setNewRole((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleRoleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const { address, name, place, type } = newRole
    try {
      let receipt
      switch (type) {
        case 'rms':
          receipt = await supplyChain.methods.addRMS(address, name, place).send({ from: currentAccount })
          break
        case 'man':
          receipt = await supplyChain.methods.addManufacturer(address, name, place).send({ from: currentAccount })
          break
        case 'dis':
          receipt = await supplyChain.methods.addDistributor(address, name, place).send({ from: currentAccount })
          break
        case 'ret':
          receipt = await supplyChain.methods.addRetailer(address, name, place).send({ from: currentAccount })
          break
        default:
          alert('Invalid role type selected')
          return
      }
      if (receipt) {
        alert('Role registered successfully!')
        loadBlockchainData()
        setNewRole({ address: '', name: '', place: '', type: 'rms' })
      }
    } catch (err: any) {
      let errorMessage = 'An error occurred!'
      if (err?.message) {
        errorMessage = err.message
      } else if (err?.error?.message) {
        errorMessage = err.error.message
      } else if (typeof err === 'string') {
        errorMessage = err
      }

      // Check for common revert reasons
      if (errorMessage.includes('revert') || errorMessage.includes('require')) {
        if (errorMessage.includes('Owner')) {
          errorMessage = 'Only the contract owner can add roles. Make sure you are using the account that deployed the contract.'
        } else {
          errorMessage = `Transaction failed: ${errorMessage}`
        }
      }

      console.error('Transaction error:', err)
      alert(errorMessage)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neo-bg">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-4 border-black border-t-transparent mx-auto mb-4 rounded-full"></div>
          <h1 className="text-2xl font-black text-black uppercase">Loading...</h1>
        </div>
      </div>
    )
  }

  const roleConfig = {
    rms: {
      label: 'Raw Material Supplier',
      plural: 'Raw Material Suppliers',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      bgColor: 'bg-neo-primary',
      borderColor: 'border-black',
    },
    man: {
      label: 'Manufacturer',
      plural: 'Manufacturers',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      bgColor: 'bg-neo-secondary',
      borderColor: 'border-black',
    },
    dis: {
      label: 'Distributor',
      plural: 'Distributors',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      bgColor: 'bg-neo-accent',
      borderColor: 'border-black',
    },
    ret: {
      label: 'Retailer',
      plural: 'Retailers',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      bgColor: 'bg-[#FF9F1C]',
      borderColor: 'border-black',
    },
  }

  return (
    <div className="min-h-screen bg-neo-bg p-5 font-mono text-neo-dark">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white border-4 border-black shadow-neo p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-neo-primary border-4 border-black flex items-center justify-center shadow-neo-active">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-black text-black uppercase">Register Roles</h1>
                <p className="text-gray-800 font-bold text-sm">Assign roles to participants in the supply chain</p>
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
            Account: {currentAccount}
          </div>
        </div>

        {/* Owner Warning */}
        {!isOwner && (
          <div className="bg-neo-primary border-4 border-black shadow-neo p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white border-2 border-black p-1">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-xl font-black text-black uppercase mb-2">Owner Access Required</h3>
                <p className="text-black font-bold text-sm mb-4">
                  Only the contract owner can register new roles in the supply chain.
                </p>
                <div className="space-y-2 text-xs font-mono bg-white border-2 border-black p-3 shadow-neo-active">
                  <div className="flex items-center text-black">
                    <span className="font-bold mr-2">Contract Owner:</span> {contractOwner || 'Loading...'}
                  </div>
                  <div className="flex items-center text-black">
                    <span className="font-bold mr-2">Your Account:</span> {currentAccount}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <div className={`bg-white border-4 border-black shadow-neo p-8 mb-8 relative overflow-hidden`}>
          <div className={`absolute top-0 left-0 w-full h-2 ${roleConfig[newRole.type as keyof typeof roleConfig].bgColor} border-b-2 border-black`}></div>
          <div className="flex items-center mb-6">
            <div className={`w-12 h-12 ${roleConfig[newRole.type as keyof typeof roleConfig].bgColor} border-2 border-black flex items-center justify-center mr-4 shadow-neo-active text-black`}>
              {roleConfig[newRole.type as keyof typeof roleConfig].icon}
            </div>
            <div>
              <h2 className="text-2xl font-black text-black uppercase">Register New Role</h2>
              <p className="text-gray-800 font-bold text-sm">Add a new participant to the supply chain</p>
            </div>
          </div>

          <form onSubmit={handleRoleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-black text-black uppercase mb-2">
                Role Type
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 border-2 border-black focus:ring-0 focus:shadow-neo-hover text-lg bg-white appearance-none cursor-pointer shadow-neo-active transition-all"
                  name="type"
                  onChange={handleInputChange}
                  value={newRole.type}
                  required
                >
                  <option value="rms">Raw Material Supplier</option>
                  <option value="man">Manufacturer</option>
                  <option value="dis">Distributor</option>
                  <option value="ret">Retailer</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-black uppercase mb-2">
                Ethereum Address
              </label>
              <input
                className="w-full px-4 py-3 border-2 border-black focus:ring-0 focus:shadow-neo-hover text-lg bg-white font-mono text-sm shadow-neo-active transition-all placeholder-gray-500"
                type="text"
                name="address"
                placeholder="0x..."
                onChange={handleInputChange}
                value={newRole.address}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-black text-black uppercase mb-2">
                Name
              </label>
              <input
                className="w-full px-4 py-3 border-2 border-black focus:ring-0 focus:shadow-neo-hover text-lg bg-white shadow-neo-active transition-all placeholder-gray-500"
                type="text"
                name="name"
                placeholder="Enter participant name"
                onChange={handleInputChange}
                value={newRole.name}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-black text-black uppercase mb-2">
                Location
              </label>
              <input
                className="w-full px-4 py-3 border-2 border-black focus:ring-0 focus:shadow-neo-hover text-lg bg-white shadow-neo-active transition-all placeholder-gray-500"
                type="text"
                name="place"
                placeholder="Enter location (e.g., City, Country)"
                onChange={handleInputChange}
                value={newRole.place}
                required
              />
            </div>

            <button
              type="submit"
              disabled={!isOwner}
              className={`w-full px-6 py-4 border-2 border-black font-black uppercase transition-all shadow-neo-active hover:shadow-neo-hover transform ${isOwner
                  ? `${roleConfig[newRole.type as keyof typeof roleConfig].bgColor} text-black hover:-translate-y-1 cursor-pointer`
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                } flex items-center justify-center`}
            >
              {isOwner ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Register {roleConfig[newRole.type as keyof typeof roleConfig].label}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Only Owner Can Register
                </>
              )}
            </button>
          </form>
        </div>

        {/* Registered Roles */}
        <div className="space-y-8">
          <h2 className="text-3xl font-black text-black uppercase flex items-center border-b-4 border-black pb-4">
            <svg className="w-8 h-8 mr-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Registered Roles
          </h2>

          {(['rms', 'man', 'dis', 'ret'] as const).map((roleType) => {
            const config = roleConfig[roleType]
            const roleList = roles[roleType]
            const totalCount = roleList.length

            return (
              <div key={roleType} className="bg-white border-4 border-black shadow-neo p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${config.bgColor} border-2 border-black flex items-center justify-center text-black shadow-neo-active`}>
                      {config.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-black uppercase">{config.plural}</h3>
                      <p className="text-sm font-bold text-gray-600">{totalCount} registered</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 ${config.bgColor} border-2 border-black shadow-neo-active`}>
                    <span className="text-lg font-black text-black">{totalCount}</span>
                  </div>
                </div>

                {totalCount === 0 ? (
                  <div className="text-center py-12 bg-neo-light border-2 border-black border-dashed">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p className="text-gray-600 font-bold text-lg uppercase">No {config.plural.toLowerCase()} registered yet</p>
                    <p className="text-gray-500 font-bold text-sm mt-2">Register the first {config.label.toLowerCase()} using the form above</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-2 border-black">
                      <thead>
                        <tr className={`${config.bgColor} border-b-2 border-black`}>
                          <th className="px-6 py-4 text-left text-sm font-black text-black uppercase border-r-2 border-black">ID</th>
                          <th className="px-6 py-4 text-left text-sm font-black text-black uppercase border-r-2 border-black">Name</th>
                          <th className="px-6 py-4 text-left text-sm font-black text-black uppercase border-r-2 border-black">Location</th>
                          <th className="px-6 py-4 text-left text-sm font-black text-black uppercase">Ethereum Address</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-2 divide-black">
                        {roleList.map((role, index) => (
                          <tr key={index} className="hover:bg-neo-light transition-colors">
                            <td className="px-6 py-4 border-r-2 border-black">
                              <div className="flex items-center">
                                <div className={`w-8 h-8 ${config.bgColor} border-2 border-black flex items-center justify-center text-black font-bold mr-3 shadow-neo-active text-xs`}>
                                  {role.id}
                                </div>
                                <span className="font-bold text-black">{role.id}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-bold text-black border-r-2 border-black">{role.name}</td>
                            <td className="px-6 py-4 text-gray-800 font-medium border-r-2 border-black">
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {role.place}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center font-mono text-xs text-black bg-white border-2 border-black px-3 py-2 shadow-neo-active">
                                <svg className="w-4 h-4 mr-2 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15l1.5 1.5M17 15l-1.5 1.5M9 5h6m-6 0v2m0-2a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2m-6 0V3m0 2v2" />
                                </svg>
                                {role.addr}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
