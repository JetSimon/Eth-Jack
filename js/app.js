window.onload = function(){ document.getElementById("app").style.visibility = "hidden"; };

Vue.component('dealer', {
    props: {address:String, toSend:Number},
    data: function () {
      return { balance:"0", conversion:1, userBalance:"0"
      }
    },
    created () {
        this.toSend = "0";
        this.getBalance();
        this.timer = setInterval(this.getBalance(), 10000);
    },
    updated() {
        this.getBalance()    
    },
    computed: {
        hasMetaMask: function(){
            return typeof window.ethereum !== 'undefined'
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

        sendToDealer () {
            ethereum.request({ method: 'eth_sendTransaction', params: [{
                "from": ethereum.selectedAddress,
                "to": this.address,
                "value": (this.toSend * (10**18)).toString(16),
              }]})
        }
    },
    template: `
    <div>
        <div v-if="hasMetaMask" class="text-center mx-auto">
            Your Balance: {{userBalance}} ETH ({{userBalance * conversion}} CAD) 
            

            <div class="w-1/3 grid gap-0 grid-rows-1 grid-cols-2 text-center items-center justify-items-center mx-auto"><label>Dealer Address:</label for="dealerAddress"> <input name="dealerAddress" id="dealerAddress" class="shadow rounded-lg flex px-5" v-model="address" /></div>

            <div class="grid grid-rows-3 grid-cols-1 mx-auto content-center justify-items-center text-center">
            
            <div class="block items-center justify-items-center lg:grid gap-10 grid-rows-1 grid-cols-2 pt-20 lg:w-2/3">

            <div class="my-24 lg:w-full mx-5 text-center">
                <div class="truncate text-center flex items-center content-center align-center px-10 py-3 rounded-full shadow-md h-20 text-2xl font-bold text-gray-700">{{balance}} ETH <span class="ml-3 text-gray-300">(\${{balance * conversion}} CAD)</span></div> 
                <div class="pt-1 text-blue-600 text-xl font-bold italic tracking-wide">Dealer's Balance</div>
            </div>

            <div class="-my-20 mx-5 lg:-my-0">
                <p class="text-6xl font-bold tracking-wide pb-5 text-gray-700">make a bet</p>
                <div class="bg-gray-100 rounded-lg py-10 px-10 grid grid-cols-4 shadow mx-auto w-full">
                    <p class="text-gray-500 text-4xl select-none">♦ ETH</p> <input class="col-span-2 rounded-lg shadow py-1 px-3 mx-5 text-3xl text-gray-500" v-model="toSend" /> 
                    <button class="bg-blue-600 px-3 py-1 rounded-md shadow text-white text-bold" @click="sendToDealer">Send to Dealer</button>  
            </div>
            </div>
            </div>
            </div>
        </div>
        <div v-else class="text-gray-700 text-center text-5xl text-bold">Install <a href="https://metamask.io/" class="text-blue-600">MetaMask</a> to use this!</div>
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
  showAccount.innerHTML = "Your Wallet Address: " + account;
}