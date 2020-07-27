import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { CardContent } from '@material-ui/core';
import Button from '@material-ui/core/Button';


class Archive extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isLoaded: false,
        }

    }
    componentDidMount() {
        let url = 'https://aircall-job.herokuapp.com/activities';
        fetch(url)
        .then(res => res.json())
        .then(json => {
            this.setState({
                items: json,
                isLoaded: true,
            })
        });
    }

    resetCall(id) {
        let url_ar = 'https://aircall-job.herokuapp.com/activities/' + id;
        fetch(url_ar, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ is_archived: false })
        })
        .then((res) => res.json())
        .catch(error => {
            console.error('An error occured', error);
        });
        let copy = this.state.items;
        for (let i = 0; i < copy.length; i++) {
            if (this.state.items[i].id == id) {
                if (copy[i]['is_archived'] == true) {
                    copy[i]['is_archived'] = false;
                }
            }
        }
        this.setState({ items: copy })
    }

    resetAll() {
        let url = 'https://aircall-job.herokuapp.com/reset';
        fetch(url)
        .then(response => response.json())
        .then(data => {
            window.location.reload(true);
      })
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
            let callInbound = "src/images/in.png";
            let callOutbound = "src/images/out.png";
            return (
                <div>
                <Button className='btn' onClick={() => this.resetAll()}> Reset All </Button>
                <ul>
                    {items.map(item =>(
                    <li key={item.id}>
                        {item.is_archived ? <div>
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
                                <Button className='btn' onClick={() => this.resetCall(item.id)}> Reset </Button>
                                <img className='image' src={item.direction=='inbound'?callInbound:callOutbound} />
                                </CardContent>
                                </div>
                            </Card>
                        </div> : null}
                    </li>
                    ))}
                </ul>
            </div>
            );
        }
    }
}


export default Archive;