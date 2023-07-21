
import { utils } from "ethers";
import stakeABi from "./stake-ABI.json"
import getPlanName from "./contractUtils";
import Chart from "chart.js/auto";
import {readContracts,watchAccount} from "@wagmi/core";
import ethereumClient from "./walletConnect";
import { stakingAddress,TOKEN_PRICE } from "./config";

const stakeCOntract = {
    address: stakingAddress,
    abi: stakeABi,
}
  const tokenPrice = Number(TOKEN_PRICE); 

  const shareData = {
    title: "DFN- DeFi Network",
    text: "Hi I would like to invite you to DeFi Network. \nfollow the link and register using my Account as referralCode i.e :\n"+ethereumClient.getAccount().address+"\n\n",

    url: "https://definet.io",
  };

var connected=ethereumClient.getAccount().isConnected;
if(connected ==true){
    const balance = document.getElementById('balance');
    const balanceUsdValue = document.getElementById('balance-usd-value');
    const totalStaked = document.getElementById('total-staked');
    const earnings = document.getElementById('earnings');
    const earningsUSDT = document.getElementById('earning-usdt');
    const stakingUSDT = document.getElementById('staking-usdt');
    const nameMembership = document.getElementById('name-membership');
    const referAlert = document.getElementById('refer-alert');
    const referButton = document.getElementById('refer-button');
    const onboardMsg = document.getElementById('onboarding-msg');
    const onboardBtn = document.getElementById('onboarding-btn');
    
    
    const AccountData = await readContracts({
      contracts: [
        {
          ...stakeCOntract,
          functionName: 'balances',
          args: [ethereumClient.getAccount().address],
          
        },
        {
          ...stakeCOntract,
          functionName: 'getAccountStakings',
          args:[ethereumClient.getAccount().address]
        },
        {
          ...stakeCOntract,
          functionName: 'getRealtimeStakingRewards',
          args:[ethereumClient.getAccount().address]
        },
        {
          ...stakeCOntract,
          functionName: 'getAllPlans',
        },
        {
          ...stakeCOntract,
          functionName: 'calculateReferralCommission',
          args:[ethereumClient.getAccount().address]
        },
        {
          ...stakeCOntract,
          functionName: 'countDirectReferrals',
          args:[ethereumClient.getAccount().address]
        },
      ],
    });
    
    if(AccountData[1].status == 'failure'){
      onboardMsg.innerHTML =`<div id="refer-alert" class="alert alert-info text-center" role="alert">&#128559; Seems like you are new User<br>Join any plan and start earning upto 50,000 USDT</div>`;
      onboardBtn.innerHTML = `<button onclick="window.location.href='./plans.html'" class="btn btn-md btn-block btn-primary">View Plans <i class="fa-solid fa-arrow-up-right-from-square"></i></i></button>`;
      nameMembership.innerHTML = "Not A Member"
      document.getElementById("footer-menu").style.display = 'none';
    }else{
        const referralCommision = Number(utils.formatEther(AccountData[4].result));
      const deposit = utils.formatEther(String(AccountData[0].result))
      const profit = utils.formatEther(String(AccountData[2].result))
     const totalbal = (Number(deposit) + Number(profit) + referralCommision).toFixed(2);
      balance.innerHTML =totalbal;
      balanceUsdValue.innerHTML = (totalbal * tokenPrice).toFixed(2);
      const total_staked =  ()=>{
        return Number(utils.formatEther(AccountData[0].result)).toFixed(2);
      }
   
      const total_stake = total_staked();
      totalStaked.innerHTML = Number(total_stake).toFixed(2);
      earnings.innerHTML = (Number(profit)+Number(utils.formatEther(AccountData[4].result))).toFixed(2);
      earningsUSDT.innerHTML = ((Number(profit)+Number(utils.formatEther(AccountData[4].result)))* tokenPrice).toFixed(2);
      stakingUSDT.innerHTML = (Number(total_stake)*tokenPrice).toFixed(2);
      const planId = String(AccountData[1].result[0].planId);
      nameMembership.innerHTML = getPlanName(Number(planId)) +" Member";
    
  
      var countReferrals = Number(AccountData[5].result);
      if(countReferrals==0){
        referAlert.innerHTML =`<div id="refer-alert" class="alert alert-primary text-center" role="alert">Seems like you have not referred any account.<br>Refer Now and earn upto 50,000 USDT</div>`;
        referButton.innerHTML = `<button id="share" class="btn btn-md btn-block btn-primary">Refer Now <i class="fa-solid fa-arrow-up-right-from-square"></i></i></button>`;
        share();
    }
     else if(countReferrals==1){
        referAlert.innerHTML =`<div id="refer-alert" class="alert alert-success text-center" role="alert">Congrates! You have recently referred an account.Refer<strong> one more account</strong> to be eligible for referral rewards. </div>`;
        referButton.innerHTML = `<button id="share" class="btn btn-md btn-block btn-primary">Refer More <i class="fa-solid fa-arrow-up-right-from-square"></i></i></button>`;
        share();
    }
      else if(countReferrals==2){
        referAlert.innerHTML =`<div id="refer-alert" class="alert alert-success text-center" role="alert">Wooohoo! You did it, You received your first referral bonus of <strong>${referralCommision} DFN</strong>. Keep referring and earn more</div>`;
        referButton.innerHTML = `<button id="share" class="btn btn-md btn-block btn-primary">Refer More <i class="fa-solid fa-arrow-up-right-from-square"></i></i></button>`;
        share();
    }
      else{
        referAlert.innerHTML =`<div id="refer-alert" class="alert alert-success text-center" role="alert">Happy Earning! You have earned <strong>${referralCommision} DFN</strong> by referring <strong>${countReferrals} accounts</strong> so far . Refer more and earn more rewards upto 50,000 USDT.</div>`;
        referButton.innerHTML = `<button id="share" class="btn btn-md btn-block btn-primary">Refer More <i class="fa-solid fa-arrow-up-right-from-square"></i></i></button>`;
        share();
    }
    
    
        /* pie chart */
        const data = {
        labels: ['Your Stakes', 'Stakes Earnings','Referral Earnings'],
        datasets: [{
            data: [Number(total_stake).toFixed(2), Number(profit).toFixed(2),referralCommision],
            backgroundColor: ['#3496ff', '#17a2b8','#e83e8c'], // Colors for each slice
        }]
        };
        
        // Pie chart options
        const options = {
            responsive: true,
            maintainAspectRatio: false,
        };

        // Create the pie chart
        const ctx = document.getElementById('myPieChart').getContext('2d');
        const myPieChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options,
        });
}


}

function share(){
const shareBtn = document.getElementById("share");
shareBtn.addEventListener("click", async () => {
  try {
    await navigator.share(shareData);
   console.log("success")
  } catch (err) {
    console.log(err)
  }
});
}