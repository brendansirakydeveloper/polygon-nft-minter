import { useEffect, useState } from 'react'

import { convertFromHexDecimal } from '../utility/helpers'
import { checkIsCorrectChain } from '../utility/checkIsCorrectChain'

export const useMetamask = () => {
    const [selectedAccount, setSelectedAccount] = useState(null)
    const [accountBalance, setAccountBalance] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('connect', connectWallet)
            window.ethereum.on('accountsChanged', () => window.location.reload())
            window.ethereum.on('chainChanged', () => window.location.reload())
            window.ethereum.on('disconnect', disconnectWallet)
        }
    }, [])

    const connectWallet = async () => {
        try {
            if (!window.ethereum) throw new Error("No crypto wallet found")
            setLoading(true)
            const chainId = await window.ethereum.request({ method: 'eth_chainId' })
            if (!checkIsCorrectChain(chainId)) throw new Error('Wrong Network')
            window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(response => {
                    accountChangedHandler(response[0])
                    setLoading(false)
                })
        } catch (error) {
            setError(error.message)
            setLoading(false)
        }
    }

    const disconnectWallet = () => {
        setSelectedAccount(null)
        setAccountBalance(null)
    }

    const accountChangedHandler = (newAccount) => {
        setSelectedAccount(newAccount)
        setBalance(newAccount)
    }


    const setBalance = (address) => {
        window.ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] })
            .then(response => {
                setAccountBalance(convertFromHexDecimal(response))
            })
    }

    return [
        connectWallet,
        disconnectWallet,
        selectedAccount,
        accountBalance,
        error,
        loading
    ]
}