import React, { useEffect, useState } from 'react'
import { injected } from '../constants/WalletConnectors'
import { useWeb3React } from '@web3-react/core'

import Loading from '../components/Loading'

const MetamaskProvider = ({ children }) => {
    const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React()

    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        injected
            .isAuthorized()
            .then((isAuthorized) => {
                setLoaded(true)
                if (isAuthorized && !networkActive && !networkError) {
                    activateNetwork(injected)
                }
            })
            .catch(() => {
                setLoaded(true)
            })
    }, [activateNetwork, networkActive, networkError])

    if (loaded) {
        return children
    }

    return <React.Fragment><Loading /></React.Fragment>
}

export default MetamaskProvider