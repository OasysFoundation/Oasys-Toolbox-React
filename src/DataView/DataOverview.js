import React, {Component} from 'react';
// import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { Table } from 'reactstrap';
import ReactTooltip from 'react-tooltip';

import colors from '../colors';

const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };


class DataOverview extends Component {

	onChangeData(id) {
		this.props.onChangeData(id);
	}
	
	render(){
		return (
			<div classname='table'>

				<h3 style={{marginBottom: '0px'}}>
					Summary
					<sup><i class="far fa-question-circle margin-right5 medgrey" data-tip='tooltip' data-for='summary'></i></sup>
					<ReactTooltip id='summary' place='right'> 
						You can select any row in the summary table. <br/>
						This will show detailed statistics for the selected lesson below the table.
					</ReactTooltip>
				</h3>
				<hr style={{marginTop: '0px', borderColor: colors.GULLGREY}}/>

				<Table responsive striped className='has-shadow' style={{border: '1px solid #c8ced3'}}>
		          <thead>
		          <tr>
		            <th>
		            	Title
		            </th>
		            <th>
		            	Rating
		            	<sup><i class="far fa-question-circle margin-right5 medgrey" data-tip='tooltip' data-for='rating-help'></i></sup>
                    	<ReactTooltip id='rating-help'> 
                    		Average rating of this lesson
                    	</ReactTooltip>
                    </th>
		            <th>
		            	Learners
		            	<sup><i class="far fa-question-circle margin-right5 medgrey" data-tip='tooltip' data-for='learner-help'></i></sup>
                    	<ReactTooltip id='learner-help'> 
                    		How many learners have accessed this lesson
                    	</ReactTooltip>
                    </th>
		            <th>
		            	Tokens
		            	<sup><i class="far fa-question-circle margin-right5 medgrey" data-tip='tooltip' data-for='token-help'></i></sup>
                    	<ReactTooltip id='token-help'> 
                    		Amount of tokens you have earned with this lesson
                    	</ReactTooltip>
                	</th>
		            <th>
		            	Birthday
		            	<sup><i class="far fa-question-circle margin-right5 medgrey" data-tip='tooltip' data-for='birthday-help'></i></sup>
                    	<ReactTooltip id='birthday-help'> 
                    		Date at which you published this lesson
                    	</ReactTooltip>
                    </th>
		          </tr>
		          </thead>
		          <tbody>
			          <tr onClick={e=>this.onChangeData('all')} style={{cursor: 'pointer'}}>
			            <td><strong>All lessons</strong></td>
			            <td><strong>{(this.props.data.map(e=>e.rating).reduce((a,b)=>a+b,0)/this.props.data.length).toFixed(1)}</strong></td>
			            <td><strong>{this.props.data.map(e=>e.learner).reduce((a,b)=>a+b)}</strong></td>
			            <td><strong>{this.props.data.map(e=>e.token).reduce((a,b)=>a+b)}</strong></td>
			            <td></td>
			          </tr>
		          	{this.props.data.map(e=>
			          <tr onClick={f=>this.onChangeData(e.id)} style={{cursor: 'pointer'}}>
			            <td>{e.title}</td>
			            <td>{e.rating}</td>
			            <td>{e.learner}</td>
			            <td>{e.token}</td>
			            <td>{e.published.toLocaleDateString("en-US", dateOptions)}</td>
			          </tr>
		          	)}
		          </tbody>
		        </Table>
		        {/* We don't need pagination for now. Later, it can be implemented like so:
		        	https://scotch.io/tutorials/build-custom-pagination-with-react
		        	Or even better, use the ready-made react-table that supports sorting and pagination:
		        	https://github.com/react-tools/react-table
			        <Pagination className='flex-center'>
			          <PaginationItem disabled><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
			          <PaginationItem active>
			            <PaginationLink tag="button">1</PaginationLink>
			          </PaginationItem>
			          <PaginationItem><PaginationLink tag="button">2</PaginationLink></PaginationItem>
			          <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
			          <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
			          <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
			        </Pagination>
			    */}
			</div>
		)
	}
}

export default DataOverview;