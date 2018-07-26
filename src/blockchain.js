const Eth = require('ethjs');
const eth = new Eth(new Eth.HttpProvider('https://ropsten.infura.io/C2D8VJd9N6bPvd9mP60M'));
const BN = require('bn.js');
var abi = [{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}];

const OASContract = eth.contract(abi).at('0x559623d3660bbae4ee3c90c6ad600d54a520b792');


const blockchain = {
	getCurrencySymbol: function () {
		return new Promise(function(resolve,reject) {
			OASContract.symbol().then(function(result) {
				resolve(result["0"])
			});
		});
    },
	getBalanceForAddress: function (address) {
		return new Promise(function(resolve,reject) {
			OASContract.balanceOf(address).then(function(result) {
				resolve(result.balance)
			});
		});		
    },
    getDecimals: function () {
		return new Promise(function(resolve,reject) {
			OASContract.decimals().then(function(result) {
				resolve(result["0"])
			});
		});
    },
    getCurrencyName: function () {
		return new Promise(function(resolve,reject) {
			OASContract.name().then(function(result) {
				resolve(result["0"])
			});
		});
    },
    hasMetaMask: function() {
    	return (typeof window.web3 !== 'undefined');
    },
    getLocalUserAddress: function() {
    	return new Promise(function (resolve, reject) {
    		window.web3.eth.getAccounts(function(err,accounts) {
    			resolve(accounts[0]);
    		});
    	});
    },
    sendToken: function(_from,_to,amount) {
    	return OASContract.transferFrom(_from, _to, amount, {from: _from, gas:55000})
    	.then(function(result) {
    		console.log(result);
    	})
    	.catch(function(result) {
    		console.log(result);
    	})
    },
    getTotalSupply: function() {
    	return OASContract.totalSupply()
    }
}

export default blockchain;