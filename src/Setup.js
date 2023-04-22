import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { options } from '@astar-network/astar-api';
import { DispatchError, WeightV2 } from '@polkadot/types/interfaces'
import { numberToHex, u8aToString, stringToU8a, u8aToHex, hexToString, hexToU8a, BN, hexToBn, hexToNumber, } from '@polkadot/util'; // Some helper functions used here
import { ContractPromise, Abi } from '@polkadot/api-contract';

// ***** Phala sdk beta!! *****
// install with `yarn add @phala/sdk@beta`
// tested and working with @phala/sdk@0.4.0-nightly-20230318
import { PinkContractPromise, OnChainRegistry, types } from '@phala/sdk'
import { typeDefinitions } from '@polkadot/types'
// import { types} from "@phala/sdk"; { nonce: -1 }

// ***** Phala *****
import phat_boiler_plate_metadata from './Abis/phat_boiler_plate.json';  
import phala_games_STB_metadata from './Abis/phala_games_STB.json';  


// ***** Phala *****
const phat_contractId = "0xfd71ba453828647b8a08dae3d68b370b4cdd8c8bd3d04a0d0eb060b9813f866c"
const phat_games_STB_contractId = "0x12b2e9253e689a6714f3405a96cdf70be918340896c8106b8b9fd38f44cf9001"

console.log(" ********** phat_contractId ********** : ",phat_contractId);
let phala_api, phat_games_STB, phat_contract_boiler_plate;
let polkadot_test_account;


// const mantissa18 = new BN("1000000000000000000");
// const mantissa15 = new BN("1000000000000000");
// const mantissa12 = new BN("1000000000000");
const mantissa9 = new BN("1000000000");



let polkadotInjector = null, polkadotInjectorAddress=null;
const setPolkadotInjector = (injector, injectorAddress) => { 
    polkadotInjector = injector;
    polkadotInjectorAddress = injectorAddress;
    console.log(`Setup New Polkadot Signer/Injector polkadotInjectorAddress: ${polkadotInjectorAddress} polkadotInjector: `,polkadotInjector);

	// Setup New Polkadot Signer/Injector polkadotInjectorAddress: 5DAqjjBN3CJteqrmps95HUmo325xDBuErC8BoNd88ud6Cxgo polkadotInjector: ...
}

 
//#region ***** Setup Substrate Chain //*****
const setup_SubstrateChain = async (wsURL = 'Shibuya') => {
  console.log("setup_SubstrateChain is RUN for wsURL: ",wsURL);

  let WS_URL, api;

  //mainnet
  //testnet
  // ***** Phala *****
  if (wsURL === 'PhalaTestNet') WS_URL = 'wss://phat-beta-node.phala.network/khala/ws'
  
  const wsProvider = new WsProvider(WS_URL);

  // ***** Phala *****
  // Wait for Provider
  if (wsURL === 'PhalaTestNet') {
		api = await ApiPromise.create({ 
			provider: wsProvider,
			types: { ...types, ...typeDefinitions }
			});
	}
  else {
	  api = await ApiPromise.create({ provider: wsProvider });
  }


	// ***** Phala *****
	//1
	console.log(" ********** phatRegistry ********** ");
	const phatRegistry = await OnChainRegistry.create(api)
	//Alternative way
	//   const pruntimeURL="https://phat-fr.01.do/node-1/"
	//   const phatRegistry = await OnChainRegistry.create(api, { 
	// 	pruntimeURL: 'https://phat-fr.01.do/node-2/'
	//   })
	
	//2
	console.log(" ********** phat_abi ********** ");
	const phat_abi = phat_boiler_plate_metadata;
	const phat_abi_games_STB = phala_games_STB_metadata;

	//   const phat_abi = JSON.parse(JSON.stringify(phat_boiler_plate_metadata));

	//3
	console.log(" ********** phat_contractKey ********** ");
	const phat_contractKey = await phatRegistry.getContractKey(phat_contractId)
	const phat_games_STB_contractKey = await phatRegistry.getContractKey(phat_games_STB_contractId)

	console.log("phat_contractKey: ",phat_contractKey);
	//Alternative way
	//   console.log(" ********** contractKeyQuery For Information Only********** ");
	//   const contractKeyQuery = await api.query.phalaRegistry.contractKeys(phat_contractId)
	//   if (!contractKeyQuery) {
	// 	  throw new Error('Contract not found in cluster.')
	//   }
	//   console.log("contractKeyQuery",contractKeyQuery.unwrap().toHuman())
	// --> 0x286591792527e392de27e526ba1e194628260f5459ac997896fdc54fff4de137

	//4
	console.log(" ********** Phala contract ********** ");
	const contract = new PinkContractPromise(api, phatRegistry, phat_abi, phat_contractId, phat_contractKey);
	const contract_games_STB = new PinkContractPromise(api, phatRegistry, phat_abi_games_STB, phat_games_STB_contractId, phat_games_STB_contractKey);

	phat_games_STB = contract_games_STB;
	// phat_contract_boiler_plate = contract;
	// console.log("contract:",contract.abi.messages.map((e)=>{return e.method}))
	console.log("contract:",contract_games_STB.abi.messages.map((e)=>{return e.method}))

	//contract: ['getEthBalance', 'setMyMessage', 'getMyMessage', 'setMyNumber', 'getMyNumber']
	//NOTE: SEE THE DIFFERENCE IN FUNCTION NAMES VS SC

	await api.isReady;
	console.log(`api => : `,api);
	console.log(" ********** API PROPERTIES ********** ");
	console.log((await api.rpc.system.properties()).toHuman());
	console.log(" ********** API PROPERTIES ********** ");
  
  	getAccountIdtoHex();   //USED FOR TESTING AND TO BE REPLACED BY POLKADOT EXTENSION
	phala_api = api;

  return {api};
};
//#endregion 


