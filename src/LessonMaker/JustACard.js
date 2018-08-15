import React, {Component} from 'react';


const JustACard = (props) => (
    <Card className="card-fancy has-shadow">
            <CardBody>
                {/*  !! This passes the Children (in render) of Fadeable card from <Element/>  in between here !! */}
                {this.props.children}

            </CardBody>
    </Card>
)
