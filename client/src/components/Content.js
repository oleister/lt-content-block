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
            minPriceVariable: false,
            minPriceAMP: 'minPrice',
            maxPriceAMP: 'maxPrice',
        }
        this.handleMinPriceChange = this.handleMinPriceChange.bind(this);
        this.handleMaxPriceChange = this.handleMaxPriceChange.bind(this);
        this.handleMinPriceAMPChange = this.handleMinPriceAMPChange.bind(this);
        this.handleMaxPriceAMPChange = this.handleMaxPriceAMPChange.bind(this);
        this.handleNumberOfResultsChange = this.handleNumberOfResultsChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.handleMinPriceVariableChange = this.handleMinPriceVariableChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
		//I need to set my select element!
        this.sdk = new blocksdk();
	}

    componentDidMount() {
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

    handleMinPriceVariableChange(event) {
        this.setState({minPriceVariable: event.target.checked});
    }

    handleMinPriceAMPChange(event) {
        this.setState({minPriceAMP: event.target.value});
    }

    handleMaxPriceAMPChange(event) {
        this.setState({maxPriceAMP: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.minPriceVariable) {
            this.displayToContentBlock('');
        }
        else {
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
  	}

    displayToContentBlock(trips) {
        let content = ''
        if (!this.state.minPriceVariable) {
            for (let i in trips.products) {
                content+= `<table align="left" border="0" cellpadding="8" cellspacing="0" style="width:100%;">
   				<tr>
   					<td style="background-color: rgb(42, 57, 107);"><span style="font-size:16px;"><span style="font-family:arial,helvetica,sans-serif;"><span style="color:#FFFFFF;"><b>${trips.products[i].hotel.location.country.name} only ${trips.products[i].price.amountTotal} &euro;</b></span></span></span>
					</td></tr><tr>
   					<td style="background-color: rgb(0, 146, 188);"><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:14px;">Your hotel in ${trips.products[i].hotel.location.city.name} is ${trips.products[i].hotel.name} with category ${trips.products[i].hotel.category}&nbsp;</span></span>
					</td></tr><tr>
   					<td style="background-color: rgb(221, 236, 242); height: 15px;"><b style="font-family: arial, helvetica, sans-serif; font-size: 12px;">Traveldetails for ${trips.products[i].travelPeriod.duration} days:</b>
		    			</td></tr><tr>
   					<td style="background-color: rgb(248, 248, 248);"><span style="font-family: arial, helvetica, sans-serif; font-size: 12px;"><b>Depart</b>:</span><span style="font-family: arial, helvetica, sans-serif; font-size: 12px;">${trips.products[i].flight.inbound.arrivalAirport.name} to ${trips.products[i].flight.inbound.departureAirport.name} on ${moment(trips.products[i].flight.inbound.departureDateTime).format('DD-MM-YY')} at ${moment(trips.products[i].flight.inbound.departureDateTime).format('HH:mm')}.</span><br><br style="font-family: arial, helvetica, sans-serif; font-size: 12px;"><span style="font-family: arial, helvetica, sans-serif; font-size: 12px;"><b>Return</b>:&nbsp;</span><span style="font-family: arial, helvetica, sans-serif; font-size: 12px;">${trips.products[i].flight.outbound.arrivalAirport.name} to ${trips.products[i].flight.outbound.departureAirport.name} on ${moment(trips.products[i].flight.outbound.departureDateTime).format('DD-MM-YY')} at ${moment(trips.products[i].flight.outbound.departureDateTime).format('HH:mm')} </span>
					</td></tr><tr>
   					<td style="background-color: rgb(221, 236, 242);"><b><span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:12px;">Hotel:</span></span></b>
		    			</td></tr><tr>
   					<td style="background-color: rgb(248, 248, 248);"><span style="font-size:12px;"><span style="font-family:arial,helvetica,sans-serif;">Room:&nbsp;${trips.products[i].hotel.room.name}<br>Board:&nbsp;</span></span><span style="font-family: arial, helvetica, sans-serif; font-size: 12px;">${trips.products[i].hotel.board.name}</span>
		    			</td></tr><tr>
   					<td style="background-color: rgb(73, 153, 185); text-align: right; height: 3px;">
   					</td></tr><tr>
   					<td style="text-align: right; height: 5px;">
   					</td>
		    		</tr>
			</table>`;
            }
            console.log(content);
            this.sdk.setContent(content);
        }
        else {
            //lots of ampscript now
            content+=`%%[
                var @output, @responseheader
                set @body = '{
                    "min": ${this.state.minPriceAMP},
                    "max": ${this.state.maxPriceAMP},
                    "resultCount": ${this.state.numResults},
                    "startDate": "${this.state.startDate.format('YYYY-MM-DD')}",
                    "endDate": "${this.state.endDate.format('YYYY-MM-DD')}"
                }'
                HTTPPost2('https://psdemo-ltur-content-block.herokuapp.com/personalisedFeed', 'application/json', @body, true, @output, @responseheader)
                ]%%
                %%=v(@output)=%%
                `
            this.sdk.setContent(content);
        }
    }
    
    render() {
        let minPriceBlock = <div>
        <p>Enter the minimum price</p>
            <input type="text" value={this.state.minPrice} onChange={this.handleMinPriceChange} />
            </div>;
        let maxPriceBlock = <div>
        <p>Enter the maximum price</p>
            <input type="text" value={this.state.maxPrice} onChange={this.handleMaxPriceChange} />
            </div>;
        if (this.state.minPriceVariable) {
            minPriceBlock = <div>
            <p>Enter the minimm price variable name</p>
                <input type="text" value={this.state.minPriceAMP} onChange={this.handleMinPriceAMPChange} /></div>;
            maxPriceBlock = <div>
            <p>Enter the max price variable name</p>
                <input type="text" value={this.state.maxPriceAMP} onChange={this.handleMaxPriceAMPChange} /></div>;
        }
        return (
            <div className="padding">
                <p>Use a subscriber attributes for pricing</p>
                <input type="checkbox" value={this.state.minPriceVariable} onChange={this.handleMinPriceVariableChange} />
                <div>
                    {minPriceBlock}
				</div>
                <div>
                    {maxPriceBlock}
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
						<input type="submit" value="Submit"/>
					</div>
				</form>
            </div>
        )
    }
}

export default Content;