// FOR TESTING
//#region getAccountIdtoHex SET UP polkadot_test_account
const getAccountIdtoHex = (accountI32="") => {
  const keyring = new Keyring({ type: 'sr25519' });
	//  const PHRASE = 'casual subject usage friend elder novel brick prosper order protect senior hunt';    //Alecia

	//   ## ADMIN ARISU_ASTAR
	//   X3SB29SpRwzsftcKAbCK8w584o5BQbysPdL35pz1Gd3o4RS
	//   SEED PHRASE
	//   organ cup sport decline curious quit pause sail motor okay force advance
	//   const PHRASE = 'organ cup sport decline curious quit pause sail motor okay force advance';    //Arisu

  	// const Arisu2_PHRASE = 'bachelor axis digital trend canyon diesel pencil giraffe noise maze rose become';    //Arisu2 IS ADMIN
  	//ADDRESS   5HMwBS1bxriTYnGo6m8AFEKTaoDmTKJeMvoMpQXENJsv1RBg

	  const PHRASE = 'mean decade kidney strategy surround tilt friend quote kangaroo spice board silver'; //USAGI2 for server
  	//ADDRESS   5EZwpfeoyhWbEhmfuSAv8ekL8BWfAc94pvRYJUFK6ASnbg4w

	// ***** Phala *****
  	//PHALA CLOSED BETA
	//   ADDRESS: 5FNvx9WqU3GG5ExgYLBUJ1AY9Ea3NDcmAG5qzpx2yG9oYHSP
	//   Address: 43w1rF1zrYmYCY77fwdBmBySPQrWi24WtySGcdERR11xAhSQ 
	//   Mnemonic: play awake tomato project sniff annual today loud machine local minor cargo 
  	// const PHRASE = 'play awake tomato project sniff annual today loud machine local minor cargo';


  const Alecia = keyring.addFromUri(PHRASE);
  polkadot_test_account = Alecia;
  console.log(`polkadot_test_account ADDRESS: ${polkadot_test_account.address}`); //5FP8MMBmPdBCMgG5AspTHVNWXXSEoR4vgJwSrehUj1qJAKxN

}
//#endregion



// R E A D

