import ethereumClient from "./walletConnect";
import {waitForTransaction,writeContract, readContract,readContracts } from "@wagmi/core";
import { utils } from "ethers";
import tokenABI from './tokenABI.json'
import { usdtAddress,tokenAddress,stakingAddress } from "./config";
import { isAddress } from 'web3-validator';
import stakeABI from './stake-ABI.json'

const stakeContract = {
    address: "0x91a070b63C9b8C25C6A187B9399CB7378C3f8459",
    abi: stakeABI,
  }

  const usdtBal = await readContract({
    address: usdtAddress,
    abi: tokenABI,
    functionName: 'balanceOf',
    args: [ethereumClient.getAccount().address],
  })

  const tokenBalance = await readContract({
    address: tokenAddress,
    abi: tokenABI,
    functionName: 'balanceOf',
    args: [ethereumClient.getAccount().address],
  })

  const stakingBalance = await readContract({
    address: stakingAddress,
    abi: stakeABI,
    functionName: 'balances',
    args: [ethereumClient.getAccount().address],
  })

const planName = document.getElementById("plan-name");
const minStake = document.getElementById("minimum-stake");
const duration = document.getElementById("duration");
const tokenPercentage = document.getElementById("token-percentage");
const tokenProfit = document.getElementById("token-profit");
const usd = document.getElementById("usdt-available");
const dfn = document.getElementById("dfn-available");
const required = document.getElementById("dfn-required");
const joinBtn = document.getElementById("joinBtn");
const joiningForm = document.querySelector('#joiningForm');
const addressError = document.getElementById('addressError');
const containerJoin = document.getElementById('joinCont');
const swapBtn = document.getElementById('swap_btn');



const urlParams = new URLSearchParams(window.location.search);
planName.innerHTML =urlParams.get('name');
minStake.innerHTML= urlParams.get('minAmount');
duration.innerHTML = urlParams.get('stakingPeriod');
tokenPercentage.innerHTML = urlParams.get('earningpercentage');
tokenProfit.innerHTML = urlParams.get('earningtoken');
usd.innerHTML =Number(utils.formatEther(usdtBal)).toFixed(2);
dfn.innerHTML =Number(utils.formatEther(tokenBalance)).toFixed(2);
required.innerHTML = urlParams.get('minAmount');

console.log(utils.formatEther(usdtBal));
console.log(utils.formatEther(tokenBalance));

console.log("XXX",isAddress('0x8A9A638F389B22469D99CE156680822f53D77275'));

if(Number(stakingBalance)!= 0){
    document.getElementById("referral-group").style.display="none";
}

joinBtn.addEventListener("click",async function(event) {

    event.preventDefault();
    if(Number(stakingBalance)!= 0){
        
        const amount = Number(joiningForm[0].value);
        const minAmount = Number(urlParams.get('minAmount'));
        const planId = Number(urlParams.get('planId'));
        if(amount<minAmount){
            alert("Amount must be more than "+ minAmount +" DFN");
            return;
        }
        if(joinBtn.innerHTML != 'Stake Now'){
        
            const result = await writeContract({
                address: tokenAddress,
                abi: tokenABI,
                functionName: 'approve',
                args: [stakingAddress,utils.parseUnits(String(amount), 18)],
            });
            const resultTr = await waitForTransaction({
                hash: result.hash,
              })
              if(resultTr.status=='success'){
                joinBtn.innerHTML = "Stake Now";
                joinBtn.style.backgroundColor ="#26b562";
              }
            }else{
                const joinresult = await writeContract({
                    address: stakingAddress,
                    abi: stakeABI,
                    functionName: 'stake',
                    args: [String(planId),utils.parseUnits(String(amount), 18)],
                });
                const resultjoin = await waitForTransaction({
                    hash: joinresult.hash,
                  })

                  console.log(resultjoin);
                  if(resultjoin.status=='success'){
                    containerJoin.style.display = 'none';
                    successMsg.innerHTML = `<span class="alert alert-success">Congrats!! You have invested in another plan successfully</span>`;
                    
                
                  }
            }

        




    }else{
    const amount = Number(joiningForm[0].value);
    const referrer = joiningForm[1].value.trim();
    const planId = Number(urlParams.get('planId'));
    const minAmount = Number(urlParams.get('minAmount'));
    console.log("DD",amount)
    console.log("DD",referrer)

    if(!isAddress(referrer)){
        addressError.innerHTML ="Invalid Referral Code!"
        return;
    }
    if(amount<minAmount){
        addressError.innerHTML ="Amount must be more than "+ minAmount +" DFN";
        return;
    }

    var data = await readContracts({
        contracts: [
          {
            ...stakeContract,
            functionName: 'getAccountStakings',
            args:[referrer]
          }]
            });
    
        if(data[0].status=='failure'){
            addressError.innerHTML ="Invalid Referral Code!"
            return;
        }else{

            if(joinBtn.innerHTML != 'Join Now'){
        
            const result = await writeContract({
                address: tokenAddress,
                abi: tokenABI,
                functionName: 'approve',
                args: [stakingAddress,utils.parseUnits(String(amount), 18)],
            });
            const resultTr = await waitForTransaction({
                hash: result.hash,
              })
              if(resultTr.status=='success'){
                joinBtn.innerHTML = "Join Now";
                joinBtn.style.backgroundColor ="#26b562";
              }
            }else{
                const joinresult = await writeContract({
                    address: stakingAddress,
                    abi: stakeABI,
                    functionName: 'join',
                    args: [ethereumClient.getAccount().address,referrer,String(planId),utils.parseUnits(String(amount), 18)],
                });
                const resultjoin = await waitForTransaction({
                    hash: joinresult.hash,
                  })

                  console.log(resultjoin);
                  if(resultjoin.status=='success'){
                    containerJoin.style.display = 'none';
                    successMsg.innerHTML = `<span class="alert alert-danger">Congrats!! You have joined DFN</span>`;
                    
                
                  }
            }

        }
    }

});

swapBtn.addEventListener("click",async function(event) {
    window.location.href = "./swap.html";
});