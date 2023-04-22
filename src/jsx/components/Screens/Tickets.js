import React,{Fragment,useContext, useState, useEffect} from 'react';
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import { ThemeContext } from "../../../context/ThemeContext";
import currentcomptitle from "../../../images/currentcomptitle.png";
import halloffametitle from "../../../images/halloffametitle.png";

import {
  Row,
  Col,
  Card,
  Table,
  Badge,
  Dropdown,
  ProgressBar,
} from "react-bootstrap";
import { Link } from "react-router-dom";

import { 
	get_game_stats,
	get_tickets_mapping,
	get_hall_of_fame,
	start_new_game,
	get_ordered_tickets,
} from "../../../Setup";
 



const Tickets = ({ api,  blockHeader }) => {
	const { background } = useContext(ThemeContext);
	const [phala_game_stats, setPhala_game_stats] = useState({state: false, imageHash:"", startTime: "", endTime: "", ticketPrice: "", feesPerccent: "", timeLeft: 0});
	const [gameState, setGameState] = useState(false);
	const [ordered_Tickets, setOrdered_Tickets] = useState([]);
	const [hallOfFameTickets, setHallOfFameTickets] = useState([]);


	const phala_get_game_stats = async () => {
		const output = await get_game_stats();
		// console.log(`|||>>> phala_get_game_stats for output: ${typeof output}`,JSON.stringify(output));
		// console.log(`|||>>> phala_get_game_stats for output: `,output.Ok);
		// console.log(`|||>>> phala_get_game_stats for output: ${output.Ok[0]}`);  //state
		// console.log(`|||>>> phala_get_game_stats for output: ${output.Ok[1]}`);  //image hash
		// console.log(`|||>>> phala_get_game_stats for output: ${output.Ok[2]}`);  //start time
		// console.log(`|||>>> phala_get_game_stats for output: ${output.Ok[3]}`);  //end time
		// console.log(`|||>>> phala_get_game_stats for output: ${output.Ok[4]}`);  //ticket price
		// console.log(`|||>>> phala_get_game_stats for output: ${output.Ok[5]}`);  //fees percent
		const current_time = Date.now();
		let startTime = Number(output.Ok[2].split(",").join(''));
		let endTime = Number((output.Ok[3].split(",")).join(''));
		const timeLeft = Math.round((endTime - current_time) / 60000);
		// console.log(`current_time: ${current_time} timeLeft: ${timeLeft}  Number(output.Ok[3]: ${Number(output.Ok[3])}`);

		setPhala_game_stats({state: output.Ok[0], imageHash: output.Ok[1], startTime: new Date(startTime).toISOString(), endTime: new Date(endTime).toISOString(), ticketPrice: output.Ok[4], feesPerccent: output.Ok[5], timeLeft: timeLeft>0?timeLeft:0 });
		setGameState(output.Ok[0]);

		return output.Ok[0];
	}

	const phala_start_new_game = async () => {

		const game_state = await phala_get_game_stats();
		if (game_state) {
			console.log(`A game is currently under way. Cannot start a new game until the current one finishes. Wait for 15mins`);
		}
		else {
			const image_hash = "someimagehashfrom4everlandIPFS"
			const start_time = Date.now(); //1682088239631
			const duration_mins = 15;
			const end_time =  start_time + duration_mins*60*1000;
			console.log(`|||>>> phala_start_new_game image_hash: ${image_hash} start_time: ${start_time} end_time: ${end_time}`);
	
			await start_new_game(image_hash, start_time, end_time);
		}
	}

	const phala_get_ordered_tickets = async () => {
		const output = await get_ordered_tickets();
		let orderedTickets = [];
		for (let i=1; i<output.Ok.length; i++) {
			// console.log(`|||>>> phala_get_all_tickets TICKET ${i} X: ${output.Ok[i][0]} Y: ${output.Ok[i][1]}`);  
			const ticket = await phala_get_tickets_mapping(i);
			// {ticketId: '1', owner: '464inykovjdRPhMhW2zbJ47iA8qYSmPWqKLkaEgH2xc6SQ4c', ticketsCoordinates: ['1,127', '301'], distanceFromTarget: '0'}
			orderedTickets.push(ticket);
		}
		setOrdered_Tickets(orderedTickets);
		return orderedTickets;
	}

	const phala_get_tickets_mapping = async (id) => {
		// console.log(`|||>>> phala_get_tickets_mapping is running`);
		const output = await get_tickets_mapping(id);
		// console.log(`|||>>> phala_get_game_stats for output: `,output.Ok);
		// {ticketId: '1', owner: '464inykovjdRPhMhW2zbJ47iA8qYSmPWqKLkaEgH2xc6SQ4c', ticketsCoordinates: Array(2), distanceFromTarget: '0'}
		// ['1,127', '301']
		return output.Ok;
	}

	const phala_get_hall_of_fame = async () => {
		const output = await get_hall_of_fame();
		// console.log(`|||>>> phala_get_hall_of_fame for output: ${output}`);
		// console.log(`|||>>> phala_get_game_stats for output: `,output.Ok);
		setHallOfFameTickets(output);
	}


	useEffect(() => {
		const getSnapShot = async () => {
			if (blockHeader && blockHeader.number && ((Number(blockHeader.number)%2) ===0) )
			{
				// console.log(`updating Tickets   at Block Number: ${blockHeader.number}`);
				await phala_get_game_stats();
			    await phala_get_ordered_tickets();
				await phala_get_hall_of_fame();
			}
		}
		getSnapShot();
	},[blockHeader])

	useEffect(() => {
		if (api) 
		{
			phala_get_game_stats();
			phala_get_ordered_tickets();
			phala_get_hall_of_fame();
		}
	},[api]) 


	return(
		<Fragment>
			<div className="row" style={{ height:"50vh"}}>
				<Col lg={12}>
					<Card className="bg-gradient-1 mb-1">
						<Card.Header>
							{/* <p className="fs-24 mb-0" style={{color:"#AEAEAE"}}>Current Competition</p> */}
							<img alt="images" height={60} src={currentcomptitle} ></img>
						</Card.Header>
						<Card.Body className="fs-24 text-center">
							<div className="row mb-4">
								<div className="form-group col-md-3 d-flex align-items-center p-0"style={{backgroundColor:""}}>

									<button type="submit" className="btn btn-primary text-center mx-4"style={{backgroundColor:`${gameState?"grey":"green"}`, marginTop:"30px", width:"100%"}}  disabled={gameState}
									    onClick = { () => phala_start_new_game()}
									>
										Start
									</button>
								</div>
								<div className="col-md-3 text-white fs-18"style={{backgroundColor:""}}>
									<label>Start Time</label>
									<input
										type="textarea"
										className="form-control fs-18 text-center"
										placeholder=""
										value={phala_game_stats.startTime}
									/>
								</div>
								<div className="col-md-3 text-white fs-18"style={{backgroundColor:""}}>
									<label>End Time</label>
									<input
										type="textarea"
										className="form-control fs-18 text-center"
										placeholder=""
										value={phala_game_stats.endTime}
									/>
								</div>
								<div className="col-md-3 text-white fs-18"style={{backgroundColor:""}}>
									<label>Remaining</label>
									<input
										type="textarea"
										className="form-control fs-18 text-center"
										placeholder=""
										value={phala_game_stats.timeLeft}
									/>
								</div>
							</div>
							<Table responsive bordered className="verticle-middle table-hover"style={{border:"solid"}}>
								<thead>
									<tr className="text-center" style={{border:"solid"}}>
									    <th scope="col" style={{color:"#AEAEAE"}}>Ticket Id</th>
										<th scope="col" style={{color:"#AEAEAE"}}>Owner</th>
										<th scope="col" style={{color:"#AEAEAE"}}>Ticket Coordinates</th>
										<th scope="col" style={{color:"#AEAEAE"}}>Distance From Target</th>
									</tr>
								</thead>
								<tbody className="fs-16 text-center">
									{ordered_Tickets.map((data,index)=>(	
									<tr  key={index} >
										<td>{data.ticketId}</td>
										<td>{data.owner}</td>
										<td>{`x: ${data.ticketsCoordinates[0]} y: ${data.ticketsCoordinates[1]}`}</td>
										<td>{data.distanceFromTarget}</td>
									</tr>
								))}
								</tbody>
							</Table>
						</Card.Body>
					</Card>
				</Col>

			</div>	
			<div className="row"  style={{ height:"40vh"}}>

				<Col lg={12}>
					<Card className="bg-gradient-1 mb-1">
						<Card.Header>
						<img alt="images" height={45} src={halloffametitle} ></img>
						</Card.Header>
						<Card.Body>
							<Table responsive bordered className="verticle-middle table-hover"style={{border:"solid"}}>
								<thead>
								<tr className="text-center" style={{border:"solid"}}>
									<th scope="col" style={{color:"#AEAEAE"}}>Owner</th>
									<th scope="col" style={{color:"#AEAEAE"}}>Ticket Coordinates</th>
									<th scope="col" style={{color:"#AEAEAE"}}>Distance From Target</th>
									<th scope="col" style={{color:"#AEAEAE"}}>Prize Money</th>
									<th scope="col" style={{color:"#AEAEAE"}}>Timestamp</th>
									<th scope="col" style={{color:"#AEAEAE"}}>Competition Num</th>
									<th scope="col" style={{color:"#AEAEAE"}}>Start Time</th>
									<th scope="col" style={{color:"#AEAEAE"}}>End Time</th>
									<th scope="col" style={{color:"#AEAEAE"}}>Num Of Tickets</th>
									<th scope="col" style={{color:"#AEAEAE"}}>Num Of Players</th>
								</tr>
								</thead>
								<tbody className="fs-16 text-center">
									{hallOfFameTickets.map((data,index)=>(	
										<tr  key={index} >
											<td>{data.owner}</td>
										    <td>{`x: ${data.ticketsCoordinates[0]} y: ${data.ticketsCoordinates[1]}`}</td>
											<td>{data.distanceFromTarget}</td>
											<td>{data.prizeMoney}</td>
											<td>{data.timestamp}</td>
											<td>{data.competitionNumber}</td>
											<td>{data.startTime}</td>
											<td>{data.endTime}</td>
											<td>{data.numberOfTickets}</td>
											<td>{data.numberOfPlayers}</td>
										</tr>
									))}
								</tbody>
							</Table>
						</Card.Body>
					</Card>
				</Col>
			</div>
		</Fragment>
	)

}		
export default Tickets;