//#region PHALA DONE
const get_account_balance = async () => {

	if (phala_api) 
	{
      // Phala
	//   const { nonce, data: balance } = await phala_api.query.system.account(khala_Address);   // Retrieve the account balance & nonce via the system module
	  const { nonce, data: balance } = await phala_api.query.system.account(polkadotInjectorAddress);   // Retrieve the account balance & nonce via the system module

	  console.log(`=======> balance: ${balance} (balance.free).toString(): ${(balance.free).toString()}`);
	  //   =======> balance: {"free":"0x00000000000000000022fe607717a5e1","reserved":0,"miscFrozen":0,"feeFrozen":0} (balance.free).toString(): 9849839476516321

	  const freeBalance = new BN((balance.free).toString());
	  const formatted_PHABalance_3decimals =  new BN( `${freeBalance.div(mantissa9)}` );
	  const balance3decimals = Number(`${formatted_PHABalance_3decimals}`) / 1000;

	  console.log(`balance: ${balance} freeBalance: ${freeBalance} formatted_PHABalance_3decimals: ${formatted_PHABalance_3decimals} balance3decimals" ${balance3decimals}`);
	  return balance3decimals;
	} else return 0

}

//phat_games_STB
//#region READ 1   
const get_game_stats = async () => {

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getGameStats(polkadot_test_account);

		if (result.isOk) {
			// output the return value
			// console.log('Success', output.toHuman());  //Success false
			return  output.toHuman()
		} else {
			console.error('Error', result.asErr);
			return result.asErr
		}

	}
	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
}
//#endregion

//#region READ 2  get_players 
const get_players = async () => {

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getPlayers(polkadot_test_account);

		if (result.isOk) {
			// output the return value
			// console.log('Success', output.toHuman());  //Success false
			return  output.toHuman()
		} else {
			console.error('Error', result.asErr);
			return result.asErr
		}

	}
	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
}
//#endregion

//#region READ 3  get_players_mapping 
const get_players_mapping = async () => {

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getPlayersMapping(polkadot_test_account,polkadotInjectorAddress);

		if (result.isOk) {
			// output the return value
			// console.log('Success', output.toHuman());  //Success false
			return  output.toHuman()
		} else {
			console.error('Error', result.asErr);
			return result.asErr
		}

	}
	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
}
//#endregion

//#region READ 4  get_playeget_tickets_mappingrs_mapping 
const get_tickets_mapping = async (ticket_id) => {

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getTicketsMapping(polkadot_test_account,ticket_id);

		if (result.isOk) {
			// output the return value
			// console.log('Success', output.toHuman());  //Success false
			return  output.toHuman()
		} else {
			console.error('Error', result.asErr);
			return result.asErr
		}

	}
	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
}
//#endregion

//#region READ 5  get_all_tickets 
const get_all_tickets = async (ticket_id) => {

	console.log(`get_all_tickets get_all_tickets get_all_tickets get_all_tickets`);

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getAllTickets(polkadot_test_account);

		if (result.isOk) {
			// output the return value
			// console.log('Success', output.toHuman());  //Success false
			return  output.toHuman()
		} else {
			console.error('Error', result.asErr);
			return result.asErr
		}

	}
	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
}
//#endregion

//#region READ 5  get_ordered_tickets 
const get_ordered_tickets = async (ticket_id) => {

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getOrderedTicketIds(polkadot_test_account);

		if (result.isOk) {
			// output the return value
			// console.log('Success', output.toHuman());  //Success false
			return  output.toHuman()
		} else {
			console.error('Error', result.asErr);
			return result.asErr
		}

	}
	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
}
//#endregion


//#region READ 6  get_wisdom_of_crowd_coordinates 
const get_wisdom_of_crowd_coordinates = async () => {

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getWisdomOfCrowdCoordinates(polkadot_test_account);

		if (result.isOk) {
			// output the return value
			// console.log('Success', output.toHuman());  //Success false
			return  output.toHuman()
		} else {
			console.error('Error', result.asErr);
			return result.asErr
		}

	}
	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
}
//#endregion

//#region READ 6  get_winning_tickets
const get_winning_tickets = async () => {

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getWinningTickets(polkadot_test_account);

		if (result.isOk) {
			// output the return value
			// console.log('Success', output.toHuman());  //Success false
			return  output.toHuman()
		} else {
			console.error('Error', result.asErr);
			return result.asErr
		}

	}
	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
}
//#endregion

