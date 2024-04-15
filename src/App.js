import logo from './logo.svg';
import './App.css';

import { TestButton } from './components/TestButton'

function App() {

  const urlParams = new URLSearchParams(window.location.search);
  var userToken = urlParams.get('userToken');

  if (!userToken) {
    userToken = "user token not found. redirecting..."

    setTimeout(function() {
      window.location.href = "http://localhost:4002/c/quick-add?backdoor=true&redirect=gp-test-ee816.web.app"
      // window.location.href = "http://localhost:4002/c/quick-add?backdoor=true&redirect=localhost:3000"
    }, 1500)
  }



  return (
    <div className="App">


      <h1>gp test</h1>
      <br />
      <br />
      User Token: <br />
      {userToken}

      <TestButton userToken={userToken} />


    </div>
  );
}

export default App;
