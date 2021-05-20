import { React, useState } from 'react';
import {Link} from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';


export default function Signin() {

    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [inemail, setinemail] = useState(true);
    const [inpass, setinpass] = useState(true);
    const [passerr,setpasserr]=useState("");
    const [emailerr,setemailerr]=useState("");



    const sub = (e) => {
        e.preventDefault();
        if (email.length !== 0) {

            if (password.length !== 0) {
                firebase.auth().signInWithEmailAndPassword(email,password)
                .then(()=>{
                   
                }).catch((err)=>{
                    if(err.code.search("user-not-found")!==-1){
                        setemailerr("User not found");
                        setinemail(false);
                        setinpass(true);
                    }
                  else  if(err.code.search("email")!==-1){
                        setemailerr(err.message);
                         setinemail(false)
                         setinpass(true);
                    }else{
                        setpasserr(err.message);
                        setinpass(false)
                        setinemail(true)
                    }
                
                })
            } else {
                setinpass(false);
            }
        } else {
            setinemail(false);
        }
    }

    const googleuser = () => {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
        firebase.auth().getRedirectResult()
        .then((result)=>{
        
                }).catch((err)=>{
                  setemailerr(err.message);
                  setinemail(false);
                });
    }

    const setmail = (e) => {
        setemail(e.target.value);

        var reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     
        if(!(reg.test(e.target.value) || e.target.value.length === 0)){
        setemailerr("Enter valid email");
        setinemail(false);
        }else{
            setinemail(true)
        }

    }

    const checkpass = (e) => {
        var regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,})/;

       
        if(!regex.test(e.target.value)){
            setpasserr("Password should contain Uppercase,lowercase,digit and special character(min 6)");
            setinpass(false)
        }else{
            setinpass(true)
        }
        setpassword(e.target.value)
    }

    return <div>
        <div className="nav">
            <h1>Thats whatsup</h1>
        </div>
        <form onSubmit={(e) => { sub(e) }}>
            <div className="box">
                {/* <form > */}
                <h2>Signin</h2>
                <label htmlFor="email"> Enter email </label>
                <input type="text" name="email" id="email" value={email} onChange={(e) => { setmail(e) }} style={{ borderBottom: inemail ? "none" : "solid 2px red" }} />
                {Boolean(inemail) || <div className="er"><p className="error">{emailerr}</p></div>}
                <label htmlFor="password">Enter password</label>
                <input type="password" name="password" id="password" value={password} onChange={(e) => { checkpass(e) }} style={{ borderBottom: inpass ? "none" : "solid 2px red" }} />
                {Boolean(inpass) || <div className="er"><p className="error">{passerr}</p></div>}
                <button type="submit" >Signin</button>
                <h3>Or</h3>
                {/* </ form>  */}
                <button type="button" className="googlebtn" onClick={googleuser}><img src="https://img.icons8.com/fluent/48/000000/google-logo.png" alt="Google" /> <p>Signin with Google</p></button>
                <button id="signup" type="button">      <Link to="/signup" id="signup">Don’t have an account? Signup</Link> </button>
    
            </div>
        </form>
        <div className="footer">
            Swasthikjp©2021
      </div>
    </div>
}