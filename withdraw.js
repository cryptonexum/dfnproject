import {waitForTransaction,readContracts,writeContract} from '@wagmi/core';
import ethereumClient from "./walletConnect";
import {utils} from 'ethers';
import {stakingAddress } from './config';
import stakeABI from './ABI_STAKE.json';
const withdrawable = document.getElementById("withdrawable-reward");
const withdrawAmount = document.getElementById("withdrawAmount");
const submitWithdraw = document.getElementById("submit-withdraw");
const errormsg = document.getElementById("errormsg");




const stakeContract = {
    address: stakingAddress,
    abi: stakeABI,
    }


const AccountData = await readContracts({
    contracts: [
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
        functionName: 'getWithdrawnRewards',
        args:[ethereumClient.getAccount().address]
      }
     
    ],
  });

const total = Number(utils.formatEther(AccountData[0].result)) + Number(utils.formatEther(AccountData[1].result));
const withdrawable_ = (total - Number(utils.formatEther(AccountData[2].result))).toFixed(2);
withdrawable.innerHTML = withdrawable_;





submitWithdraw.addEventListener("click", async () => {
    const withdrawAmount_ = withdrawAmount.value;
    if(withdrawAmount_ == ""){
        errormsg.innerHTML =` <div class="alert alert-danger alert-dismissible fade show">
        <span style="margin-right:10px" type="button" class="close" data-dismiss="alert">&times;</span>
        <strong >Error!</strong> Please Enter Amount
      </div>`;
        return;
    }
    if(Number(withdrawAmount_) > withdrawable_){
        errormsg.innerHTML =` <div class="alert alert-danger alert-dismissible fade show">
        <span style="margin-right:10px" type="button" class="close" data-dismiss="alert">&times;</span>
        <strong >Error!</strong> Enter Amount less than ${withdrawable_} DFN
      </div>`;
        return;
    }
    const result = await writeContract({
        address: stakingAddress,
        abi: stakeABI,
        functionName: 'withdrawRewards',
        args: [utils.parseUnits(String(withdrawAmount_), 18)],
    });
    
    const resultTr = await waitForTransaction({
        hash: result.hash,
      })
      if(resultTr.status=='success'){
        errormsg.innerHTML =` <div class="alert alert-info alert-dismissible fade show">
        <span style="margin-right:10px" type="button" class="close" data-dismiss="alert">&times;</span>
        Hash:&nbsp; <a target ='_blank' href="https://testnet.ftmscan.com/tx/${resultTr.transactionHash}">${resultTr.transactionHash}</a>
      </div>`;
      submitWithdraw.disabled ="true";
        return;
      }else{
        console.log("failed",resultTr)
      }
    

});