//#region READ 7  get_total_pot 
const get_total_pot = async () => {

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getTotalPot(polkadot_test_account);

		if (result.isOk) {
			// output the return value
			// console.log('Success', output.toHuman());  //Success false
			const _result = JSON.parse(output.toString()).ok;
			// console.log(`result ${_result} result: `,_result);
			const alpha = new BN(`${_result}`);
			// console.log(`alpha ${alpha}`);
			const beta =  new BN( `${alpha.div(mantissa9)}` );
			// console.log(`beta ${beta}`);
			const gamma = Number(`${beta}`) / 1000;
			// console.log(`gamma ${gamma}`);
			return gamma.toFixed(3)
		} else {
			console.error('Error', result.asErr);
			return result.asErr
		}

	}
	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
}
//#endregion

//#region READ 8  get_total_net_pot 
const get_total_net_pot = async () => {

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getTotalNetPot(polkadot_test_account);

		if (result.isOk) {
			const _result = JSON.parse(output.toString()).ok;
			const alpha = new BN(`${_result}`);
			// console.log(`alpha ${alpha}`);
			const beta =  new BN( `${alpha.div(mantissa9)}` );
			// console.log(`beta ${beta}`);
			const gamma = Number(`${beta}`) / 1000;
			// console.log(`gamma ${gamma}`);
			return gamma.toFixed(3)
		} else {
			console.error('Error', result.asErr);
			return result.asErr
		}

	}
	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
}
//#endregion


//#region READ 9  get_total_fees 
const get_total_fees = async () => {

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getTotalFees(polkadot_test_account);

		if (result.isOk) {
			const _result = JSON.parse(output.toString()).ok;
			const alpha = new BN(`${_result}`);
			// console.log(`alpha ${alpha}`);
			const beta =  new BN( `${alpha.div(mantissa9)}` );
			// console.log(`beta ${beta}`);
			const gamma = Number(`${beta}`) / 1000;
			// console.log(`gamma ${gamma}`);
			return gamma.toFixed(3)
		} else {
			console.error('Error', result.asErr);
			return result.asErr
		}

	}
	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
}
//#endregion


//#region READ 10  get_hall_of_fame 
const get_hall_of_fame = async () => {

	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		const { gasRequired, storageDeposit, result, output } = await contract.query.getHallOfFame(polkadot_test_account);

		if (result.isOk) {
			// output the return value
			// console.log('Success', output.toHuman());  //Success false
			
			let resultArray = []
			const _result = JSON.parse(output.toString()).ok;
			console.log(`vvvvvvvv _result: `,_result);
			_result.forEach(elem => {

				const alpha = new BN(`${elem.prizeMoney}`);
				// console.log(`alpha ${alpha}`);
				const beta =  new BN( `${alpha.div(mantissa9)}` );
				// console.log(`beta ${beta}`);
				const gamma = Number(`${beta}`) / 1000;
				// console.log(`gamma ${gamma}`);


				let formattedElement = { 
					distanceFromTarget: `${Number(elem.distanceFromTarget)}`,
					startTime: new Date(elem.startTime).toISOString(),
					endTime: new Date(elem.endTime).toISOString(),
					timestamp: new Date(elem.timestamp).toISOString(),
					prizeMoney:  gamma,
				}
				formattedElement = Object.assign(elem, formattedElement)
				// console.log("formattedElement: ",formattedElement);
				resultArray.push(formattedElement);
			})
			return resultArray
			// return  output.toHuman()
		} else {
			console.error('Error', result.asErr);
			return result.asErr
		}

	}
	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
}
//#endregion


// W R I T E
//#region WRITE 1 start_new_game DONE
const start_new_game = async (image_hash="someimagehash", start_time=0, end_time=0, ticket_cost=0, fees_percent=0 ) => {
	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;
		console.log(`image_hash: ${image_hash} start_time: ${start_time} end_time: ${end_time} ticket_cost: ${ticket_cost} fees_percent: ${fees_percent} polkadotInjectorAddress: `,polkadotInjectorAddress);

		//DRY RUN
		const { gasRequired, storageDeposit } = await contract.query.configGame(polkadot_test_account, image_hash, Number(start_time), Number(end_time), ticket_cost, fees_percent);
		console.log("gasRequired & storageDeposit: ",gasRequired.toHuman(),storageDeposit.toHuman());

		const options = {
			gasLimit: gasRequired.refTime,
			storageDepositLimit: storageDeposit.isCharge ? storageDeposit.asCharge : null,
		}

		const tx = await contract.tx
		.configGame(options,  image_hash, start_time, end_time, ticket_cost, fees_percent)
		.signAndSend(polkadotInjectorAddress, { signer:  polkadotInjector.signer }, result => {

			if (result.status.isInBlock) {
				console.log(' =====>>> in a block');
			} else if (result.status.isFinalized) {
				console.log(' =====>>> finalized');
				console.log('result: ',JSON.stringify(result,null,"\t"));
			}
		})
  
	}
	else console.log(`PHALA API IS NOT SET UP YET`);
  
}
//#endregion


