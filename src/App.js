import logo from './logo.svg';
import './App.css';

import CatchGame from './components/CatchGame';
import RushHour from './components/RushHour';

import utils from './utils'


function App() {

  const urlParams = new URLSearchParams(window.location.search);
  const userBlob = urlParams.get('userBlob');
  var userInfo = "user token not found. redirecting...."
  var cart = {}


  if (!userBlob) {
    setTimeout(function() {
      // window.location.href = "http://localhost:4002/c/quick-add?backdoor=true&redirect=gp-test-ee816.web.app"
      window.location.href = "http://localhost:4002/c/quick-add?backdoor=true&redirect=localhost:3000"
    }, 1500)
  } else {
    userInfo = JSON.parse(atob(userBlob))
    utils.getCart(userInfo.userToken).then(response => {
      cart = response.data.view.cart
      console.log('~~~> cart', cart)
    })
  }



  return (
    <div className="App">

    {/*<RushHour />*/}


      <h1>gp test</h1>
      <br />
      <br />
      User Info: <br />
      {JSON.stringify(userInfo)}

      <br />
      <button onClick={(e) => utils.addToCart(cart, userInfo.userToken, 1076)}> atc </button>

      {/*{userBlob && <CatchGame />}*/}


    </div>
  );
}

export default App;
