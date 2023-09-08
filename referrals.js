
import stakeABi from "./ABI_STAKE.json";
import {readContracts} from "@wagmi/core";
import ethereumClient from "./walletConnect";
import { stakingAddress } from "./config";

const address =  document.getElementById("address");
const parentAddress =  document.getElementById("parentAddress");
const referralsContainer =  document.getElementById("referralsContainer");
const urlParams = new URLSearchParams(window.location.search);
const addressValue = urlParams.get("address");
address.innerHTML=maskWalletAddress(addressValue);
parentAddress.value = addressValue;


const stakeCOntract = {
    address: stakingAddress,
    abi: stakeABi,
}

const AccountData = await readContracts({
    contracts: [
      {
        ...stakeCOntract,
        functionName: 'getDirectReferrals',
        args:[addressValue]
      },

    ],
  });


if(AccountData[0].result.length>0){
  for(var i=0;i<AccountData[0].result.length;i++){
    var htmlContent =   `<div class="referrer text-center">
      <a href="referrals.html?address=${AccountData[0].result[i]}" class="no-decoration">${maskWalletAddress(AccountData[0].result[i])}</span> <input id="copy${i}" type="hidden" value="${AccountData[0].result[i]}"/><i class="fa-solid fa-arrow-up-right-from-square"></i></a> <i style="margin-left: 100px;" onclick="copyToClipboard('copy${i}')" class="fa-solid fa-copy "></i>
      </div>`
      referralsContainer.insertAdjacentHTML("beforeend",(htmlContent));
    }
}else{
    referralsContainer.insertAdjacentHTML("beforeend",(`<h3 class="text-center">No Referrals</h3>`));
}






function maskWalletAddress(walletAddress) {
    if (typeof walletAddress !== 'string') {
      throw new Error('Input must be a string representing the wallet address');
    }
  
    if (walletAddress.length < 10) {
      throw new Error('Wallet address must have at least 10 characters');
    }
  
    const firstFive = walletAddress.slice(0, 5);
    const lastFive = walletAddress.slice(-5);
    const middleAsterisks = "*******";
  
    return `${firstFive}${middleAsterisks}${lastFive}`;
  }
  