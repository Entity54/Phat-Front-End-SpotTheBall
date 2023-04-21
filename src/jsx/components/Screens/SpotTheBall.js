import React,{Fragment,useContext, useState, useEffect} from 'react';
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import { ThemeContext } from "../../../context/ThemeContext";
import DatePicker  from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import golf from "../../../images/golf.jpg";
import stbtitle from "../../../images/stbtitle.png";

//TODO load image from AWS-S3


import { pallet_addNewVotedJob,
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
} from "../../../Setup";


// const CoinChart = loadable(() =>
//   pMinDelay(import("../Boltz/MyWallet/CoinChart"), 1000)
// );


const MyWallet = () => {
	const { background } = useContext(ThemeContext);

	const [proposalHash, setProposalHash] = useState("");
	
	const [title, setTitle] = useState("");
	const [inputApplicantAddress, setInputApplicantAddress] = useState("");
	const [requestedToken, setRequestedToken] = useState("DOT");
	const [denominatedToken, setDenominatedToken] = useState("DOT");
	const [tokenAmount, setTokenAmount] = useState("");
	const [paymentType, setPaymentType] = useState("OneOff");   // OneOff / Installments
	const [paymentDate, setPaymentDate] = useState(Date.now() + 30000);
	const [payee, setPayee] = useState("");
	const [numOfInstallements, setNumOfInstallements] = useState("");
	const [installmentPeriod, setInstallmentPeriod] = useState("");

	const [coordinates, setCoordinates] = useState({x: "", y: ""});

	const [phala_account_balance, setPhala_account_balance] = useState("");
	const [phala_game_stats, setPhala_game_stats] = useState({state: false, imageHash:"", startTime: "", endTime: "", ticketPrice: "", feesPerccent: ""});
	// const [coordinates, setCoordinates] = useState({x: "", y: ""});
	const [coordinatesX, setCoordinatesX] = useState("");
	const [coordinatesY, setCoordinatesY] = useState("");
	const [tickets, setTickets] = useState([]);

	const [potSize, setPotSize] = useState("");
	const [fees, setFees] = useState("");
	const [payout, setPayout] = useState("");

	const [ticket1, setTicket1] = useState("");
	const [ticket2, setTicket2] = useState("");
	const [ticket3, setTicket3] = useState("");
	const [ticket4, setTicket4] = useState("");
	const [ticket5, setTicket5] = useState("");

	const [totalCost, setTotalCost] = useState("");







	const phala_get_account_balance = async (account) => {
		const balance = await get_account_balance(account);
		console.log(`phala_get_account_balance for acocunt: ${account} is ${balance}`);
		setPhala_account_balance(balance);
		// return balance;
	}

	const phala_get_game_stats = async () => {
		const output = await get_game_stats();
		// console.log(`|||>>> phala_get_game_stats for output: ${typeof output}`,JSON.stringify(output));
		// console.log(`|||>>> phala_get_game_stats for output: `,output.Ok);
		console.log(`|||>>> phala_get_game_stats for output: ${output.Ok[0]}`);  //state
		console.log(`|||>>> phala_get_game_stats for output: ${output.Ok[1]}`);  //image hash
		console.log(`|||>>> phala_get_game_stats for output: ${output.Ok[2]}`);  //start time
		console.log(`|||>>> phala_get_game_stats for output: ${output.Ok[3]}`);  //end time
		console.log(`|||>>> phala_get_game_stats for output: ${output.Ok[4]}`);  //ticket price
		console.log(`|||>>> phala_get_game_stats for output: ${output.Ok[5]}`);  //fees percent
		setPhala_game_stats({state: output.Ok[0], imageHash: output.Ok[1], startTime: output.Ok[2], endTime: output.Ok[3], ticketPrice: output.Ok[4], feesPerccent: output.Ok[5]})


		// return balance;
	}

	// const phala_get_players = async () => {
	// 	const output = await get_players();
	// 	// console.log(`|||>>> phala_get_players for output: ${output}`);
	// 		// console.log(`|||>>> phala_get_game_stats for output: `,output.Ok);
	// 	for (let i=0; i<output.Ok.length; i++) {
	// 		console.log(`|||>>> phala_get_players PLAYER ${i} Address: ${output.Ok[i]}`);  

	// 	}
	// 	return output.Ok;
	// }

	// const phala_get_players_mapping = async () => {
	// 	const output = await get_players_mapping();
	// 	console.log(`|||>>> phala_get_players_mapping for output: ${output}`);
	// 	// return balance;
	// }

	// const phala_get_tickets_mapping = async () => {
	// 	const output = await get_tickets_mapping();
	// 	console.log(`|||>>> phala_get_tickets_mapping for output: ${output}`);
	// 	// return balance;
	// }

	// const phala_get_all_tickets = async () => {
	// 	const output = await get_all_tickets();
	// 	// console.log(`|||>>> phala_get_all_tickets for output: ${output}`);
	// 		// console.log(`|||>>> phala_get_game_stats for output: `,output.Ok);

	// 	for (let i=0; i<output.Ok.length; i++) {
	// 		console.log(`|||>>> phala_get_all_tickets TICKET ${i} X: ${output.Ok[i][0]} Y: ${output.Ok[i][1]}`);  

	// 	}
	// 	return output.Ok;
	// }

	const phala_get_wisdom_of_crowd_coordinates = async () => {
		const output = await get_wisdom_of_crowd_coordinates();
		console.log(`|||>>> phala_get_wisdom_of_crowd_coordinates for output: ${output}`);
		// return balance;
	}

	const phala_get_total_pot = async () => {
		const output = await get_total_pot();
		console.log(`|||>>> phala_get_total_pot for output: ${output}`);
		setPotSize(output);
	}

	const phala_get_total_net_pot = async () => {
		const output = await get_total_net_pot();
		setPayout(output);
	}

	const phala_get_total_fees = async () => {
		const output = await get_total_fees();
		setFees(output);
	}

	
	// const phala_get_hall_of_fame = async () => {
	// 	const output = await get_hall_of_fame();
	// 	console.log(`|||>>> phala_get_hall_of_fame for output: ${output}`);
	// 	// return balance;
	// }



	// const phala_start_new_game = async () => {
	// 	const image_hash = "someimagehashfrom4everlandIPFS"
	// 	const start_time = Date.now(); //1682088239631
	// 	const duration_mins = 15;
	// 	const end_time =  start_time + duration_mins*60*1000;
	// 	console.log(`|||>>> phala_start_new_game image_hash: ${image_hash} start_time: ${start_time} end_time: ${end_time}`);

	// 	await start_new_game(image_hash, start_time, end_time);
	// }

	// const phala_check_game = async () => {
	// 	const output = await check_game();
	// 	console.log(`|||>>> phala_check_game`);
	// }

	const play_coordinates = (whichTicket) => {
		console.log("play_coordinates");		

		const ticket_value = `x:  ${coordinates.x}    y:  ${coordinates.y}`;
		if (whichTicket==1)
		{
			setTicket1(ticket_value)
		}
		else if (whichTicket==2)
		{
			setTicket2(ticket_value)
		}
		else if (whichTicket==3)
		{
			setTicket3(ticket_value)
		}
		else if (whichTicket==4)
		{
			setTicket4(ticket_value)
		}
		else if (whichTicket==5)
		{
			setTicket5(ticket_value)
		}
		phala_play_ticket(coordinates.x, coordinates.y)
	}

	const phala_play_ticket =  (newTicket_X,newTicket_Y) => {
		let newTicket = [newTicket_X,newTicket_Y];
		console.log(`|||>>> phala_play_ticket newTicket: `,newTicket);
		setTickets([...tickets,newTicket]);
		setTotalCost((tickets.length + 1) * 1);
	}

	const phala_submit_tickets = async () => {
		console.log(`|||>>> phala_submit_tickets tickets: `,tickets);
		if (tickets.length > 0)
		{
			await submit_tickets(tickets);
			setTickets([]);
			setTicket1("");
			setTicket2("");
			setTicket3("");
			setTicket4("");
			setTicket5("");
		}
	}


	const addNewJob = () => {
		// console.log(`addNewJob => inputApplicantAddress: ${inputApplicantAddress} proposalHash: ${proposalHash}
		// title: ${title} requestedToken: ${requestedToken} denominatedToken: ${denominatedToken} tokenAmount: ${tokenAmount}
		// paymentType: ${paymentType} numOfInstallements: ${numOfInstallements} installmentPeriod: ${installmentPeriod}
		// `) 

		// addNewJob => inputApplicantAddress: 0x123 proposalHash: oxabc
		// title: Translation requestedToken: DOT denominatedToken: USDC tokenAmount: 111
		// paymentType: OneOff numOfInstallements: 2 installmentPeriod: 
        
		// const paymentDateInMilliseconds = paymentDate;      //Date.now() + 1000;   //1676543500090

	 
		// let installmentPeriodMilliseconds = 60000;
		// if (installmentPeriod==="Every 1 Minute")
		// {
		// 	installmentPeriodMilliseconds = 60000;
		// }
		// else if (installmentPeriod==="Every 7 Days")
		// {
		// 	installmentPeriodMilliseconds = 60000 * 60 * 24 * 7;

		// }
		// else if (installmentPeriod==="Every 30 Days")
		// {
		// 	installmentPeriodMilliseconds =  60000 * 60 * 24 * 30;
			
		// }
		// else if (installmentPeriod==="Every 90 Days")
		// {
		// 	installmentPeriodMilliseconds =  60000 * 60 * 24 * 90;
			
		// }
		// else if (installmentPeriod==="Every 365 Days")
		// {
		// 	installmentPeriodMilliseconds =  60000 * 60 * 24 * 365;
			
		// }


		// if (
		// 	title!=="" && inputApplicantAddress!=="" && tokenAmount!==""  && payee!=="" && paymentDateInMilliseconds
		// 	&& (paymentType==="OneOff" || (numOfInstallements!=="" && installmentPeriodMilliseconds!==""))
		// 	&& proposalHash!==""
		// ) 
		// {

		// 	const valueInUsd = denominatedToken==="DOT"? false : true;
		// 	const typeofPayment = paymentType==="OneOff"? 0 : 1;
		// 	const payeeAccounts_array = [payee];

		// 	let paymentSchedule_timestamp_array=[];
		// 	if (paymentType==="OneOff")
		// 	{
		// 		paymentSchedule_timestamp_array.push(paymentDateInMilliseconds);
		// 	}
		// 	else 
		// 	{
		// 		for (let i=0; i<=(numOfInstallements-1); i++)
		// 		{
		// 			paymentSchedule_timestamp_array.push(paymentDateInMilliseconds + i * installmentPeriodMilliseconds);
		// 		}
		// 	}
			
		// 	console.log(`paymentDateInMilliseconds: `,paymentDateInMilliseconds);

		// 	pallet_addNewVotedJob(title, proposalHash, inputApplicantAddress, requestedToken, valueInUsd, tokenAmount, 
		// 		typeofPayment, paymentSchedule_timestamp_array, payeeAccounts_array 
		// 	);

		// } else console.log(`ApplicationScreen: There is a missign value in addNewJob`);

	}

	const getPosition = (e) => {
			var rect = e.target.getBoundingClientRect();
			var x = e.clientX - rect.left;
			var y = e.clientY - rect.top;
			console.log(`=========> X: ${x} . Y: ${y}`);
		    setCoordinates({x: parseInt(x), y: parseInt(y) });
			setCoordinatesX(parseInt(x));
			setCoordinatesY(parseInt(y));
	}
 

	return(
		<Fragment>
			<div className="col-xl-12 col-lg-12">
				<div className="card bg-gradient-1" style={{backgroundColor:""}}>
					<div className="card-header mt-4">
						<div className="col-xl-8 col-lg-6"style={{alignItems:"center", display:"flex", justifyContent:"center"}}>
							<img alt="images" width={1550} src={stbtitle} ></img>
						</div>	
						<div className="col-xl-2 col-lg-6"style={{backgroundColor:""}}
									onClick = { () => phala_get_account_balance()}

						>
							<div  className="coin-holding" style={{height:"80px", marginBottom:"15px", backgroundColor:"#2a2e47"}}>
								<div className="col-xl-6 col-xxl-3"style={{backgroundColor:""}}>
									<div className="mb-2">
										<div className="align-items-center">
											<div className="ms-3 pt-2">
												<p className="mb-0 op-6 fs-24" >Balance</p>
											</div>
										</div>
									</div>
								</div>
								<div className="col-xl-6 col-xxl-3"  style={{backgroundColor:""}}>
									<div className="mb-2" style={{backgroundColor:""}}> 
										<div className="align-items-center"  style={{backgroundColor:""}}>
											<div className="ms-0 pt-2" style={{backgroundColor:"", width:"100%"}}>
												<input type="text" disabled readOnly value = {phala_account_balance} placeholder="" className="form-control fs-16" style={{color:"white",  textAlign:"center",  }} />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="card-body" style={{backgroundColor:""}}>
						<div className="row">
							<div className="col-xl-8 col-lg-8" style={{backgroundColor:""}}>
								<div class="rect" id="rect" style={{alignItems:"center", display:"flex", justifyContent:"center", margin: "10px", cursor:"crosshair"  }}> 
									<img alt="images" width={1550} height={1000} src={golf} border= '5px solid rgba(42,46,71,0.3)'
										onClick = { (e) => getPosition(e)}
									/> 
								</div>
								<div className="row">
									<div className="col-xl-3 col-lg-6"style={{backgroundColor:""}}></div>
									<div className="col-xl-2 col-lg-6"style={{backgroundColor:""}}
                									onClick = { () => phala_get_total_pot()}
									>
										<div  className="coin-holding" style={{height:"80px", marginBottom:"15px", border:"2px solid orange", backgroundColor:"#2a2e47"}}>
											<div className="col-xl-6 col-xxl-3"style={{backgroundColor:""}}>
												<div className="mb-2">
													<div className="align-items-center">
														<div className="ms-3 pt-2">
															<p className="mb-0 op-6 fs-24 text-orange" >Pot Size</p>
														</div>
													</div>
												</div>
											</div>
											<div className="col-xl-6 col-xxl-3"  style={{backgroundColor:""}}>
												<div className="mb-2" style={{backgroundColor:""}}> 
													<div className="align-items-center"  style={{backgroundColor:""}}>
														<div className="ms-0 pt-2" style={{backgroundColor:"", width:"100%"}}>
															<input type="text" disabled readOnly value = {potSize} placeholder="" className="form-control fs-16" style={{color:"white",  textAlign:"center",  }} />
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="col-xl-2 col-lg-6"style={{backgroundColor:""}}
                									onClick = { () => phala_get_total_fees()}
									>
										<div  className="coin-holding" style={{height:"80px", marginBottom:"15px", border:"2px solid orange", backgroundColor:"#2a2e47"}}>
											<div className="col-xl-6 col-xxl-3"style={{backgroundColor:""}}>
												<div className="mb-2">
													<div className="align-items-center">
														<div className="ms-3 pt-2">
															<p className="mb-0 op-6 fs-24 text-orange" >Fees</p>
														</div>
													</div>
												</div>
											</div>
											<div className="col-xl-6 col-xxl-3"  style={{backgroundColor:""}}>
												<div className="mb-2" style={{backgroundColor:""}}> 
													<div className="align-items-center"  style={{backgroundColor:""}}>
														<div className="ms-0 pt-2" style={{backgroundColor:"", width:"100%"}}>
															<input type="text" disabled readOnly value = {fees} placeholder="" className="form-control fs-16" style={{color:"white",  textAlign:"center",  }} />
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="col-xl-2 col-lg-6"style={{backgroundColor:""}}
                									onClick = { () => phala_get_total_net_pot()}
									
									>
										<div  className="coin-holding" style={{height:"80px", marginBottom:"15px", border:"2px solid orange", backgroundColor:"#2a2e47"}}>
											<div className="col-xl-6 col-xxl-3"style={{backgroundColor:""}}>
												<div className="mb-2">
													<div className="align-items-center">
														<div className="ms-3 pt-2">
															<p className="mb-0 op-6 fs-24 text-orange" >Payout</p>
														</div>
													</div>
												</div>
											</div>
											<div className="col-xl-6 col-xxl-3"  style={{backgroundColor:""}}>
												<div className="mb-2" style={{backgroundColor:""}}> 
													<div className="align-items-center"  style={{backgroundColor:""}}>
														<div className="ms-0 pt-2" style={{backgroundColor:"", width:"100%"}}>
															<input type="text" disabled readOnly value = {payout} placeholder="" className="form-control fs-16" style={{color:"white",  textAlign:"center",  }} />
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="col-xl-3 col-lg-6"style={{backgroundColor:""}}></div>
								</div>
							</div>
							<div className="col-xl-4 col-lg-3" style={{backgroundColor:""}}>
								<div className="row">
									<div className="form-group mx-4 my-2 col-md-6 text-white fs-18">
										<label>Current Coordinates</label>
										<input
											type="textarea"
											id="area"
											className="form-control fs-18 text-center"
											placeholder="Current Coordinates"
											value={`x:  ${coordinates.x}    y:  ${coordinates.y}`}
											// onChange={(event) => (event.target.value)}
										/>
									</div>
									{/* <div className="form-group col-md-2 d-flex align-items-center p-0"style={{backgroundColor:""}}>
										<button type="submit" className="btn btn-primary text-center mx-0"style={{marginTop:"32px"}}>
											Play
										</button>
									</div> */}
								</div>

								<div className="row">
									<div className="form-group mx-4 col-md-6 text-white fs-18"style={{marginTop:"100px"}}>
										<label>Ticket 1</label>
										<input
											type="textarea"
											className="form-control fs-18 text-center"
											placeholder=""
											value={ticket1}
										/>
									</div>
									<div className="form-group col-md-2 d-flex align-items-center p-0"style={{backgroundColor:""}}>
										<button type="submit" className="btn btn-primary text-center mx-0"style={{marginTop:"132px"}} 
									           onClick = { () => play_coordinates(1)}
										>
											Play
										</button>
									</div>
									<div className="form-group mx-4 my-2 col-md-6 text-white fs-18">
										<label>Ticket 2</label>
										<input
											type="textarea"
											className="form-control fs-18 text-center"
											placeholder=""
											value={ticket2}
										/>
									</div>
									<div className="form-group col-md-2 d-flex align-items-center p-0"style={{backgroundColor:""}}>
										<button type="submit" className="btn btn-primary text-center mx-0"style={{marginTop:"32px"}}
									           onClick = { () => play_coordinates(2)}
										>
											Play
										</button>
									</div>
									<div className="form-group mx-4 my-2 col-md-6 text-white fs-18">
										<label>Ticket 3</label>
										<input
											type="textarea"
											className="form-control fs-18 text-center"
											placeholder=""
											value={ticket3}
										/>
									</div>
									<div className="form-group col-md-2 d-flex align-items-center p-0"style={{backgroundColor:""}}>
										<button type="submit" className="btn btn-primary text-center mx-0"style={{marginTop:"32px"}}
									           onClick = { () => play_coordinates(3)}
										
										>
											Play
										</button>
									</div>
									<div className="form-group mx-4 my-2 col-md-6 text-white fs-18">
										<label>Ticket 4</label>
										<input
											type="textarea"
											className="form-control fs-18 text-center"
											placeholder=""
											value={ticket4}
										/>
									</div>
									<div className="form-group col-md-2 d-flex align-items-center p-0"style={{backgroundColor:""}}>
										<button type="submit" className="btn btn-primary text-center mx-0"style={{marginTop:"32px"}}
									           onClick = { () => play_coordinates(4)}
										
										>
											Play
										</button>
									</div>
									<div className="form-group mx-4 my-2 col-md-6 text-white fs-18">
										<label>Ticket 5</label>
										<input
											type="textarea"
											className="form-control fs-18 text-center"
											placeholder=""
											value={ticket5}
										/>
									</div>
									<div className="form-group col-md-2 d-flex align-items-center p-0"style={{backgroundColor:""}}>
										<button type="submit" className="btn btn-primary text-center mx-0"style={{marginTop:"32px"}}
									           onClick = { () => play_coordinates(5)}
										
										>
											Play
										</button>
									</div>
									<div className="form-group mx-4 my-2 col-md-4 text-white fs-18">
										<label>Total Cost ( 1 PHA = 1 Ticket )</label>
										<input
											type="textarea"
											className="form-control fs-18 text-center"
											placeholder=""
											value={totalCost}
										/>
									</div>
									<div className="form-group col-md-4 d-flex align-items-center p-0"style={{backgroundColor:""}}>
										<button type="submit" className="btn btn-primary text-center mx-0"style={{marginTop:"32px", width:"50%"}}
									           onClick = { () => phala_submit_tickets()}
										>
											Submit
										</button>
									</div>
								</div>
								<div className="col-xl-10 col-xxl-12">
									<div className="card"style={{backgroundColor:"#2a2e47", marginTop:"50px"}}>
										<div className="card-body" style={{height:"", backgroundColor:""}}>
											<div className="row">
												<div className="form-group mx-4 col-md-8 text-white fs-18"style={{marginTop:""}}>
													<label>Wisdom Of The Crowd Answer</label>
													<input
														type="textarea"
														id="area"
														className="form-control fs-18 text-center"
														placeholder="Wait For Competition End"
														// value={`x:  ${coordinates.x}    y:  ${coordinates.y}`}
														value={""}
													/>
												</div>
												<div className="form-group mx-4 col-md-8 text-white fs-18 mt-4"style={{marginTop:""}}>
													<label>Winning Entry</label>
													<input
														type="textarea"
														id="area"
														className="form-control fs-18 text-center"
														placeholder="Wait For Competition End"
														// value={`x:  ${coordinates.x}    y:  ${coordinates.y}`}
														value={""}
													/>
												</div>
												<div className="form-group col-md-3 d-flex align-items-center p-0"style={{backgroundColor:""}}>
													<button type="submit" className="btn btn-warning text-center mx-0 px-3"style={{marginBottom:"50px", marginTop:""}}>
														Show On Screen
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	)
}		
export default MyWallet;