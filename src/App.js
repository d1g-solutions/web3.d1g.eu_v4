//20220104
//  - switch/add wallet
//  - add token
//  - incerc sa-l fac functional
//  - ready for deployment via vercel si sau Netlify

//20220115
//  - incarcat in Visual Studio Code ca si V4
//  - Netlify - Auto publishing is on pe V4
//  - Vercel - Auto publishing in on pe V4
// https://csb-8zjcw.netlify.app/
// https://csb-uxj87.vercel.app/
// web3.d1g.eu - cname.vercel-dns.com

//20220106
// eth-crypto - https://ethereum.stackexchange.com/questions/3092/how-to-encrypt-a-message-with-the-public-key-of-an-ethereum-address


import "./styles.css";
import { Box, Button } from "@material-ui/core";
import React, { useState } from "react";
import web3 from "web3";

import Token_ERC20 from "./D1G_OpenZeppelin_ERC20_advanced.json";
import NFT_ERC731 from "./NFT_D1G_OpenZeppelin_ERC721.json";

export const Token_ERC20ContractAddress = "0xf6C034242d0caA628C361A6660CD72c8E419Ac62";
export const NFT_ERC731ContractAddress = "0xb1de7905763d916b464cb8873753bf2fdebc4d50";


//import Tx from "ethereumjs-tx";
var Tx = require("ethereumjs-tx").Transaction;
//const EthCrypto = require('eth-crypto');

const { mnemonic, BSCSCANAPIKEY } = require("./env.json");

export const myAccount = "0x84507eb183b418CE76aA838934BBc4190238A306";

var dstAccount = "none";

function App() {
  const [metamask, setMetamask] = useState("");
  const [account, setAccount] = useState("");
  const [owner, setOwner] = useState("");
  const [token, setToken] = useState("");
  const [tokenid, setTokenid] = useState("");
  const [sendD1Gtrx, setsendD1Gtrx] = useState("");
  const [sendBNBtrx, setsendBNBtrx] = useState("");
  const [sendNFTtrx, setsendNFTtrx] = useState("");

  const { ethereum } = window;

  let w3 = new web3(window.ethereum);




//isMetaMaskInstalled
  const isMetaMaskInstalled = () => {
    //const { ethereum } = window;
    if (Boolean(ethereum && ethereum.isMetaMask)) {
      //alert("metamask installed");
      setMetamask('MetaMask is installed!')
      //w3 = new web3(window.ethereum);
      //window.web3 = w3;
      //console.log(Object.keys(w3.eth));
    } else {
      alert("please install metamask");
    }
    return Boolean(ethereum && ethereum.isMetaMask);
  };

// installChain - install BSC- Testnet
const installChain = async () =>
{
  try {
        /*
      const data = [{
          chainId: '0x38',
          chainName: 'Binance Smart Chain',
          nativeCurrency:
              {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18
              },
          rpcUrls: ['https://bsc-dataseed.binance.org/'],
          blockExplorerUrls: ['https://bscscan.com/'],
      }]
      */
      const data = [
        {
          chainId: "0x61",
          chainName: "BSC - Testnet",
          nativeCurrency: {
            name: "BNB",
            symbol: "BNB",
            decimals: 18
          },
          rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
          blockExplorerUrls: ["https://testnet.bscscan.com/"]
        }
      ];

      const tx = await ethereum
        .request({ method: "wallet_addEthereumChain", params: data })
        .catch();
      if (tx) {
        console.log(tx);
      }
} catch (error) {
      console.error(error);
    }
}

// conect Metamask Wallet
const onClickConnect = async () => {
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!

      await ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await ethereum.request({ method: "eth_accounts" });
      setAccount(accounts[0]);

      console.log(accounts);
    } catch (error) {
      console.error(error);
    }
  };

