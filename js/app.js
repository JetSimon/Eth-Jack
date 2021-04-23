window.onload = function(){ document.getElementById("app").style.visibility = "hidden"; };

Vue.component('balance-box', {
    props: ['balance', 'conversion', 'title', 'secondary'],
    template: `
    <div class="my-24 lg:w-full mx-5 text-center">
        <div class="truncate text-center flex items-center content-center align-center px-10 py-3 rounded-full shadow-md h-20 text-xl font-bold text-gray-700">{{Number(balance).toFixed(8)}} ETH <span class="ml-3 text-gray-300">(\${{(Number(balance) * conversion).toFixed(2)}} CAD)</span></div> 
        <div class="pt-1 text-blue-600 text-xl font-bold italic tracking-wide">{{title}}</div>
        <div class="pt-1 text-gray-400 text-md italic tracking-wide">{{secondary}}</div>
    </div>
    `
})

Vue.component('send-button',{
    props:["sendTo"],
    data:function () {return {amount:0}},
    template: 
    `
    <div class="bg-gray-100 rounded-lg py-10 px-10 grid grid-cols-4 shadow mx-auto w-full">
    <p class="text-gray-500 text-4xl select-none"><span class="hover:text-blue-600">♦</span> ETH</p> <input type="number" class="col-span-2 rounded-lg shadow py-1 px-3 mx-5 text-3xl text-gray-500" v-model="amount" /> 
    <button class="hover:bg-blue-700 bg-blue-600 px-3 py-1 rounded-md shadow text-white text-bold" @click="sendToDealer">Send to Dealer</button>  
    </div>  
    `,
    methods: {
        sendToDealer () {
            ethereum.request({ method: 'eth_sendTransaction', params: [{
                "from": ethereum.selectedAddress,
                "to": this.sendTo,
                "value": (this.amount * (10**18)).toString(16),
              }]})
        }
    }
})

Vue.component('dealer', {
    props: {address:String},
    data: function () {
      return { balance:"0", conversion:1, userBalance:"0"
      }
    },
    created () {
        this.getBalance();
        this.timer = setInterval(this.getBalance(), 10000);
    },
    updated() {
        this.getBalance()    
    },
    computed: {
        hasMetaMask: function(){
            return typeof window.ethereum !== 'undefined'
        },

        userAddress: function(){
            return ethereum.selectedAddress;
        }
    }
    ,methods: {
        getBalance () {
            ethereum.request({ method: 'eth_getBalance', params: [
                this.address,
                'latest'
             ] }).then(response => this.balance = parseInt(response, 16) * (10**-18))

             ethereum.request({ method: 'eth_getBalance', params: [
                ethereum.selectedAddress,
                'latest'
             ] }).then(response => this.userBalance = parseInt(response, 16) * (10**-18))

            ethereum.request({ method: 'eth_getBalance', params: [
                this.address,
                'latest'
             ] }).then(response => this.balance = parseInt(response, 16) * (10**-18)) 
            
            fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=CAD').then(response => response.json())
            .then(data => this.conversion = data['CAD']);
        },
    },
    template: `
    <div>
        <div v-if="hasMetaMask" class="lg:my-0 -my-40 text-center mx-auto">
            <div class="grid grid-rows-3 grid-cols-1 mx-auto content-center justify-items-center text-center">

            <div class="block items-center justify-items-center lg:grid gap-16 grid-rows-1 grid-cols-2 pt-20 lg:w-2/3">  
                <div>
                    <div class="grid grid-col-1 grid-row-2 justify-items-center">
                        <balance-box :balance="balance" :conversion="conversion" title="Dealer's Balance (The Pot)"></balance-box>
                        <div class="-my-24"><input name="dealerAddress" id="dealerAddress" class="text-gray-400 shadow rounded-lg flex px-5" v-model="address" /></div>
                    </div>
                    <div class="pt-20 grid justify-items-center">
                    <balance-box class="-my-12" :balance="userBalance" :conversion="conversion" title="Your Balance" :secondary="userAddress"></balance-box>
                    </div>
                </div>

            <div class="mx-5 my-20 lg:-my-0">
                <p class="text-6xl font-bold tracking-wide pb-5 text-gray-700">make a bet</p>
                <send-button :sendTo="address"></send-button>
            </div>
            </div>
            </div>
        </div>
        <div v-else class="text-gray-700 text-center text-5xl text-bold">Install <a href="https://metamask.io/" class="hover:text-blue-700 text-blue-600">MetaMask</a> to use this!</div>
    </div>
    `
  })

var app = new Vue({el: '#app', data: {}})

const ethereumButton = document.querySelector('.enableEthereumButton');
const showAccount = document.querySelector('.showAccount');

ethereumButton.addEventListener('click', () => {
  document.getElementById("app").style.visibility = "initial";
  getAccount();
  ethereumButton.style.display = "none";
});

async function getAccount() {
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];
  //showAccount.innerHTML = "Your Wallet Address: " + account;
}