import {readContract,writeContract,waitForTransaction} from '@wagmi/core';
import ethereumClient from "./walletConnect";
import {utils} from 'ethers';
import { swapAddress,usdtAddress,tokenAddress } from './config';
import tokenABI from './tokenABI.json'
import swapABI from './swapABI.json'
const dfn_perusdt = 100;
const dfnOutput = document.getElementById("dfnOutput");
const usdtInput = document.getElementById("usdtInput");
const errormsg = document.getElementById("errormsg");
const tokenSwap = document.getElementById("tokenSwap");
const DFN_BAL = document.getElementById("swap_dfn_balance");
const USDTBAL = document.getElementById("swap_usdt_balance");


const usdtBal = await readContract({
    address: usdtAddress,
    abi: tokenABI,
    functionName: 'balanceOf',
    args: [ethereumClient.getAccount().address],
  })
  USDTBAL.innerHTML =Number(utils.formatEther(usdtBal)).toFixed(2);

  const tokenBalance = await readContract({
    address: tokenAddress,
    abi: tokenABI,
    functionName: 'balanceOf',
    args: [ethereumClient.getAccount().address],
  })

  DFN_BAL.innerHTML = Number(utils.formatEther(tokenBalance)).toFixed(2);

usdtInput.addEventListener("keyup",async function(event) {
    const amount = usdtInput.value;
    const tokenBAmount = amount * dfn_perusdt;
    dfnOutput.value = tokenBAmount;
});

tokenSwap.addEventListener("click",async function(event) {
errormsg.innerHTML="";
    var valueToApprove = usdtInput.value;
    if(valueToApprove=="" || Number(valueToApprove)==0){
        errormsg.innerHTML ="USDT value must be greater than 0";
        return;
    }

    if(tokenSwap.innerHTML !="Swap Now"){
    const result = await writeContract({
        address: usdtAddress,
        abi: tokenABI,
        functionName: 'approve',
        args: [swapAddress,utils.parseUnits(String(valueToApprove), 18)],
    });
    console.log("0000",result);
    const resultTr = await waitForTransaction({
        hash: result.hash,
      })
      if(resultTr.status=='success'){
        tokenSwap.innerHTML ="Swap Now";
        tokenSwap.style.backgroundColor ="#26b562";
      }
    }else{
        tokenSwap.disabled = 'true';
        const swapresult = await writeContract({
            address: swapAddress,
            abi: swapABI,
            functionName: 'swapTokens',
            args: [utils.parseUnits(String(valueToApprove), 18)],
        });
        const swapresultTr = await waitForTransaction({
            hash: swapresult.hash,
          })

          console.log(swapresultTr);
          if(swapresultTr.status=='success'){
            errormsg.innerHTML = `<span class="alert alert-danger">Successs: <a href="https://testnet.ftmscan.com/tx/${swapresultTr.transactionHash}">${swapresultTr.transactionHash}</a></span>`;
            
        
          }

    }
    
});