//#region WRITE 2 check_game
const check_game = async () => {
	if (phala_api && phat_games_STB) 
	{
		const contract = phat_games_STB;

		console.log(`CHECKING GAME polkadot_test_account.address: ${polkadot_test_account.address}`);

		//DRY RUN
		const { gasRequired, storageDeposit } = await contract.query.checkGame(polkadot_test_account);
		console.log("gasRequired & storageDeposit: ",gasRequired.toHuman(),storageDeposit.toHuman());

		const options = {
			gasLimit: gasRequired.refTime,
			storageDepositLimit: storageDeposit.isCharge ? storageDeposit.asCharge : null,
		}

		const tx = await contract.tx
		.checkGame(options)
		.signAndSend(polkadot_test_account, { nonce: -1 }, result => {
		// .signAndSend(polkadot_test_account.address, { signer:  polkadotInjector.signer }, result => {


			if (result.status.isInBlock) {
				console.log(' =====>>> in a block');
			} else if (result.status.isFinalized) {
				console.log(' =====>>> finalized');
				console.log('result: ',JSON.stringify(result,null,"\t"));
			}
		})
  
	}
	else console.log(`PHALA API IS NOT SET UP YET`);
  
}
//#endregion


//#region WRITE 3 submit_tickets
const submit_tickets = async (ticketsArrayOftuples) => {
	if (phala_api && phat_games_STB && ticketsArrayOftuples.length > 0) 
	{
		const contract = phat_games_STB;
		console.log(`ticketsArrayOftuples.length: ${ticketsArrayOftuples.length}`);
		
		//DRY RUN
		const { gasRequired, storageDeposit } = await contract.query.submitTickets(polkadot_test_account, ticketsArrayOftuples);
		console.log("gasRequired & storageDeposit: ",gasRequired.toHuman(),storageDeposit.toHuman());

		const options = {
			gasLimit: gasRequired.refTime,
			storageDepositLimit: storageDeposit.isCharge ? storageDeposit.asCharge : null,
			value: `${ticketsArrayOftuples.length * 1000000000000}`
		}

		const tx = await contract.tx
		.submitTickets(options, ticketsArrayOftuples)
		.signAndSend(polkadotInjectorAddress, { signer:  polkadotInjector.signer }, result => {

			if (result.status.isInBlock) {
				console.log(' =====>>> in a block');
			} else if (result.status.isFinalized) {
				console.log(' =====>>> finalized');
				console.log('result: ',JSON.stringify(result,null,"\t"));
			}
		})
  
	}
	else console.log(`PHALA API IS NOT SET UP YET ticketsArrayOftuples.length(): ${ticketsArrayOftuples.length}`);
  
}
//#endregion




// //#region PHAT_query get_my_number
// const get_my_number = async () => {

// 	if (phala_api) 
// 	{
// 		const contract = phat_contract_boiler_plate;

// 		//For queries use polkadot_test_account 
// 		const message = await contract.query.getMyNumber(polkadot_test_account);
// 		const { gasRequired, storageDeposit, result, output } = await contract.query.getMyNumber(polkadot_test_account);
// 		console.log('message :', message.output.toHuman());

// 		// The actual result from RPC as `ContractExecResult`
// 		console.log("===> result.toHuman() : ",result.toHuman());

// 		// the gas consumed for contract execution
// 		console.log("===> gasRequired.toHuman() : ",gasRequired.toHuman()); 
// 		// {refTime: '6,219,235,328', proofSize: '131,072'}

// 		// check if the call was successful
// 		if (result.isOk) {
// 		// output the return value
// 		console.log('Success', output.toHuman());  //Success false
// 		return  output.toHuman()
// 		} else {
// 		console.error('Error', result.asErr);
// 		return result.asErr
// 		}

