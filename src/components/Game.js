import logo from '../logo.svg'
import '../App.css'
import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import CatchGame from './CatchGame'
import RushHour from './RushHour'
import Signup from './Signup'

import utils from '../utils'


function Game() {

  const urlParams = new URLSearchParams(window.location.search)
  const userBlob = urlParams.get('userBlob')
  var userInfo = "user token not found. redirecting...."
  const [cart, setCart] = useState({})
  const [productId, setProductId] = useState(1076)
  const [statusMessage, setStatusMessage] = useState('')
  const [userAddress, setUserAddress] = useState({loading: '...'})
  const [content, setContent] = useState({loading: '...'})


  if (!userBlob) {
    setTimeout(function() {
      window.location.href = "http://localhost:4002/c/quick-add?backdoor=true&redirect=gopuff.work/redirect/gp-test-ee816.web.app/"
      // window.location.href = "http://localhost:4002/c/quick-add?backdoor=true&redirect=localhost:3000"
    }, 1500)
  } else {
    userInfo = JSON.parse(atob(userBlob))
  }

  useEffect(() => {
    if (userBlob) {
      utils.getCart(userInfo.userToken).then(response => {
        setCart(response.data.view.cart)
      })
      utils.getAddress(userInfo.userToken).then(response => {
        setUserAddress(response?.data.userAddresses?.collection)
      })
      utils.getContent(userInfo.userToken, "/us/c/ice-cream/txSaOHD2").then(response => {
        setContent(response?.data?.view?.content?.content.map(c => {
          return JSON.stringify({
            title: c.text?.title,
            collection: c.collection.map(p => {
              return {
                id: p.id,
                // name: p.productTileInfo ? p.productTileInfo[0].text : null
              }
            })
          }) + '\n\n\n'
        }))
      })
    }
  }, [userBlob, userInfo.userToken])


  function addToCart() {
    setStatusMessage("Loading ...")
    utils.addToCart(cart, userInfo.userToken, productId).then(response => {
      if (response?.data?.view?.setCart?.products) {
        setStatusMessage(JSON.stringify(response.data.view.setCart.products.map(p => {
          return {
            id: p.id,
            quantity: p.quantity
          }
        })))
      } else {
        setStatusMessage("error :(")
      }

    })
  }

  return (
    <div className="App">

      <div>

        <h1>gp test</h1>
        <br />
        <br />
        User Info: <br />
        {JSON.stringify(userInfo)}

        <br />
        <br />
        /userAddress:
        <br />
        <div>{JSON.stringify(userAddress)}</div>
        <br />
        <br />
        <div>{JSON.stringify(content)}</div>
        <br />
        <br />
        product id:
        <input
          type="number"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <br />
        <button onClick={(e) => addToCart()}> atc </button>
        <br />
        <div>{statusMessage}</div>
        <br />

        {userBlob && <CatchGame />}

      </div>


    </div>
  )
}

export default Game
