import React, { Component } from 'react';
import logo from '../logo.svg';
import './App.css';

class App extends Component {
  state = {
    data: null,
    users: [],
    rentals: []
  };

  componentDidMount() {
    // Call our fetch function below once the component mounts
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express, rentals: res.rentals }))
      .catch(err => console.log(err));

    this.fetchUsers()
      .then(res => this.setState({ users: res.users }))
      .catch(err => console.log(err));
  }

  // Fetches our GET route from the Express server.
  callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();
    console.log(body);

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  fetchUsers = async () => {
    const response = await fetch('/users');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <p>{this.state.data}</p>
          <h1>Users</h1>
          {this.state.users.map(user =>
            <div key={user.id}>{user.username}</div>
          )}
          <h1>Rentals</h1>
          {this.state.rentals.map((rental, index) =>
          <ul key={index}>
            <li>{rental.source}</li>
            <li>{rental.title}</li>
            <li>{rental.price}</li>
            <li><a target="_blank" rel="noopener noreferrer" href={rental.href}>{rental.href}</a></li>
            <li>{rental.date}</li>
          </ul>
          )}
        </header>
      </div>
    );
  }
}

export default App;
