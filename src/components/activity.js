import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { CardContent } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import '../css/activity.css';

class Activity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isLoaded: false,
            showDetail:false,
            detailId:null,
            from:null,
            to:null,
            duration:null,
            call_type:null,
            via:null
        }
    }

    componentDidMount() {
        let url = 'https://aircall-job.herokuapp.com/activities';
        fetch(url)
        .then(res => res.json())
        .then(json => {
            this.setState({
                isLoaded: true,
                items: json,
            })
        });
    }

    viewDetails(id) {
        let url = 'https://aircall-job.herokuapp.com/activities/' + id;
        fetch(url)
        .then(res=>res.json())
        .then(json => {
            this.setState({
                from: json.from,
                to: json.to,
                duration: json.duration,
                call_type: json.call_type,
                via: json.via
            })
        })
        this.setState( { showDetail:true } );
    }

    viewCalls() {
        this.setState({
            from: null,
            to: null,
            duration: null,
            call_type: null,
            via: null
        })
        this.setState( { showDetail:false } );
    }

    archiveCall(id) {
        let url_ar = 'https://aircall-job.herokuapp.com/activities/' + id;
        fetch(url_ar, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ is_archived: true })
        })
        .then((res) => res.json())
        .catch(error => {
            console.error('An error occured', error);
        });
        let copy = this.state.items;
        for (let i = 0; i < copy.length; i++) {
            if (this.state.items[i].id == id) {
                if (copy[i]['is_archived'] == false) {
                    copy[i]['is_archived'] = true;
                }
            }
        }
        this.setState({ items: copy })
    }

    render() {
        var { items, isLoaded } = this.state;
        let callInbound = "src/images/in.png";
        let callOutbound = "src/images/out.png";

        if (!isLoaded) {
            return <div>Loading</div>
        }
        else {
            let sortedItems = items.sort((a, b) => b.createdAt - a.createdAt);
            return (
                <div>
                    {!this.state.showDetail ? <div>
                        <ul>
                        {sortedItems.map(item =>(
                            <li key={item.id}>
                                {!item.is_archived ? <div>
                                    <Card className='card'>
                                    <div>
                                        <CardContent>
                                        <div className='date'>
                                            {new Date(item.created_at).toString().slice(4,10) + ',' + Date(item.created_at).toString().slice(10,15)}
                                        </div>
                                        <Typography variant="body1">
                                            {item.from}
                                        </Typography>
                                        <Typography variant="subtitle1" color="textSecondary">
                                            {item.direction} call to {(item.to==null)? "Unknown":item.to}
                                        </Typography>
                                        <Button className='btn' onClick={() => this.viewDetails(item.id)}> Details </Button>
                                        &nbsp;&nbsp;&nbsp;
                                        <Button className='btn' onClick={() => this.archiveCall(item.id)}> Archive </Button>
                                        <img className='image' src={item.direction=='inbound'?callInbound:callOutbound} />
                                        </CardContent>
                                        </div>
                                    </Card>
                                </div> : null}
                            </li>
                        ))}
                    </ul>
                    </div> : <div>
                        <section className='detailInfo'>
                            <p>{this.state.call_type} call via {this.state.via}</p>
                            <p>from {this.state.from} to {this.state.to}</p>
                            <p>Duration: {this.state.duration}s</p>
                        </section>
                        <Button className='btn' onClick={this.viewCalls.bind(this)}> Back </Button>
                    </div>}
                </div>
            )
        }
    }
}

export default Activity;