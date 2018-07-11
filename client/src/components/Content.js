import React, { Component } from 'react';
import blocksdk from 'blocksdk';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import styles from './Content.css'

import 'react-datepicker/dist/react-datepicker.css';

const VIEW_STATUS = {
    USER_INPUT: 0,
    LOADING: 1,
    DISPLAY_VALUES: 2,
    ERROR: 3,
};

class Content extends Component {
    constructor(props) {
		super(props);
		this.state = {
            value: '',
            status: VIEW_STATUS.USER_INPUT,
            minPrice: 1200,
            maxPrice: 1800,
            numResults: 3,
            startDate: moment(),
            endDate: moment().add(30, 'd'),
        }
        this.handleMinPriceChange = this.handleMinPriceChange.bind(this);
        this.handleMaxPriceChange = this.handleMaxPriceChange.bind(this);
        this.handleNumberOfResultsChange = this.handleNumberOfResultsChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
		//I need to set my select element!
        this.sdk = new blocksdk();
	}

    componentDidMount() {
        /*fetch('/listings', {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'test': 'Hello API!'
            })
        })
        .then((result) => {
            console.log(result);
            return result.json();
            //this.setState({value: result.json().text});
        })
        .then((stuff) => {
            console.log(stuff);
            //this.setState({value: stuff.stuff});
        });*/
    }

    handleMinPriceChange(event) {
        this.setState({minPrice: event.target.value});
    }

    handleMaxPriceChange(event) {
        this.setState({maxPrice: event.target.value});
    }

    handleNumberOfResultsChange(event) {
        this.setState({numResults: event.target.value});
    }

    handleStartDateChange(date) {
        this.setState({startDate: date});
    }

    handleEndDateChange(date) {
        this.setState({endDate: date});
    }

    handleSubmit(event) {
        event.preventDefault();

        fetch('/listings', {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'min': this.state.minPrice,
                'max': this.state.maxPrice,
                'resultCount': this.state.numResults,
                'startDate': this.state.startDate.format('YYYY-MM-DD'),
                'endDate': this.state.endDate.format('YYYY-MM-DD')
            })
        })
        .then((result) => {
            console.log(result);
            return result.json();
            //this.setState({value: result.json().text});
        })
        .then((trips) => {
            console.log(trips);
            this.displayToContentBlock(trips)
        });
  	}

    displayToContentBlock(trips) {
        let content = ''
        for (let i in trips.products) {
            content+= '<div>';
            content+=`<h2>An amazing trip to ${trips.products[i].hotel.location.country.name} for only ${trips.products[i].price.amountTotal}€ at the incredible ${trips.products[i].hotel.name} hotel!</h2>`;
            content+=`<div><h3>Trip Details:</h3></div><div><b>Inbound Flight Details</b></div>`;
            content+=`<div>${trips.products[i].flight.inbound.arrivalAirport.code} to ${trips.products[i].flight.inbound.departureAirport.code} on ${moment(trips.products[i].flight.inbound.departureDateTime).format('DD-MM-YY')} at ${moment(trips.products[i].flight.inbound.departureDateTime).format('HH:mm')}</div>`;
            content+=`<div><b>Outbound Flight Details</b></div>`;
            content+=`<div>${trips.products[i].flight.outbound.arrivalAirport.code} to ${trips.products[i].flight.outbound.departureAirport.code} on ${moment(trips.products[i].flight.outbound.departureDateTime).format('DD-MM-YY')} at ${moment(trips.products[i].flight.outbound.departureDateTime).format('HH:mm')}</div>`;
            content+='</div>';
        }
        console.log(content);
    }
    
    render() {
        //let start = this.state.startDate.format('YYYY-MM-DD');
        return (
            <div className="padding">
                <div>
                    <p>Enter the minimum price</p>
					<input type="text" value={this.state.minPrice} onChange={this.handleMinPriceChange} />
				</div>
                <div>
                    <p>Enter the maximum price</p>
					<input type="text" value={this.state.maxPrice} onChange={this.handleMaxPriceChange} />
				</div>
                <div>
                    <p>How many results would you like</p>
					<input type="text" value={this.state.numResults} onChange={this.handleNumberOfResultsChange} />
				</div>
                <div>
                    <p>Enter a start date</p>
                    <DatePicker selected={this.state.startDate} onChange={this.handleStartDateChange}/>
                </div>
                <div>
                    <p>Enter an end date</p>
                    <DatePicker selected={this.state.endDate} onChange={this.handleEndDateChange}/>
                </div>
                <form onSubmit={this.handleSubmit}>
					<div>
						<input type="submit" value="Search"/>
					</div>
				</form>
            </div>
        )
    }
}

export default Content;