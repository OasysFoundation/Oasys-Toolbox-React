import React, {Component} from 'react';
import { Card, CardBody, Container } from 'reactstrap';
import { Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';

class DataOverview extends Component {
	
	render(){
		return (
			<div classname='table'>
				<Table responsive striped className='has-shadow' style={{border: '1px solid #c8ced3'}}>
		          <thead>
		          <tr>
		            <th>Username</th>
		            <th>Date registered</th>
		            <th>Role</th>
		          </tr>
		          </thead>
		          <tbody>
		          <tr>
		            <td>Yiorgos Avraamu</td>
		            <td>2012/01/01</td>
		            <td>Member</td>
		          </tr>
		          <tr>
		            <td>Avram Tarasios</td>
		            <td>2012/02/01</td>
		            <td>Staff</td>
		          </tr>
		          <tr>
		            <td>Quintin Ed</td>
		            <td>2012/02/01</td>
		            <td>Admin</td>
		          </tr>
		          <tr>
		            <td>Enéas Kwadwo</td>
		            <td>2012/03/01</td>
		            <td>Member</td>
		          </tr>
		          <tr>
		            <td>Agapetus Tadeáš</td>
		            <td>2012/01/21</td>
		            <td>Staff</td>
		          </tr>
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