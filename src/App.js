import logo from './logo.svg';
import './App.css';

import { TestButton } from './components/TestButton'


function App() {

  const urlParams = new URLSearchParams(window.location.search);
  const userBlob = urlParams.get('userBlob');
  var userInfo = "user token not found. redirecting..."


  if (!userBlob) {
    setTimeout(function() {
      window.location.href = "http://localhost:4002/c/quick-add?backdoor=true&redirect=gp-test-ee816.web.app"
      // window.location.href = "http://localhost:4002/c/quick-add?backdoor=true&redirect=localhost:3000"
    }, 1500)
  } else {
    userInfo = JSON.parse(atob(userBlob))
  }



  return (
    <div className="App">


      <h1>gp test</h1>
      <br />
      <br />
      User Info: <br />
      {JSON.stringify(userInfo)}

      <TestButton userToken={userInfo} />


    </div>
  );
}

export default App;
