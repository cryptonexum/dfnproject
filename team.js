   
    

    import stakeABi from "./stake-ABI.json";
    import { utils } from "ethers";
    import {readContracts,watchAccount} from "@wagmi/core";
    import ethereumClient from "./walletConnect";
    import { stakingAddress,TOKEN_PRICE } from "./config";
  


    const TotalEarning = document.getElementById("total-earning");
    const TotalEarningUSDT  = document.getElementById("total-earning-usdt");
    const DirectReferrals  = document.getElementById("direct-referrals");
    const IndirectReferrals  = document.getElementById("indirect-referrals");
    const referredBy  = document.getElementById("referredBy");
    const yourAccount  = document.getElementById("your-account");
    const referralsContainer  = document.getElementById("referrals-container");
    const sharebtn  = document.getElementById("share");
    const shareData = {
        title: "DFN- DeFi Network",
        text: "Hi I would like to invite you to DeFi Network. \nfollow the link and register using my Account as referralCode i.e :\n"+ethereumClient.getAccount().address+"\n\n",
    
        url: "https://definet.io",
      };
    
      sharebtn.addEventListener("click", async () => {
          try {
            await navigator.share(shareData);
           console.log("success")
          } catch (err) {
            console.log(err)
          }
        });



   

    
    const stakeCOntract = {
        address: stakingAddress,
        abi: stakeABi,
    }
    
    const AccountData = await readContracts({
        contracts: [
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
          {
            ...stakeCOntract,
            functionName: 'countIndirectReferrals',
            args:[ethereumClient.getAccount().address]
          },
          {
            ...stakeCOntract,
            functionName: 'getReferrer',
            args:[ethereumClient.getAccount().address]
          },
          {
            ...stakeCOntract,
            functionName: 'getDirectReferrals',
            args:[ethereumClient.getAccount().address]
          },

        ],
      });

      TotalEarning.innerHTML = Number(utils.formatEther(AccountData[0].result)).toFixed(2);
      TotalEarningUSDT.innerHTML = Number((Number(utils.formatEther(AccountData[0].result))*TOKEN_PRICE)).toFixed(2);
      DirectReferrals.innerHTML = AccountData[1].result;
      IndirectReferrals.innerHTML = AccountData[2].result;
      if(AccountData[3].result == '0x0000000000000000000000000000000000000000'){
        referredBy.innerHTML = 'Not A Member'
        yourAccount.innerHTML = `${maskWalletAddress(ethereumClient.getAccount().address)} <input type="hidden" value="${ethereumClient.getAccount().address}" id="yourAddressCopy"><i onclick="copyToClipboard('yourAddressCopy')" class="fa-solid fa-copy float-right"></i>`;
        referralsContainer.insertAdjacentHTML("beforeend",(`<h5 style="color:#3396FF" class="text-center">No Referrals</h5>`));
      }else{
      referredBy.innerHTML = `<a class= "no-decoration" href="referrals.html?address=${AccountData[3].result}">${maskWalletAddress(String(AccountData[3].result))} <i class="fa-solid fa-arrow-up-right-from-square"></i> </a><input type="hidden" value="${AccountData[3].result}" id="referrerId"><i onclick="copyToClipboard('referrerId')" class="fa-solid fa-copy float-right"></i>`;
      yourAccount.innerHTML = `${maskWalletAddress(ethereumClient.getAccount().address)} <input type="hidden" value="${ethereumClient.getAccount().address}" id="yourAddressCopy"><i onclick="copyToClipboard('yourAddressCopy')" class="fa-solid fa-copy float-right"></i>`;
      if(AccountData[4].result.length>0){
      for(var i=0;i<AccountData[4].result.length;i++){
      var htmlContent =   `<div class="referrer text-center">
        <a href="referrals.html?address=${AccountData[4].result[i]}" class="no-decoration">${maskWalletAddress(AccountData[4].result[i])}</span> <i class="fa-solid fa-arrow-up-right-from-square"></i></a><input type="hidden" value="${AccountData[4].result[i]}" id="copybutton${i}"><i onclick="copyToClipboard('copybutton${i}')" class="fa-solid fa-copy float-right"></i>
        </div>`
        referralsContainer.insertAdjacentHTML("beforeend",(htmlContent));
      }
    }else{
      referralsContainer.insertAdjacentHTML("beforeend",(`<h5 style="color:#3396FF" class="text-center">No Referrals</h5>
      
      `));
    }

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
      