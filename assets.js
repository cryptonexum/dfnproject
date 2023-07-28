import {readContract,readContracts} from '@wagmi/core';
import ethereumClient from "./walletConnect";
import {utils} from 'ethers';
import { usdtAddress,tokenAddress,stakingAddress } from './config';
import ERC20_ABI from './tokenABI.json'
import stakeABI from './stake-ABI.json';
import QRCode from 'qrcode'
const DFN_BAL = document.getElementById("swap_dfn_balance");
const USDTBAL = document.getElementById("swap_usdt_balance");
const TotalStakes = document.getElementById("total_stakes");
const RealtimeRewards = document.getElementById("realtimeReward");
const referralRewards = document.getElementById("referralRewards");
const totalRewards = document.getElementById("totalRewards");
const rewardsWithdrawn = document.getElementById("rewardsWithdrawn");
const AvailableRewards= document.getElementById("availableRewards");
const receivebtn= document.getElementById("receivebtn");
const qrcode__= document.getElementById("qrcode");








const stakeContract = {
    address: stakingAddress,
    abi: stakeABI,
    }
    
    const dfnTokenContract = {
    address: tokenAddress,
    abi: ERC20_ABI,
    }
    
    const usdtContract = {
    address: usdtAddress,
    abi: ERC20_ABI,
    }
    
    


const AccountData = await readContracts({
    contracts: [
    {
        ...dfnTokenContract,
        functionName: 'balanceOf',
        args: [ethereumClient.getAccount().address],
    },
    {
        ...usdtContract,
        functionName: 'balanceOf',
        args: [ethereumClient.getAccount().address],
    },
      {
        ...stakeContract,
        functionName: 'balances',
        args: [ethereumClient.getAccount().address],
        
      },
      {
        ...stakeContract,
        functionName: 'getRealtimeStakingRewards',
        args:[ethereumClient.getAccount().address]
      },
      {
        ...stakeContract,
        functionName: 'calculateReferralCommission',
        args:[ethereumClient.getAccount().address]
      },
      {
        ...stakeContract,
        functionName: 'getAccountStakings',
        args:[ethereumClient.getAccount().address]
      },
      {
        ...stakeContract,
        functionName: 'getWithdrawnRewards',
        args:[ethereumClient.getAccount().address]
      }
     
    ],
  });

DFN_BAL.innerHTML = Number(utils.formatEther(AccountData[0].result)).toFixed(2);
USDTBAL.innerHTML =Number(utils.formatEther(AccountData[1].result)).toFixed(2);
TotalStakes.innerHTML = Number(utils.formatEther(AccountData[2].result)).toFixed(2);
RealtimeRewards.innerHTML = Number(utils.formatEther(String(AccountData[3].result))).toFixed(2); 
referralRewards.innerHTML = Number(utils.formatEther(String(AccountData[4].result))).toFixed(2);
const total = Number(utils.formatEther(AccountData[3].result)) + Number(utils.formatEther(AccountData[4].result));
totalRewards.innerHTML = Number(total).toFixed(2);
rewardsWithdrawn.innerHTML = Number(utils.formatEther(AccountData[6].result)).toFixed(2);
AvailableRewards.innerHTML = (total - Number(utils.formatEther(AccountData[6].result))).toFixed(2);


receivebtn.addEventListener("click", async () => {
  var opts = {
    type: 'image/webp',
    quality: 1,
    margin: 1,
  }
        try {
         var data_ =  await QRCode.toDataURL(ethereumClient.getAccount().address,opts);
         console.log(data_);
         var data = `
         <img style="margin-bottom: 10px;border:1px solid black" width="70%" src="data: ${data_}">
        <p class="alert alert-primary" style="word-wrap:break-word;padding:10px;width: 100%;"> ${ethereumClient.getAccount().address}<input type="hidden" value="${ethereumClient.getAccount().address}" id="yourAddressCopy"><i onclick="copyToClipboard('yourAddressCopy')" class="fa-solid fa-copy float-right"></i></p>
         <p class="alert alert-danger">Note: Send Only BEP20 USDT or DFN only to this address</p>
         `
         qrcode__.innerHTML = data;
        } catch (err) {
          console.error(err)
        }
      
});



