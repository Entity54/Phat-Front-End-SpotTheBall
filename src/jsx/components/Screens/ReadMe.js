import React,{useState,useContext, useEffect} from 'react';
import { ThemeContext } from "../../../context/ThemeContext";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Link } from "react-router-dom";


const ReadMe = () => {

	const { changeBackground, background } = useContext(ThemeContext);
	
	useEffect(() => {
		changeBackground({ value: "dark", label: "Dark" });

	}, []);

	return(
		<>
			<div className="row">
				<div className="row">
					<div className="col-xl-12">
						<div className="row">

<div className="col-xl-12 col-xxl-6 col-lg-6">

  <div className="card">

	<div className="card-header border-1 pb-4">
	  <h4 className="card-title">Instructions</h4>
	</div>

	<div className="card-body">
	  <PerfectScrollbar
		style={{ height: "auto" }}
		id="DZ_W_TimeLine"
		className="widget-timeline dz-scroll height370 ps ps--active-y"
	  >
		<ul className="timeline">
		  <li>
			<div className="timeline-badge primary"></div>
			<Link
			  className="timeline-panel text-muted"
			  to="/widget-basic"
			>
			  <strong className="text-primary fs-28">Spot The Ball</strong>.

<p className="m-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
			  
Step 1			  
<br></br>
In the Tickets page we can see the Start button which is Green when a new game can be started or greyed out if there is already an active game. A new game can only start after the completion of any active game.
<br></br>

The Start and End time show when the game started and when it will be completed
<br></br>

Finally the remaining amount of minutes in the game is shown
</p>


<p className="m-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
			  
Step 2			  
<br></br>
Once a new game has started a fresh image is loaded which has the ball digitally removed
<br></br>

Each game participant can click on the image and create a ticket with the generated coordinates
<br></br>

Each ticket has a cost of 1 PHA and the user can play one or multiple tickets per time
<br></br>

Each time the user clicks on the image he should click the Play button to generate a ticket with these coordinates
<br></br>

When he is ready he can click Submit to submit his tickets. The total cost in PHA is shown next to the submit button
<br></br>

The Pot Size shows the total PHA that have been deposited
<br></br>

The Payout is 80% of the Pot Size and the Fees (20%) is for the owner of the game.
<br></br>

</p>

<p className="m-4 mt-4 text-dark" style={{ fontSize:"24px"}}>

Step 3			  
<br></br>
When the game expires the Number of tickets played in the current game is shown underneath the Start button in the Tickets page
<br></br>

The winner of the game along with previous winners are shown in the second tab Hall of Fame with all relevant details e.g. owner of the ticket winning coordinates, competition id, number of players (account addresses), number of tickets and the Prize Money won
<br></br>

When the competition completes in the SpotTheBall page we can see the solution: "Wisdom of the Crowd Answer" and the winning ticket coordinates
<br></br>

Finally the user account balance in PHA is shown at the top right corner of the page
<br></br>

The wisdom of the crowd dictates that the more tickets played, the closer the average prediction of the coordinates is to the real position of the ball.
<br></br>

Therefore the winning ticket is the one with the smallest distance to the Wisdom of the Crowd Answer
<br></br>


			  </p>
			</Link>
		  </li>
		</ul>
	  </PerfectScrollbar>
	</div>
  </div>
</div>
</div>


					</div>
				</div>
			</div>	
		</>
	)
}
export default ReadMe;