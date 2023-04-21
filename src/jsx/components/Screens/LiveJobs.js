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

import { tm_getOpenJobIds, tm_getPendingJobsIds, tm_getCompletedJobsIds, tm_getJobInfo } from "../../../Setup";
 


// const CoinChart = loadable(() =>
//   pMinDelay(import("../Boltz/MyWallet/CoinChart"), 1000)
// );

const LiveJobs = ({ astar_api,  blockHeader }) => {
	const { background } = useContext(ThemeContext);
	const [openJobsArray, setOpenJobsArray] = useState([]);
	const [pendingJobsArray, setPendingJobsArray] = useState([]);
	const [completedJobsArray, setCompletedJobsArray] = useState([]);


	const getOpenJobIds_tm = async () => {
		const levelsArray = await tm_getOpenJobIds();

		console.log(`LiveJobs|> getOpenJobIds_tm result: `,levelsArray);  //['1', '2']

		let  _openJobsArray = [];

		for (let i=0; i<levelsArray.length; i++)
		{
				const result = await tm_getJobInfo(levelsArray[i]);
				console.log("===========> result: ",result);  
				_openJobsArray.push(result);
              
		}
		console.log(`LiveJobs|> getOpenJobIds_tm _openJobsArray: `,_openJobsArray);    
		setOpenJobsArray(_openJobsArray);  

	}

	const getPendingJobsIds_tm = async () => {
		const levelsArray = await tm_getPendingJobsIds();

		console.log(" &&&&&&&&&&&&&&&&&&&&&&&&&& ")
		console.log(`LiveJobs|> getPendingJobsIds_tm result: `,levelsArray); 

		let  _pendingJobsArray = [];

		for (let i=0; i<levelsArray.length; i++)
		{
				const result = await tm_getJobInfo(levelsArray[i]);
				console.log("===========> result: ",result);  
				_pendingJobsArray.push(result);
		}
		console.log(`LiveJobs|> getOpenJobIds_tm _pendingJobsArray: `,_pendingJobsArray); 
		setPendingJobsArray(_pendingJobsArray);  
	}

	const getCompletedJobsIds_tm = async () => {
		const levelsArray = await tm_getCompletedJobsIds();

		console.log(" &&&&&&&&&&&&&&&&&&&&&&&&&& ")
		console.log(`LiveJobs|> getCompletedJobsIds_tm result: `,levelsArray);

		let  _completedJobsArray = [];

		for (let i=0; i<levelsArray.length; i++)
		{
				const result = await tm_getJobInfo(levelsArray[i]);
				console.log("===========> result: ",result);  
				_completedJobsArray.push(result);
              
		}
		console.log(`LiveJobs|> getOpenJobIds_tm _completedJobsArray: `,_completedJobsArray); 
		setCompletedJobsArray(_completedJobsArray); 
	}


	useEffect(() => {
		const getSnapShot = async () => {
			if (blockHeader && blockHeader.number && ((Number(blockHeader.number)%2) ===0) )
			{
				console.log(`updating Live jobs at Block Number: ${blockHeader.number}`);
				await getOpenJobIds_tm();
				await getPendingJobsIds_tm();
				await getCompletedJobsIds_tm();
			}
		}
		getSnapShot();
	},[blockHeader])

	useEffect(() => {
		if (astar_api) 
		{
			getOpenJobIds_tm();
			getPendingJobsIds_tm();
			getCompletedJobsIds_tm();
		}
	// },[])
	},[astar_api]) 


	return(
		<Fragment>
			<div className="row">
				<Col lg={3}>
					<Card className="bg-gradient-1 mb-1">
						<Card.Header>
							{/* <p className="fs-24 mb-0" style={{color:"#AEAEAE"}}>Current Competition</p> */}
							<img alt="images" height={60} src={currentcomptitle} ></img>
						</Card.Header>
						<Card.Body className="fs-24 text-center">
							<div className="row mb-4">
								<div className="form-group col-md-4 d-flex align-items-center p-0"style={{backgroundColor:""}}>
									<button type="submit" className="btn btn-primary text-center mx-4"style={{marginTop:"30px", width:"100%"}}>
										Start
									</button>
								</div>
								<div className="col-md-4 text-white fs-18"style={{backgroundColor:""}}>
									<label>Start Time</label>
									<input
										type="textarea"
										className="form-control fs-18 text-center"
										placeholder=""
										// value={}
										// onChange={(event) => (event.target.value)}
									/>
								</div>
								<div className="col-md-4 text-white fs-18"style={{backgroundColor:""}}>
									<label>End Time</label>
									<input
										type="textarea"
										className="form-control fs-18 text-center"
										placeholder=""
										// value={}
										// onChange={(event) => (event.target.value)}
									/>
								</div>
							</div>
							<Table responsive bordered className="verticle-middle table-hover"style={{border:"solid"}}>
								<thead>
									<tr className="text-center" style={{border:"solid"}}>
										<th scope="col" style={{color:"#AEAEAE"}}>Owner</th>
										<th scope="col" style={{color:"#AEAEAE"}}>Ticket Coordinates</th>
										<th scope="col" style={{color:"#AEAEAE"}}>Distance From Target</th>
									</tr>
								</thead>
								<tbody className="fs-16 text-center">
									{pendingJobsArray.map((data,index)=>(	
									<tr  key={index} >
										<td>{data.id}</td>
										<td>{data.title}</td>
										<td>{data.paymentType}</td>
									</tr>
								))}
								</tbody>
							</Table>
						</Card.Body>
					</Card>
				</Col>
				<Col lg={9}>
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
									{pendingJobsArray.map((data,index)=>(	
										<tr  key={index} >
											<td>{data.id}</td>
											<td>{data.title}</td>
											<td>{data.paymentType}</td>
											<td>{data.first_payment_date}</td>
											<td>{data.paymentToken}</td>

											<td>{data.denomnatedinUSD? "Yes" : "No"}</td>
											<td>{data.amount}</td>
											<td>{data.payee}</td>
											<td>
											<ProgressBar now={data.progress} variant="warning" />
											</td>
											<td>
											<Badge variant="warning light">{data.progress}%</Badge>
											</td>
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
export default LiveJobs;