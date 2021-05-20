import { React, useRef, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import {isMobile} from 'react-device-detect';

export default function Setting(props) {


    const [username,setusername]=useState(props.user.displayName);
    const [onchangename,setonchagename]=useState("none");
    const [onchangepic,setonchangepic]=useState("none");
    const [file,setfile]=useState(null);
    const imgref=useRef(null);
    const inputref=useRef(null);

const changename=()=>{
firebase.auth().currentUser.updateProfile({
    displayName:username
}).then(()=>{
  
    var db=firebase.firestore();
 
db.collection("Users").doc(props.docid).update({
    displayName:username
}).then(()=>{
setonchagename("3px green solid")
}).catch((err)=>{
    setonchagename("3px red solid")
})
}).catch((e)=>{
    setonchagename("3px red solid")
});


}


const logout=()=>{
    firebase.auth().signOut();
}


const deleteac=()=>{
    firebase.auth().currentUser.delete().then(()=>{
 
    }).catch((e)=>{

    })
     
}

const localphoto=(e)=>{
    if(e.target.files.length!==0){
imgref.current.src=URL.createObjectURL(e.target.files[0]);

setfile(e.target.files[0]);
    }
}

const uploadphoto=()=>{
    if(file!=null){
    firebase.storage().ref().child(props.user.uid+".jpg").put(file).then((snapshot)=>{

snapshot.ref.getDownloadURL().then((v)=>{
    firebase.auth().currentUser.updateProfile({
        photoURL:v
    }).then(()=>{
      
        var db=firebase.firestore();
     
    db.collection("Users").doc(props.docid).update({
        photoURL:v
    }).then(()=>{
    setonchangepic("3px green solid")
URL.revokeObjectURL(imgref.current.src)
    }).catch(()=>{
        setonchangepic("3px red solid")
    })
    }).catch(()=>{
        setonchangepic("3px red solid")
    });

})
    }).catch(()=>{
        setonchangepic("3px red solid")
    })
}
}



if(isMobile){
    return <div>
<div className="allchats" style={{width:"100vw"}}>
        <div className="profilechat profilechat2"style={{height:"10vh"}}>
            <div className=" userandtext userandtext2">
                <input ref={inputref} type="file" name="imagefile" id="imagefile" accept="image/*" onChange={(e)=>{localphoto(e)}}/>
                <img style={{border:onchangepic}} ref={imgref} src={props.user.photoURL} alt="profle" id="profilepic" onClick={()=>{inputref.current.click();}}/>
                <button className="username username2" onClick={uploadphoto}>Change profilepicture</ button>
        
            </div>
        </div>

        <div className="profilechat profilechat2">
          
            <div className="userandtext userandtext2">
                 <input id="changeun" type="text" value={username} onChange={(e)=>{setusername(e.target.value)}} 
                 style={{border:onchangename}} />
             
                <button className="username username2" onClick={changename}>Change Username</button>

            </div>

        </div>


        <div className="profilechat ">
            <div className="userandtext userandtext2">
                <button className="username username2" onClick={logout} style={{height:"7vh"}}>Log out</ button>

            </div>
        </div>

      
        <div className="profilechat ">
            <div className="userandtext userandtext2">
                <button className="username username2" onClick={deleteac}>Delete Account</ button>
                <p className="sidemessage">User needs to be logged in recently to perform this</p>
            </div>


        </div>

    </div>

    </div>
}

    return <div className="allchats">
        <h1>Thats whatsup</h1>
        <div className="profilechat profilechat2">
            <div className=" userandtext userandtext2">
                <input ref={inputref} type="file" name="imagefile" id="imagefile" accept="image/*" onChange={(e)=>{localphoto(e)}}/>
                <img style={{border:onchangepic}} ref={imgref} src={props.user.photoURL} alt="profle" id="profilepic" onClick={()=>{inputref.current.click();}}/>
                <button className="username username2" onClick={uploadphoto}>Change profilepicture</ button>
        
            </div>
        </div>

        <div className="profilechat profilechat2">
          
            <div className="userandtext userandtext2">
                 <input id="changeun" type="text" value={username} onChange={(e)=>{setusername(e.target.value)}} 
                 style={{border:onchangename}} />
             
                <button className="username username2" onClick={changename}>Change Username</button>

            </div>

        </div>


        <div className="profilechat ">
            <div className="userandtext userandtext2">
                <button className="username username2" onClick={logout}>Log out</ button>

            </div>
        </div>

      
        <div className="profilechat ">
            <div className="userandtext userandtext2">
                <button className="username username2" onClick={deleteac}>Delete Account</ button>
                <p className="sidemessage">User needs to be logged in recently to perform this</p>
            </div>


        </div>

    </div>
}