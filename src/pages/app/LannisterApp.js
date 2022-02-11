import React, { useEffect, useState } from 'react'
import './lannister_app.css'

import { useAlert } from 'react-alert'
import { Navbar, NavbarBrand } from 'react-bootstrap'
import { FaWallet, FaDollarSign, FaCheckCircle, FaCoins, FaCartArrowDown, FaDiscord, FaLayerGroup, FaFantasyFlightGames, FaAlignJustify, FaDatabase, FaBinoculars } from 'react-icons/fa'

import Footer from '../../components/Footer'
import NodeItem from '../../components/NodeItem';

import { BigNumber } from "@ethersproject/bignumber";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../../constants/WalletConnectors";
import { lannistAddress, nodeRewardManagementAddress } from '../../constants/Addresses';

import LANNISTERABI from '../../constants/ABI/LANNISTER.json';
import NODEABI from '../../constants/ABI/nodeRewardManagement.json';

const LannisterApp = () => {
  const [tokenBalance, setBalance] = useState(0);
  const [approvedBalance, setApproveBalance] = useState(0);
  const [tokenContract, setTokenContract] = useState(undefined);
  const [totalNodes, setTotalNodeNumber] = useState(0);
  const [newName, setNewName] = useState("");
  const [userNodes, setUserNode] = useState(0);
  const [totalRewards, setTotalReward] = useState(0);
  const [nodeContract, setNodeContract] = useState(undefined);
  const [nodeNames, setNodeName] = useState([]);
  const [nodeReward, setNodeReward] = useState([]);

  const { active, account, library, connector, activate, deactivate, chainId } = useWeb3React();

  const alert = useAlert();

  const owner = '0x590d80Bf325030157E5BDaDF57F08768270c8efB';
  const divisor = 1000000000000000000;

  const MaxUint256: BigNumber = (/*#__PURE__*/BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"));

  useEffect(() => {
    if (library !== undefined) {
      const _tokenContract = new library.eth.Contract(LANNISTERABI, lannistAddress);
      setTokenContract(_tokenContract);
      const _nodeContract = new library.eth.Contract(NODEABI, nodeRewardManagementAddress);
      setNodeContract(_nodeContract);
    } else {
      setTokenContract(undefined);
    }
  }, [library])

  useEffect(() => {
    if (tokenContract === undefined || account === undefined) return;

    tokenContract.methods.balanceOf(account).call().then((res) => {
      setBalance(res);
    });

    tokenContract.methods.allowance(account, lannistAddress).call().then((res) => {
      setApproveBalance(res);
    });

    tokenContract.methods.getNodeNumberOf(account).call().then((res) => {
      setUserNode(res);

      if (res != 0) {
        tokenContract.methods.getRewardAmountOf(account).call().then((res) => {
          setTotalReward(res);
        })
      } else {
        setTotalReward(0);
      }
    });

    const ID = setInterval(() => {
      tokenContract.methods.balanceOf(account).call().then((res) => {
        setBalance(res);
      });

      tokenContract.methods.allowance(account, lannistAddress).call().then((res) => {
        setApproveBalance(res);
      });

      tokenContract.methods.getNodeNumberOf(account).call().then((res) => {
        setUserNode(res);
        if (res != 0) {
          tokenContract.methods.getRewardAmountOf(account).call().then((res) => {
            setTotalReward(res);
          })
        } else {
          setTotalReward(0);
        }
      });
    }, 3000);

    return () => clearInterval(ID);
  }, [tokenContract, account]);

  useEffect(() => {
    if (tokenContract === undefined) return;

    tokenContract.methods.getTotalCreatedNodes().call().then((res) => {
      setTotalNodeNumber(res);
    })

    const ID = setInterval(() => {
      tokenContract.methods.getTotalCreatedNodes().call().then((res) => {
        setTotalNodeNumber(res);
      })
    }, 3000);

    return () => clearInterval(ID);
  }, [tokenContract])

  useEffect(() => {
    if (account === undefined || nodeContract === undefined || userNodes == 0) {
      setNodeName([]);
      setNodeReward([]);
      return;
    }

    nodeContract.methods._getNodesNames(account).call().then((res) => {
      setNodeName(res.split("#"));
    })

    nodeContract.methods._getNodesRewardAvailable(account).call().then((res) => {
      setNodeReward(res.split("#"))
    });

    const ID = setInterval(() => {
      nodeContract.methods._getNodesNames(account).call().then((res) => {
        setNodeName(res.split("#"));
      });

      nodeContract.methods._getNodesRewardAvailable(account).call().then((res) => {
        setNodeReward(res.split("#"))
      });
    }, 3000);

    return () => clearInterval(ID);
  }, [account, nodeContract, userNodes])

  async function connectMetaMask () {
    if (window.ethereum === undefined) {
      alert.show("Please install Metamask on your browser.");
      return;
    }

    const res = window.ethereum.networkVersion;

    if (res != 56) {
      alert.show("Please switch to BSC network.");
      return;
    }

    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnectMetaMask () {
    try {
      deactivate()
    } catch (ex) {
      console.log(ex)
    }
  }

  async function approve () {
    tokenContract.methods.approve(lannistAddress, MaxUint256).send({ from: account }).then((res) => {
      setApproveBalance(10000000000);
    })
  }

  async function createNode () {
    const len = newName.length;

    if (len <= 3 || len >= 32) {
      alert.show("Node name should be greater than 4 and smaller than 32");
      return;
    }

    for (let i = 0; i < nodeNames.length; i++) {
      if (newName === nodeNames[i]) {
        alert.show("Node with same name is already exist");
        return;
      }
    }

    tokenContract.methods.createNodeWithTokens(newName).send({ from: account }).then(() => {
      alert.show("new Node " + newName + " was created!");
    });
  }

  async function claimRewardsAll () {
    tokenContract.methods.cashoutAll().send({ from: account }).then(() => {
      alert.show("Rewards are claimed");
    });
  }

  return (
    <div className='container app-container'>
      <Navbar expand="md">
        <div className='container d-flex justify-content-between align-items-baseline'>
          <NavbarBrand href="/">
            <img src="logo512.png" alt="text-logo" className='app-logo' />
          </NavbarBrand>

          <div className='text-end'>
            <Navbar.Toggle aria-controls="basic-navbar-nav" id="navbar-toggle-btn">
              <FaAlignJustify />
            </Navbar.Toggle>
            <Navbar.Collapse id="basic-navbar-nav">
              <a type='button' href={`https://bscscan.com/address/${lannistAddress}#code`} className='btn lnst-red-btn d-flex justify-content-center align-items-center me-4 mt-3' target="_blank">
                <FaBinoculars />
                <span className='ms-2'>LNIST</span>
              </a>
              {
                (account === undefined) ? (
                  <button type='button' className='btn lnst-brown-btn d-flex justify-content-center align-items-center mt-3' onClick={connectMetaMask}>
                    <FaWallet />
                    <span className='ms-2'>Connect Wallet</span>
                  </button>
                ) : (
                  <button type='button' className='btn lnst-brown-btn d-flex justify-content-center align-items-center mt-3'>
                    <FaWallet />
                    <span className='ms-2'>{account.substr(0, 7)}...{account.slice(-4)}</span>
                  </button>
                )
              }
            </Navbar.Collapse>
          </div>
        </div>
      </Navbar>

      <div className="container mt-5">
        <div className="row">

          <div className="col-lg-6">
            <div className="info-card d-flex align-items-center">
              <FaCheckCircle />
              <span className='ms-2'>Ensure you are at <span className='primary-green fw-bold'>https://lannister.financial</span></span>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="info-card d-flex align-items-center">
              <FaCoins />
              <span className='ms-2'>Current rewards: <span className='primary-red fw-bold'>0.7 LNIST</span> per node, per day</span>
            </div>
          </div>

        </div>
      </div>

      <div className="container mt-4">
        <div className="row">

          <div className="col-lg-9">
            <p className='fs-4'>Welcome to Lannister Nodes</p>
            <p className='text-muted'>From this panel, you can view, manage, and launch Lannister-nodes. You can also see how many rewards have been allocated, and claim them here. Then if you want, you can use them to create more Lannister-nodes, up to a maximum of 100 per wallet.</p>
          </div>

          <div className="col-lg-3 d-flex justify-content-center align-items-center">
            <div>
              <a type='button' className='btn btn-secondary btn-p-sm focus-no-shadow d-flex justify-content-center align-items-center mb-3' style={{ width: '100%' }} href={`https://pancakeswap.finance/swap?outputCurrency=${lannistAddress}`} target="_blank">
                <FaCartArrowDown />
                <span className='ms-2'>Buy $LNIST</span>
              </a>
              <a type='button' href="https://discord.gg/kyQgxgrzD9" target="_blank" className='btn btn-secondary btn-p-sm focus-no-shadow d-flex justify-content-center align-items-center' style={{ width: '100%' }}>
                <FaDiscord />
                <span className='ms-2'>Discord</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      <div className="container mt-4">
        <div className="row">

          <div className="col-lg-4">
            <div className="chain-card">

              <div className="d-flex align-items-center">
                <FaLayerGroup className='primary-green fs-4' />
                <div className="d-flex justify-content-center align-items-center ms-4">
                  <div>
                    <p className='fs-5 m-0 fw-bold'>{userNodes} / 100</p>
                    <p className='m-0 primary-green'>Owned Nodes</p>
                  </div>
                </div>
              </div>

              {/* <button type='button' className='btn btn-sm btn-owned-nodes focus-no-shadow'>Synch Nodes</button> */}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="chain-card">

              <div className="d-flex align-items-center">
                <FaFantasyFlightGames className='primary-almond fs-4' />
                <div className="d-flex justify-content-center align-items-center ms-4">
                  <div>
                    <p className='fs-5 m-0 fw-bold'>{totalNodes}</p>
                    <p className='m-0 primary-almond'>Total Nodes</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="col-lg-4">
            <div className="chain-card">

              <div className="d-flex align-items-center">
                <FaDollarSign className='primary-red fs-4' />
                <div className="d-flex justify-content-center align-items-center ms-4">
                  <div>
                    <p className='fs-5 m-0 fw-bold'>{(parseFloat(totalRewards) / 1000000000000000000).toFixed(3)} LNIST</p>
                    <p className='m-0 primary-red'>My Rewards</p>
                  </div>
                </div>
              </div>
              {(account === undefined || totalRewards == 0) ? (
                <button type='button' className='btn btn-sm btn-claim-reward focus-no-shadow' disabled={true}>Claim Rewards</button>
              ) : (
                <button type='button' className='btn btn-sm btn-claim-reward focus-no-shadow' onClick={claimRewardsAll}>Claim Rewards</button>
              )}
            </div>
          </div>

        </div>
      </div>

      <div className="container mt-5 mb-5">
        <div className="create-node-card">
          <div className='container'>
            <p className='text-center mb-0 text-wrap'>Create a LNIST-Node with 10 <span className='primary-red fw-bold'>$LNIST</span> to earn lifetime high-yield <span className='primary-red fw-bold'>$LNIST</span> token rewards</p>
            <p className='text-center'>Currently estimated rewards at <span className='primary-red fw-bold'>0.7 $LNIST</span> per 1 LNIST-Node per day</p>

            <div className="row mt-5">

              <div className="col-lg-4">
                <div className='d-flex justify-content-center align-items-center'>
                  <div>
                    <p className='text-center mb-2 primary-red fw-bold fs-5'>{
                      (parseFloat(tokenBalance) / 1000000000000000000).toFixed(2)
                    }</p>
                    <p className='text-muted text-center'>LNIST Balance</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className='d-flex justify-content-center align-items-center'>
                  <div>
                    {(account === undefined) ? (
                      <p className='text-center mb-2 primary-almond fw-bold fs-5'>...</p>
                    ) : (
                      <p className='text-center mb-2 primary-almond fw-bold fs-5'>{account.substring(0, 17)}...</p>
                    )}
                    <p className='text-muted text-center'>Connected Wallet</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className='d-flex justify-content-center align-items-center'>
                  <div>
                    <div className='mb-2'>
                      <div className='d-flex justify-content-center'>
                        {(account === undefined || approvedBalance !== '0') ? (
                          <button type='button' className='btn lnst-green-btn focus-no-shadow d-flex justify-content-center align-items-center btn-p-sm' disabled={true}>
                            <span>Approved</span>
                          </button>
                        ) : (
                          <button type='button' className='btn lnst-green-btn focus-no-shadow d-flex justify-content-center align-items-center btn-p-sm' onClick={approve}>
                            <span>Approve</span>
                          </button>
                        )}

                      </div>
                    </div>
                    <p className='text-muted text-center'>Approve $LNIST once</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap justify-content-center align-items-center mt-4">
              <input type="text" className='node-name mx-2 my-2' placeholder='Node Name' value={newName} onChange={(e) => {
                setNewName(e.target.value);
              }} />
              {(account === undefined || approvedBalance == "0" || userNodes >= 100) ? (
                <button type='button' className='btn lnst-green-btn focus-no-shadow d-flex justify-content-center align-items-center btn-p-sm mx-2 my-2' disabled={true}>
                  <span>Create a Node</span>
                </button>
              ) : (
                <button type='button' className='btn lnst-green-btn focus-no-shadow d-flex justify-content-center align-items-center btn-p-sm mx-2 my-2' onClick={createNode}>
                  <span>Create a Node</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      <div className="container">
        <div className="mynode-list">

          <div className='row list-header'>
            <div className="d-flex justify-content-between">
              <span className='primary-almond fw-bold fs-5'>MyNodes</span>
              <span className='primary-red fw-bold fs-5'>Rewards</span>
            </div>
          </div>

          <div className="container list-body mt-2">
            {(nodeNames.length > 0) ? (
              <>
                {
                  nodeNames.map((name, index) => {
                    return <NodeItem key={index} node_name={name} rewards={`${(parseFloat(nodeReward[index]) / divisor).toFixed(2)} LNIST`} />
                  })

                }
              </>
            ) : (
              <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                <div className='text-center'>
                  <FaDatabase className='display-2' />
                  <p className='mt-3 mb-0'>No Data</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}

export default LannisterApp;