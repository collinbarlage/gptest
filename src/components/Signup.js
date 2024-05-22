import React from "react"

export default class Signup extends React.Component {
  constructor(props) {
    super(props)

    const urlParams = new URLSearchParams(window.location.search)
    const fullAddress = urlParams.get('fullAddress')

    this.state = {
      phone: '',
      fullAddress: fullAddress,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleChange(e) {
    this.setState({ phone: e.target.value })
  }

  handleClick() {
    const { phone } = this.state
    console.log(`Phone number entered: ${phone}`)

    const url = "https://graphql-federation-gateway.consumer.gopuff.com/graphql"


    // todo
    // redirect to https://www.gopuff.com/mobile-number
  }

  render() {
    return (
      <div style={{ 'textAlign': 'center', 'marginTop': '20px' }}>
        <div style={{ 'fontSize': '18px', 'marginBottom': '10px' }}>
          {this.state.fullAddress}
        </div>
        <input
          type="text"
          value={this.state.phone}
          onChange={this.handleChange}
          placeholder="Enter phone number"
          style={{
            'padding': '10px',
            'fontSize': '16px',
            'marginBottom': '20px',
            'width': '80%',
            'maxWidth': '300px'
          }}
        />
        <br />
        <button
          style={{
            'padding': '10px 20px',
            'fontSize': '16px',
            'margin': '20px',
            'cursor': 'pointer'
          }}
          onClick={this.handleClick}
        >
          Signup
        </button>
      </div>
    )
  }
}
