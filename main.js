import ethereumClient from "./walletConnect";
import { watchAccount } from "@wagmi/core";
var path = window.location.pathname;
var connected = ethereumClient.getAccount().isConnected;
var previousAddress;
if(connected){
  previousAddress = ethereumClient.getAccount().address;
}

var mainLoopId = setInterval(function () {
  if (connected != true) {
    if(path != "/" && path != "/index.html"){
      window.location.href = "/index.html";
    }
    
  } else if (connected == true && (path == "/" || path == "/index.html")) {
    window.location.href = "./home.html";
  } else {
    console.log("connected...");
  }

  connected = ethereumClient.getAccount().isConnected;
}, 1000);

const footerMenu = `
<div class="bottom-navbar">
  <ul class="nav">
    <li class="nav-item">
      <a class="nav-link active" href="home.html">
        <i class="fas fa-home"></i>
        <span>Home</span>
      </a>
      <div class="menu-content">
        <!-- Content for Home page goes here -->
      </div>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="assets.html">
        <i class="fas fa-box-open"></i>
        <span>Assets</span>
      </a>
      <div class="menu-content">
        <!-- Content for Assets page goes here -->
      </div>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="stake.html">
        <i class="fas fa-hand-holding-usd"></i>
        <span>Stake</span>
      </a>
      <div class="menu-content">
        <!-- Content for Stake page goes here -->
      </div>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="team.html">
        <i class="fas fa-users"></i>
        <span>Team</span>
      </a>
      <div class="menu-content">
        <!-- Content for Team page goes here -->
      </div>
    </li>
  </ul>
</div>`;

document.getElementById("footer-menu").innerHTML = footerMenu;

document.getElementById("footer-menu").style.zIndex = "100";
const unwatch = watchAccount(
  (account) => {
   if(previousAddress !=account.address ){
    window.location.reload();
   }
  });


const HomenavbarMenuContent = `
<nav class="top-navbar">
<div class="container">
  <h3 id="header-title">
  <i onclick="history.back()" class="fa-solid fa-arrow-left"></i>${document.title}
  </h3>
  <w3m-core-button
    id="web3-login-button"
    class="web3-login-button"
  ></w3m-core-button>
  <div class="web3-wallet-address" style="display: none">
    <span></span>
  </div>
</div>
</nav>`;

const divNav = document.getElementById("navbarmenu");
if(divNav !=null){
  divNav.innerHTML = HomenavbarMenuContent;
}


document.addEventListener("DOMContentLoaded", function() {

let selectedIcon = document.querySelector(".bottom-navbar .nav-link.active i").className;
let selectedTitle = document.querySelector(".bottom-navbar .nav-link.active span").textContent;
const navLinks = document.querySelectorAll(".bottom-navbar .nav-link");
document.addEventListener("DOMContentLoaded", function() {
  navLinks.forEach(function(link) {
    link.addEventListener("click", function() {
    navLinks.forEach(function(link) {
      link.classList.remove("active");
    });
    this.classList.add("active");
    selectedIcon = this.querySelector("i").className;
    selectedTitle = this.querySelector("span").textContent;
    });
    });
});

});



