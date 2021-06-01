import Home from './components/home'
import './App.css';
import Signup from './components/signup';
import firebase from 'firebase/app';
import 'firebase/auth';
import Signin from './components/signin';
import {
  HashRouter as Router,
  Switch,
  Route ,Redirect
} from 'react-router-dom';

import {useState, useEffect} from 'react';

firebase.initializeApp({
  apiKey: "AIzaSyC-v0oNNja7h_CCRMjtOu4qE2VkN_DxqaU",
  authDomain: "thats-whatsup.firebaseapp.com",
  projectId: "thats-whatsup",
  storageBucket: "thats-whatsup.appspot.com",
  messagingSenderId: "289429766892",
  appId: "1:289429766892:web:e35f1b7ae81fc77b48dbc9",
  measurementId: "G-CF3T1QJ1QZ"
});

function App() {
const [user,setuser]=useState(null);

useEffect(()=>{
firebase.auth().onAuthStateChanged((user)=>{

  setuser(user);
})
},[]);

  return (
    <div className="App">
   <Router>
  
     <Switch>
      
       <Route exact path="/">
     {user? <Redirect to="/home" push/>:<Signin />} 
       </Route>

       <Route path="/signup">
       {user? <Redirect to="/home" push />:  <Signup />}
         </Route>

         <Route path="/home">
         {user? <Home user={user}/>: <Redirect to="/"/>} 
         </Route>

     </Switch>

   </Router>
  


    </div>
  );
}

export default App;
