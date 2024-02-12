const Contract = require("@truffle/contract");
const WalletProvider = require("@truffle/hdwallet-provider");
const {Web3} = require('web3')

const cron = require("node-cron"); 
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const ethers = require("ethers")



async function getContractNft(){
    const RPC_URL = process.env.RPC_URL;
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL), { timeout: 20000 });
    const abiPath = path.resolve("./smartcontracts/abi/ERC721NFT.json");  
    const rawData = fs.readFileSync(abiPath);  
    const contractAbi = JSON.parse(rawData).abi;
    const contract = new web3.eth.Contract(contractAbi, contractAddress); 
    const provider = new WalletProvider(process.env.PRIVATE_KEY, RPC_URL);  
    contract.setProvider(provider);  
    
    

    return contract;
}

module.exports.getContractNft = getContractNft






    

