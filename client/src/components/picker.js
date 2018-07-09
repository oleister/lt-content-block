import React, { Component } from 'react';
import { cruiseData } from '../data.js';
import blocksdk from 'blocksdk';
import styles from './picker.css';

const VIEW_STATUS = {
    CRUISE_SEARCH: 0,
    SHIP_SEARCH: 1,
    ERROR: 2,
};

class Picker extends Component {

	constructor(props) {
		super(props);
		this.state = {
			value: cruiseData.cruises[0].cruise_nid,
			sailValue: null,
			selected: VIEW_STATUS.CRUISE_SEARCH,
			searchValue: '',
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSearchChange = this.handleSearchChange.bind(this);
		this.handleSailChange = this.handleSailChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleSailSubmit = this.handleSailSubmit.bind(this);
		this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
		this.handleBackButton = this.handleBackButton.bind(this);
	}

	handleChange(event) {
		this.setState({value: event.target.value});
	}

	handleSearchChange(event) {
		this.setState({searchValue: event.target.value});
	}

	handleSailChange(event) {
		this.setState({sailValue: event.target.value});
	}

	handleSubmit(event) {
		this.cruiseContent = null;
		for (let i in cruiseData.cruises) {
			if (cruiseData.cruises[i].cruise_nid == this.state.value) {
				this.cruiseContent = cruiseData.cruises[i];
			}
		}
    	event.preventDefault();
    	this.getSailings();
  	}

  	handleSailSubmit(event) {
  		console.log(this.state.sailValue);
  		event.preventDefault();
  		this.setSdkData();
  	}

  	handleSearchSubmit(event) {
  		console.log(this.state.searchValue);
  		event.preventDefault();
  		this.cruiseContent = null;
  		for (let i in cruiseData.cruises) {
			if (cruiseData.cruises[i].cruise_nid == this.state.searchValue) {
				this.cruiseContent = cruiseData.cruises[i];
			}
		}
		if (this.cruiseContent) {
			this.getSailings();
		}
		else {
			this.setState({selected: VIEW_STATUS.ERROR});
		}
  	}

  	handleBackButton(event) {
  		event.preventDefault();
  		this.setState({
  			value: cruiseData.cruises[0].cruise_nid,
			sailValue: null,
			selected: VIEW_STATUS.CRUISE_SEARCH,
  		})
  	}

  	setSdkData() {
  		let content = '';
  		for (let i in cruiseData.cruises) {
			if (cruiseData.cruises[i].cruise_nid == this.state.value) {
				let selectedCruise = cruiseData.cruises[i];
				console.log(selectedCruise);
				content += '<table align="center" class="tmp--full-width" style="font-size: 16px; font-weight: normal;" width="100%"><tr><td align="center" style="color: rgb(79, 79, 79); font-family: &quot;Salesforce Sans&quot;, Arial, sans-serif; font-style: normal; line-height: 22px; padding: 10px 40px 10px; text-align: center; vertical-align: top;" width="100%"><span style="font-size: 20px;"><b>' + selectedCruise.route_title + '</b></span></td></tr>';
				//content += '<tr><td align="center" style="color: rgb(79, 79, 79); font-family: &quot;Salesforce Sans&quot;, Arial, sans-serif; font-style: normal; line-height: 22px; padding: 40px 40px 10px; text-align: center; vertical-align: top;" width="100%">' + selectedCruise.route_title + '</td></tr>';
				content += '<tr><td align="center" style="color: rgb(79, 79, 79); font-family: &quot;Salesforce Sans&quot;, Arial, sans-serif; font-style: normal; line-height: 22px; padding: 10px 40px 10px; text-align: center; vertical-align: top;" width="100%">' + selectedCruise.nights + ' Nächte  auf der ' + selectedCruise.ship_title + '</td></tr>';
				content += '<tr><td align="center" style="color: rgb(79, 79, 79); font-family: &quot;Salesforce Sans&quot;, Arial, sans-serif; font-style: normal; line-height: 22px; padding: 10px 40px 10px; text-align: center; vertical-align: top;" width="100%">ab ' + selectedCruise.cheapestSail.price + '€</td></tr>';
				content += '</table>';
				/*for (let j in selectedCruise.sails) {
					if (selectedCruise.sails[j].sail_nid == this.state.sailValue) {
						let selectedSailing = selectedCruise.sails[j];
						content += '<p>And it\'s only ' + selectedSailing.currency + selectedSailing.price + '</p>';
					}
				}*/
			}
		}
		console.log(content);
		this.sdk.setContent(content);
  	}

  	getSailings() {
  		console.log(this.cruiseContent);
  		this.setState({sailValue: this.cruiseContent.sails[0].sail_nid})
  		this.sailings = this.cruiseContent.sails.map((sail) => {
			return (
				<option value={sail.sail_nid} key={sail.sail_nid}>{sail.sail_nid}</option>
			);
		});
  		this.setState({selected: VIEW_STATUS.SHIP_SEARCH});
  	}

	componentWillMount() {
		//I need to set my select element!
		this.sdk = new blocksdk();
		this.options = cruiseData.cruises.map((cruise) => {
			return (
				<option value={cruise.cruise_nid} key={cruise.cruise_nid}>{cruise.cruise_nid}-{cruise.ship_title}</option>
			);
		});
	}

	render() {
		let display = '';
		if (this.state.selected == VIEW_STATUS.SHIP_SEARCH) {
			display = 
			<div className = 'padding'>
				<h2>Select a sailing</h2>
				<form onSubmit={this.handleSailSubmit}>
					<select value={this.state.sailValue} onChange={this.handleSailChange}>
							{this.sailings}
					</select>
					<div>
						<input type="submit" value="Submit"/>
					</div>
				</form>
				<form onSubmit={this.handleBackButton}>
					<div>
						<input type="submit" value="Go Back"/>
					</div>
				</form>
			</div>;
		}
		else if (this.state.selected == VIEW_STATUS.CRUISE_SEARCH) {
			display = <div className='padding'>
				<h2>Select a cruise ship</h2>
				<form  onSubmit={this.handleSubmit}>
					<select value={this.state.value} onChange={this.handleChange}>
						{this.options}
					</select>
					<div>
						<input type="submit" value="Submit"/>
					</div>
				</form>
				<form onSubmit={this.handleSearchSubmit}>
					<div>
						<h2>Or search by Cruise ID</h2>
					</div>
					<div>
						<input type="text" value={this.state.searchValue} onChange={this.handleSearchChange} />
					</div>
					<div>
						<input type="submit" value="Search" />
					</div>
				</form>
			</div>;
		} 
		else {
			display = <div>
				<h2>Your search returned no results</h2>
				<form onSubmit={this.handleBackButton}>
					<div>
						<input type="submit" value="Go Back"/>
					</div>
				</form>
			</div>;
		}
		return (
			<div>
				{display}
			</div>
		);
	}
}

export default Picker;