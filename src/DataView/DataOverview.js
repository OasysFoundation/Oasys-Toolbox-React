import React, {Component} from 'react';
import { Pagination, PaginationItem, PaginationLink, Table } from 'reactstrap';
import ReactTooltip from "react-tooltip"

const summaryData = [
	{
		'title': 'Bullshit detector',
		'rating': 4.4,
		'learner': 100,
		'token': 5,
		'published': new Date(),

	},
	{
		'title': 'Energy is esoteric',
		'rating': 4.2,
		'learner': 200,
		'token': 2,
		'published': new Date(),

	},
	{
		'title': 'Atoms are not atoms',
		'rating': 4.0,
		'learner': 1000,
		'token': 200,
		'published': new Date(),

	},
];

const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };


class DataOverview extends Component {
	
	render(){
		return (
			<div classname='table'>
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
		          	{summaryData.map(e=>
			          <tr>
			            <td>{e.title}</td>
			            <td>{e.rating}</td>
			            <td>{e.learner}</td>
			            <td>{e.token}</td>
			            <td>{e.published.toLocaleDateString("en-US", dateOptions)}</td>
			          </tr>
		          	)}
		          </tbody>
		        </Table>
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
			</div>
		)
	}
}

export default DataOverview;