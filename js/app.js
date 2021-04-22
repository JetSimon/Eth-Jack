Vue.component('dealer', {
    props: {address:String, toSend:Number},
    data: function () {
      return { balance:"0", conversion:1, hasMetaMask:false
      }
    },
    beforeCreate(){
        this.hasMetaMask = typeof window.ethereum !== 'undefined'
    },
    created () {
        this.toSend = "0";
        this.getBalance();
        this.timer = setInterval(this.getBalance(), 10000);
    },
    updated() {
        this.getBalance()    
    },
    methods: {
        getBalance () {
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
                "value": this.toSend.toString(16),
              }]})
        }
    },
    template: `
    <div>
        <div v-if="hasMetaMask" class="text-center mx-auto">
        Your Balance    

        Dealer Address: <input v-model="address" /><br>  
        Dealer has: {{balance}} ETH ({{balance * conversion}} CAD)
        <br><br>
        ETH to send: <input v-model="toSend" /> 
        <button class="" @click="sendToDealer">Send to Dealer</button>  
        </div>
        <div v-else class="text-center text-5xl text-bold">Install <a href="https://metamask.io/" class="text-red-400">MetaMask</a> to use this!</div>
    </div>
    `
  })




var app = new Vue({el: '#app', data: {}})

const ethereumButton = document.querySelector('.enableEthereumButton');
const showAccount = document.querySelector('.showAccount');

ethereumButton.addEventListener('click', () => {
  getAccount();
});

async function getAccount() {
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];
  showAccount.innerHTML = account;
}