// 	}
// 	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
// }
// //#endregion


// //#region PHAT_query get_my_message
// const get_my_message = async () => {

// 	if (phala_api) 
// 	{
// 		const contract = phat_contract_boiler_plate;
// 		const { gasRequired, storageDeposit, result, output } = await contract.query.getMyMessage(polkadot_test_account);

// 		if (result.isOk) {
// 			// output the return value
// 			console.log('Success', output.toHuman());  //Success false
// 			return  output.toHuman()
// 		} else {
// 			console.error('Error', result.asErr);
// 			return result.asErr
// 		}

// 	}
// 	else { console.log(`PHALA API IS NOT SET UP YET`); return null }
// }
// //#endregion


//#region set_my_number
const set_my_number = async (newNumber=5) => {
	if (phala_api && phat_contract_boiler_plate) 
	{
		const contract = phat_contract_boiler_plate;
		console.log(`set_my_number: ${newNumber} polkadotInjectorAddress: `,polkadotInjectorAddress);

		//DRY RUN
		const { gasRequired, storageDeposit } = await contract.query.setMyNumber(polkadot_test_account, newNumber);
		console.log("gasRequired & storageDeposit: ",gasRequired.toHuman(),storageDeposit.toHuman());

		const options = {
			gasLimit: gasRequired.refTime,
			storageDepositLimit: storageDeposit.isCharge ? storageDeposit.asCharge : null,
			value: "2000000000000"
		}
		// value: "2000000000000" is 2 PHA

		const tx = await contract.tx
		.setMyNumber(options, newNumber)
		.signAndSend(polkadotInjectorAddress, { signer:  polkadotInjector.signer }, ({ events = [], status, txHash }) => {
		  if (status.isInBlock) {
			  console.log("In Block")
		  }
		  if (status.isCompleted) {
			  console.log("Completed")
		  }
		  if (status.isFinalized) {
			console.log(`Transaction included at blockHash ${status.asFinalized}`);
			console.log(`Transaction hash ${txHash.toHex()}`);
	  
			// Loop through Vec<EventRecord> to display all events
			events.forEach(({ phase, event: { data, method, section } }) => {
			  console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
			});
		  }
		})
  
	}
	else console.log(`PHALA API IS NOT SET UP YET`);
}
//#endregion

//#region set_my_message
const set_my_message = async (newMessage="Hello Phala World") => {
	if (phala_api && phat_contract_boiler_plate) 
	{
		const contract = phat_contract_boiler_plate;
		console.log(`set_my_number: ${newMessage} polkadotInjectorAddress: `,polkadotInjectorAddress);

		//DRY RUN
		const { gasRequired, storageDeposit } = await contract.query.setMyMessage(polkadot_test_account, newMessage);
		console.log("gasRequired & storageDeposit: ",gasRequired.toHuman(),storageDeposit.toHuman());

		const options = {
			gasLimit: gasRequired.refTime,
			storageDepositLimit: storageDeposit.isCharge ? storageDeposit.asCharge : null,
		}

		const tx = await contract.tx
		.setMyMessage(options, newMessage)
		.signAndSend(polkadotInjectorAddress, { signer:  polkadotInjector.signer }, result => {

			if (result.status.isInBlock) {
				console.log(' =====>>> in a block');
			} else if (result.status.isFinalized) {
				console.log(' =====>>> finalized');
				console.log('result: ',JSON.stringify(result,null,"\t"));
			}
		})
  
	}
	else console.log(`PHALA API IS NOT SET UP YET`);
}
//#endregion



export {
          setPolkadotInjector,
          setup_SubstrateChain, 

		  set_my_number,
		  set_my_message,

		  get_account_balance,
		  get_game_stats,
		  get_players,
		  get_players_mapping,
		  get_tickets_mapping,
		  get_all_tickets,
		  get_wisdom_of_crowd_coordinates,
		  get_total_pot,
		  get_total_net_pot,
		  get_total_fees,
		  get_hall_of_fame,
		  start_new_game,
		  check_game,
		  submit_tickets,
		  get_ordered_tickets,
		  get_winning_tickets,

       };