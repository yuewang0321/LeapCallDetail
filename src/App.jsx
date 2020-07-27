import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Header from './Header.jsx';
import Archive from './components/archive.js'
import Activity from './components/activity.js'

import Button from '@material-ui/core/Button';


export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inboxView: true,
      archiveAll: false,
    }
  }
  showInbox() {
    if (!this.state.inboxView) {
      let inbox = document.getElementById('inbox');
      let archive = document.getElementById('archive');
      inbox.classList.add('select');
      archive.classList.remove('select');
      this.setState( {inboxView:true} )
    }
  }

  showArchive() {
    if (this.state.inboxView) {
      let inbox = document.getElementById('inbox');
      let archive = document.getElementById('archive');
      inbox.classList.remove('select');
      archive.classList.add('select');
      this.setState( {inboxView:false} )
    }
  }

  render() {
    return (
      <div className='container'>
        <div className='fix'><Header />
        <section className='options'>
          <Button className='select' id='inbox' onClick={this.showInbox.bind(this)}>Inbox</Button>
          <Button id='archive' onClick={this.showArchive.bind(this)}>Archive</Button>
        </section></div>
        <div className='scroll'><div className="container-view">
          <div>{this.state.inboxView ? <Activity /> : <Archive />}</div>
        </div></div>
      </div>
    );
  }
    
}

ReactDOM.render(<App/>, document.getElementById('app'));

export default App;