//add D1G Token to Metamask
const addD1GToken = async () => {
    try {
      const tokenAddress = Token_ERC20ContractAddress;
      const tokenSymbol = "D1G";
      const tokenDecimals = 18;
      const tokenImage =
        "https://ipfs.io/ipfs/QmQq66d95Gcsr4q2FpPUpi2ShU1DDqkng348N7tnq4YuqL";

      try {

        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20", // Initially only supports ERC20, but eventually more!
            options: {
              address: tokenAddress, // The address that the token is at.
              symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
              decimals: tokenDecimals, // The number of decimals in the token
              image: tokenImage // A string url of the token logo
            }
          }
        });

        if (wasAdded) {
          console.log("Thanks for your interest in D1G Tokens!");
        } else {
          console.log("Your loss!");
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error(error);
    }
  };





  const sendBNB = async () => {
    console.log(">>sending BNB");
    try {
      //var count = w3.eth.getTransactionCount(myAccount);
      //console.log(count);
      setsendBNBtrx( "Sending BNB ... (please wait)");
      const sentAmount = 0.05 * 10 ** 18;
      var value = web3.utils.toBN(sentAmount);

      // Determine the nonce
      var count = await w3.eth.getTransactionCount(myAccount);
      console.log(`num transactions so far: ${count}`);      

      // How many tokens do I have before sending?
      //var balance = await w3.eth.getBalance(myAccount).call();
      //console.log(`Balance before send: ${balance}`);

      dstAccount=document.getElementById("dstInput").value;
      console.log("Destination account: ",dstAccount);

      var rawTransaction = {
        "from": myAccount,
        "nonce": "0x" + count.toString(16),
        "gasPrice": web3.utils.toHex(web3.utils.toWei('100', 'gwei')),
        "gasLimit": web3.utils.toHex(100000),
        "to": dstAccount,
        "value": value,
        //"data": contract.methods.transfer(dstAccount, value).encodeABI(),
        "chainId": 0x61
      };
    
      var createTransaction = await w3.eth.accounts.signTransaction(
        {
          // this could be provider.addresses[0] if it exists
          from: myAccount,
          // target address, this could be a smart contract address
          to: dstAccount,
          // optional if you want to specify the gas limit
          //gasPrice: "0x09184e72a000",
          gas: 66906,
          // optional if you are invoking say a payable function
          value: value
          // this encodes the ABI of the method and the arguements
          //data: tD1G.methods.transfer(dstAccount, value).encodeABI()
        },
        "4d37434318ee4fb5960da289b90e5f35aff0419a6d1d693eb2e4aea22cbc2372"
      );

      console.log(createTransaction);
      // Deploy transaction
      const createReceipt = await w3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
      );

      console.log( "Transaction successful with hash: ", createReceipt.transactionHash);
      setsendBNBtrx( "Transaction successful with hash: " + createReceipt.transactionHash);
    } catch (error) {
      console.error(error);
      setsendBNBtrx( "Error!!!");
    }
  };

  const sendD1G= async () => {
    console.log(">>sending D1G");
    try {
      //var count = w3.eth.getTransactionCount(myAccount);
      //console.log(count);
      setsendD1Gtrx( "Sending D1G ... (please wait)");
      const sentAmount = 10 * 10 ** 18;
      var value = web3.utils.toBN(sentAmount);

      // Determine the nonce
      var count = await w3.eth.getTransactionCount(myAccount);
      console.log(`num transactions so far: ${count}`);


      var contract = new w3.eth.Contract(Token_ERC20, Token_ERC20ContractAddress, {from: myAccount});
      console.log("Contract: ",contract);

      // How many tokens do I have before sending?
      var balance = await contract.methods.balanceOf(myAccount).call();
      console.log(`Balance before send: ${balance}`);

      dstAccount=document.getElementById("dstInput").value;
      console.log("Destination account: ",dstAccount);

      //https://ethereum.stackexchange.com/questions/24828/how-to-send-erc20-token-using-web3-api
      // I chose gas price and gas limit based on what ethereum wallet was recommending for a similar transaction. You may need to change the gas price!
      var rawTransaction = {
        "from": myAccount,
        "nonce": "0x" + count.toString(16),
        "gasPrice": web3.utils.toHex(web3.utils.toWei('100', 'gwei')),
        "gasLimit": web3.utils.toHex(100000),
        "to": Token_ERC20ContractAddress,
        "value": "0x0",
        "data": contract.methods.transfer(dstAccount, value).encodeABI(),
        "chainId": 0x61
      };
    
      var createTransaction = await w3.eth.accounts.signTransaction(rawTransaction,
        "4d37434318ee4fb5960da289b90e5f35aff0419a6d1d693eb2e4aea22cbc2372"
      );

      console.log(createTransaction);
      // Deploy transaction
      const createReceipt = await w3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
      );

      console.log( "Transaction successful with hash: ", createReceipt.transactionHash);
      setsendD1Gtrx( "Transaction successful with hash: " + createReceipt.transactionHash);
    } catch (error) {
      console.error(error);
      setsendD1Gtrx( "Error!!!");
    }
  };

  const sendMeAnNFT_1 = () => {

    dstAccount=document.getElementById("dstInput").value;
    console.log("Destination account: ",dstAccount);

    //trimit tokens
    try {
      const sentAmount = 10 * 10 ** 18;
      var value = web3.utils.toBN(sentAmount);
      var count = w3.eth.getTransactionCount(Token_ERC20ContractAddress);
      let contract = new w3.eth.Contract(
        Token_ERC20,
        Token_ERC20ContractAddress
      );
      let data1 = contract.methods
        .transfer(dstAccount, value)
        .send({ from: myAccount })
        .then(console.log);
    } catch (error) {
      console.error(error);
    }

    //throw new Error("my error message");

    //trimit NFT
    try {
      let nft = new w3.eth.Contract(NFT_ERC731, NFT_ERC731ContractAddress);
      console.log(nft);
      setToken("token");
      var v = nft.methods
        .owner()
        .call()
        .then((v) => setOwner(v));
      v = nft.methods
        .name()
        .call()
        .then((v) => setToken(v));
      //var accto = "0x3beb7d0c0f6e524f34d6f2f24174780434414813";
      const data = nft.methods
        .safeMint(
          dstAccount,
          "https://ipfs.io/ipfs/QmQq66d95Gcsr4q2FpPUpi2ShU1DDqkng348N7tnq4YuqL"
        )
        .send({ from: myAccount })
        .then(console.log);

      //await provider.waitForTransaction(data.hash);
      nft.waitForTransaction(data.hash).send().then(console.log);
      // const receipt = w3.eth.provider.getTransactionReceipt(data.hash)
      //  .then(console.log);
      //console.log(Web3.utils.hexToNumber(receipt.logs[0].topics[3]));
      //console.log(owner);
      //setOwner('name');
      //alert(owner);
      /*
    w3.eth
      .sendTransaction({
        // this could be provider.addresses[0] if it exists
        from: account,
        to: "0x410B407B85452fBB24950c8aEa2e923de3F1cB18",
        value: "100000000000000000",
        gasPrice: "0x09184e72a000",
        gas: "0x2710"
      })
      .then(console.log)
      .catch((error) => console.log("error", error));
      */
    } catch (error) {
      console.error(error);
    }
  };

  const sendNFT= async () => {
    console.log(">>sending NFT");
    try {
      //var count = w3.eth.getTransactionCount(myAccount);
      //console.log(count);
      setsendNFTtrx( "Minting&Sending an NFT ... (please wait)");

      //const sentAmount = 10 * 10 ** 18;
      //var value = web3.utils.toBN(sentAmount);

      var tokenUri="https://ipfs.io/ipfs/QmQq66d95Gcsr4q2FpPUpi2ShU1DDqkng348N7tnq4YuqL";

      // Determine the nonce
      var count = await w3.eth.getTransactionCount(myAccount);
      console.log(`num transactions so far: ${count}`);


      var contract = new w3.eth.Contract(NFT_ERC731, NFT_ERC731ContractAddress, {from: myAccount});
      console.log("Contract: ",contract);
  
      var v = contract.methods
        .name()
        .call()
        .then((v) => setToken(v));

        setOwner(NFT_ERC731ContractAddress);
        
      // How many tokens do I have before sending?
      var balance = await contract.methods.balanceOf(NFT_ERC731ContractAddress).call();
      console.log("Balance before send: ",balance);

      dstAccount=document.getElementById("dstInput").value;
      console.log("Destination account: ",dstAccount);

      //https://ethereum.stackexchange.com/questions/24828/how-to-send-erc20-token-using-web3-api
      // I chose gas price and gas limit based on what ethereum wallet was recommending for a similar transaction. You may need to change the gas price!
      var rawTransaction = {
        "from": myAccount,
        "nonce": "0x" + count.toString(16),
        "gasPrice": web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
        "gasLimit": web3.utils.toHex(250000),
        "to": NFT_ERC731ContractAddress,
        "value": "0x0",
        "data": contract.methods.safeMint(dstAccount, tokenUri).encodeABI(),
        "chainId": 0x61
      };
    
      var createTransaction = await w3.eth.accounts.signTransaction(rawTransaction,
        "4d37434318ee4fb5960da289b90e5f35aff0419a6d1d693eb2e4aea22cbc2372"
      );

      console.log(createTransaction);
      // Deploy transaction
      const createReceipt = await w3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
      );

      console.log( "Transaction successful with hash: ", createReceipt.transactionHash);
      setsendNFTtrx( "Transaction successful with hash: " + createReceipt.transactionHash);

      //TokenId
      setTokenid(web3.utils.hexToNumber(createReceipt.logs[0].topics[3])+' '+tokenUri);
     

    } catch (error) {
      console.error(error);
      setsendNFTtrx( "Error!!!");
    }
  };

  return (
 
      <div className="App">
      <div id="container">
        <div id="info" onClick={onClickConnect}>
          Info
        </div>
        <div id="content">
          <h3>Clip-path title</h3>
          <p>Content of the clip-path information</p>
        </div>
      </div>
      <h1>web3.D1G.eu</h1>
      <Box my={5}>
        <p>click on this to check your metamask extension</p>
        <Button variant="contained" onClick={isMetaMaskInstalled}>
          Check metamask
        </Button>
        {metamask && (
          <p>{metamask}</p>
        )}
      </Box>
      {metamask && (
      <Box my={5}>
        <p>click on this to install/switch to BSC - Testnet</p>
        <Button variant="contained" onClick={installChain}>
          Install/Switch to BSC - Testnet
        </Button>
      </Box>
      )}
      {metamask && (
      <Box mt={5}>
        <p>click on this to get wallet address</p>
        <Button variant="contained" color="secondary" onClick={onClickConnect}>
          Connect Metamask Wallet
        </Button>
        {account && (
          <p>account address : {account}</p>
        )}
      </Box>
      )}

    {metamask && (
      <Box my={5}>
        <p>click on this to add D1G Token to your Metamask - Testnet</p>
        <Button variant="contained" onClick={addD1GToken}>
          Add D1G Token
        </Button>
      </Box>
      )}

      <Box my={5}>
        <p>Enter you address to receive some assets</p>
        <p>
          <input
            type="text"
            id="dstInput"
            name="dstInput"
            defaultValue={account}
          />
        </p>

        <Box mt={4}>
        <Button variant="contained" color="primary" onClick={sendBNB}>
          Send 0.05 BNB
        </Button>
        {sendBNBtrx && (
          <p>{sendBNBtrx}</p>
        )}
        </Box>
 
        <Box mt={4}>
        <Button variant="contained" color="primary" onClick={sendD1G}>
          Send 10 D1G
        </Button>
        {sendD1Gtrx && (
          <p>{sendD1Gtrx}</p>
        )}
        </Box>
        
        <Box mt={4}>
        <Button variant="contained" color="primary" onClick={sendNFT}>
          Mint&Send an NFT
        </Button>
        {sendNFTtrx && (
          <p>{sendNFTtrx}</p>
        )}
        {owner && (
          <Box>
            <p>Token: {token}</p>
            <p>Contract: {owner}</p>
            <p>Token ID: {tokenid}</p>
          </Box>
        )}
        </Box>
      </Box>

      <Box>
      <p><a href="https://testnet.bscscan.com/address/0x84507eb183b418CE76aA838934BBc4190238A306" target="_blank">BSC - Testnet Explorer</a></p>
      </Box>

    </div>
  );
}

export default App;
