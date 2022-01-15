//20220104
//  - switch/add wallet
//  - add token
//  - incerc sa-l fac functional
//  - ready for deployment via vercel si sau Netlify
//20220115
//  - incarcat in Visual Studio Code 
//  - Netlify - Auto publishing is on
import "./styles.css";
import { Box, Button } from "@material-ui/core";
import React, { useState } from "react";
import web3 from "web3";

import NFT_ERC731 from "./NFT_D1G_OpenZeppelin_ERC721.json";
import Token_ERC20 from "./D1G_OpenZeppelin_ERC20_advanced.json";

//import Tx from "ethereumjs-tx";
var Tx = require("ethereumjs-tx").Transaction;
//const EthCrypto = require('eth-crypto');

const { mnemonic, BSCSCANAPIKEY } = require("./env.json");

//const tokenAddress = "0xb1de7905763d916b464cb8873753bf2fdebc4d50";
export const NFT_ERC731ContractAddress =
  "0xb1de7905763d916b464cb8873753bf2fdebc4d50";

export const Token_ERC20ContractAddress =
  "0xf6C034242d0caA628C361A6660CD72c8E419Ac62";

export const myAccount = "0x84507eb183b418CE76aA838934BBc4190238A306";

export const dstAccount = "0x3beb7d0c0f6e524f34d6f2f24174780434414813";

function App() {
  const [account, setAccount] = useState("");
  const [owner, setOwner] = useState("");
  const [token, setToken] = useState("");
  const [tokenid, setTokenid] = useState("");

  

  let w3 = new web3(window.ethereum);
  const { ethereum } = window;

  let nft;
  

  //Created check function to see if the MetaMask extension is installed
  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    if (Boolean(ethereum && ethereum.isMetaMask)) {
      alert("metamask installed");
      w3 = new web3(window.ethereum);
      window.web3 = w3;
      console.log(Object.keys(w3.eth));
    } else {
      alert("please install metamask");
    }
    return Boolean(ethereum && ethereum.isMetaMask);
  };

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

  const getBalance = async () => {
    try {
      const tokenAddress = Token_ERC20ContractAddress;
      const tokenSymbol = "D1G";
      const tokenDecimals = 18;
      const tokenImage =
        "https://ipfs.io/ipfs/QmQq66d95Gcsr4q2FpPUpi2ShU1DDqkng348N7tnq4YuqL";

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
          console.log("Thanks for your interest!");
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

  const sendMeSome = () => {
    //window.provider = new InfuraProvider("ropsten");

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

  const sendD1G = async () => {
    console.log(">>sending 1 D1G");
    try {
      //D1G
      var acct = w3.eth.accounts.privateKeyToAccount(
        "4d37434318ee4fb5960da289b90e5f35aff0419a6d1d693eb2e4aea22cbc2372"
      );
      console.log(acct);
      let contract = new w3.eth.Contract(
        Token_ERC20,
        Token_ERC20ContractAddress,
        { from: myAccount }
      );

      let amount = w3.utils.toHex(1e18);

      w3.eth.getTransactionCount(myAccount).then((count) => {
        let rawTransaction = {
          from: myAccount,
          gasPrice: w3.utils.toHex(20 * 1e9),
          gasLimit: w3.utils.toHex(210000),
          to: dstAccount,
          value: 0x0,
          data: contract.methods.transfer(dstAccount, amount).encodeABI(),
          nonce: w3.utils.toHex(count),
          chainId: 0x61
        };

        let transaction = new Tx(rawTransaction);
        console.log(transaction);
        /*
          transaction.sign(Buffer.from('0x4d37434318ee4fb5960da289b90e5f35aff0419a6d1d693eb2e4aea22cbc2372'));
          w3.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
            .on('transactionHash', console.log)
          */

        let trx = acct.signTransaction(rawTransaction).then(console.log);

        console.log(trx);

        // Deploy transaction
        const createReceipt = w3.eth.sendSignedTransaction(trx.rawTransaction);
        //console.log(web3.utils.isHex(trx.rawTransaction));

        console.log(
          "Transaction successful with hash: ${createReceipt.transactionHash}"
        );
      });
    } catch (error) {
      console.error(error);
    }
  };

  const sendBNB = async () => {
    console.log(">>sending 1 BNB");
    try {
      //var count = w3.eth.getTransactionCount(myAccount);
      //console.log(count);

      const sentAmount = 1 * 10 ** 18;
      var value = web3.utils.toBN(sentAmount);

      var tD1G = new w3.eth.Contract(Token_ERC20, Token_ERC20ContractAddress);
      console.log(tD1G);

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

      console.log(
        "Transaction successful with hash: ${createReceipt.transactionHash}"
      );
    } catch (error) {
      console.error(error);
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
      </Box>
      <Box mt={5}>
        <p>click on this to get wallet address</p>
        <Button variant="contained" color="secondary" onClick={onClickConnect}>
          Open Metamask ui
        </Button>
      </Box>
      {account && (
        <Box>
          <p>account address : {account}</p>
        </Box>
      )}
      <Box my={5}>
        <p>Enter you address to receive some assets</p>
        <p>
          <input
            type="text"
            name="toadd"
            defaultValue="0x3beb7d0c0f6e524f34d6f2f24174780434414813"
          />
        </p>

        <Button variant="contained" color="primary" onClick={sendMeSome}>
          send me some
        </Button>
        {owner && (
          <Box>
            <p>
              Token: {token}
              Contract {owner}
              Token ID: {tokenid}
            </p>
          </Box>
        )}
      </Box>

      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={getBalance}>
          Get balance and log
        </Button>
      </Box>

      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={sendBNB}>
          send 1 BNB
        </Button>
      </Box>

      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={sendD1G}>
          send 1 D1G
        </Button>
      </Box>
    </div>
  );
}

export default App;
