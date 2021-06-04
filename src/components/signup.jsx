import {React,useState} from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import {Link} from 'react-router-dom';


export default function Signup(){

const [email,setemail]=useState("");
const [password,setpassword]=useState("");
const [confpass,setconfpass]=useState("");
const [inemail,setinemail]=useState(true);
const [inpass,setinpass]=useState(true);
const [inconpass,setinconpass]=useState(true);
const [emailerr,setemailerr]=useState("");


// when there are multiple useState calls, react will combine them to one ui update for improving performance

    const googleuser=()=>{
    var provider=new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
    firebase.auth().getRedirectResult()
    .then((result)=>{
    
            }).catch((err)=>{
              setemailerr(err.message);
              setinemail(false);
            });
    }

    const sub=(e)=>{
    e.preventDefault();
    if(email.length!==0){
   
    if(password===confpass&&password.length!==0){
        firebase.auth().createUserWithEmailAndPassword(email,password)
        .then(()=>{
           
        }).catch((err)=>{

                setinemail(false);
                setemailerr(err.message)
            
        })
    }else{
        setinpass(false);
        setinconpass(false);
    }
    }else{
        setinemail(false);
    }
    }

    const setmail=(e)=>{
        setemail(e.target.value);
     
        var reg= /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      
        if(!(reg.test(e.target.value)|| e.target.value.length===0)){
            setemailerr("Enter valid email");
            setinemail(false)
        }else{setinemail(true)}
    }

    const compass=(e)=>{
    setinconpass(e.target.value===password);
    setconfpass(e.target.value)
    }

    const checkpass=(e)=>{
        var regex=/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,})/;
    
        setinpass(regex.test(e.target.value))
        setpassword(e.target.value)
    }
    
    return <div>
    <div className="nav">
        <h1>Thats whatsup</h1>
    </div>
   <form onSubmit={(e)=>{sub(e)}}>
    <div className="box" id="box2">
  
        <h2>Signup</h2>
        
            <label htmlFor="email">Enter email</label>
            <input type="email"  name="email" id="email" value={email} onChange={(e)=>{setmail(e)}} style={{borderBottom:inemail?"none":"solid 2px red"}} />
             {Boolean(inemail)||<div className="er"><p className="error">{emailerr}</p></div>}
            <label htmlFor="password">Enter password</label>
            <input type="password" name="password"  value={password} onChange={(e)=>{checkpass(e)}} style={{borderBottom:inpass?"none":"solid 2px red"}}/>
            {Boolean(inpass)||<div className="er"><p className="error">Password should contain Uppercase,lowercase,digit and special character</p></div>}
            <label  htmlFor="confpassword">Confirm password</label>
            <input type="password"  name="confpassword"  value={confpass} onChange={(e)=>{compass(e)}} style={{borderBottom:inconpass?"none":"solid 2px red"}}/>
            {Boolean(inconpass)||<div className="er"><p className="error">Password does not match</p></div>}
            <button type="submit">Signup</button>
            <h3>Or</h3>
         
    <button type="button" className="googlebtn" onClick={googleuser}><img src="https://img.icons8.com/fluent/48/000000/google-logo.png" alt="Google" /> <p>Signup with Google</p></button>
    <button  type="button" id="signup"> <Link to="/" id="signup">Already have an account? Signin </Link></button>
    </div>
    </form>
  <div className="footer">
      Swasthikjp©2021
  </div>
</div>
}