import React, { Component, useState, useEffect } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
    this.fetchToday();
  }

  componentDidMount() {
    fetch('http://localhost:5000/bookings')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  async fetchToday() {
    try {
      const res = await fetch("http://localhost:4433/today");
      const json = await res.json();
      this.setState({today: json.today});
    } catch (e) {
      console.error("Failed to fetch 'today' data", e);
    }
  }

  addBooking(advId, dt) {
    this.setState(state => ({
      items: { advId : undefined }
    }));
  }

  render() {
    const { error, isLoaded, items } = this.state;
    return (
      <div className="App container">
        <h1>Book Time with an Advisor</h1>

        {this.state.today && <span id="today">Today is {this.state.today}.</span>}

        <form id="name-form" className="col-md-6">
          <div className="form-group">
            <label htmlFor="name-field">Your Name</label>
            <input type="text" id="name-field" className="form-control" />
          </div>
        </form>

        <h2>Available Times</h2>
        <table className="advisors table">
          <thead>
            <tr>
              <th>Advisor ID</th>
              <th>Available Times</th>
            </tr>
          </thead>
          <tbody>
            {
              Object.keys(items).map((advId, i) => (
                <tr>
                  <td>{advId}</td>
                  <td>
                    <ul className="list-unstyled">
                    {
                      items[advId].map((dt, j) => (
                        <li>
                          <time dateTime="{dt}" className="book-time">{dt}</time>
                          <button className="book btn-small btn-primary" onClick={() => this.addBooking(advId, dt)}>Book</button>
                        </li>
                      ))
                    }
                    </ul>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>

        <h2>Booked Times</h2>
        <table className="bookings table">
          <thead>
            <tr>
              <th>Advisor ID</th>
              <th>Student Name</th>
              <th>Date/Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>36232</td>
              <td>John Smith</td>
              <td>
                <time dateTime="2019-04-03T10:00:00-04:00">4/3/2019 10:00 am</time>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
