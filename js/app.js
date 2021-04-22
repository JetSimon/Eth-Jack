window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        console.log("METAMASK OK")
    }
});

Vue.component('dealer', {
    props: {address:String, toSend:Number},
    data: function () {
      return { balance:"0", conversion:1
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
    <div class="text-center mx-auto">
      Your Balance    

      Dealer Address: <input v-model="address" /><br>  
      Dealer has: {{balance}} ETH ({{balance * conversion}} CAD)
      <br><br>
      ETH to send: <input v-model="toSend" /> 
      <button class="" @click="sendToDealer">Send to Dealer</button>  
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