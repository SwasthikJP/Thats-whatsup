import { React, useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import firebase from 'firebase/app';
import 'firebase/firestore';
import date from 'date-and-time';
import { isMobile } from 'react-device-detect';
import profilepic from '../images/prifile.jpg';


export default function Rightchat(props) {

  const btmdiv = useRef(null);
  const [newchat, setnewchat] = useState("");

  var db = null;

  useEffect(() => {

    btmdiv.current.scrollIntoView({ behavior: "smooth" })
  }, [props.chats])

  useEffect(() => {
    setnewchat("");
  }, [props.curuser.uid]);


  const sendchat = (e) => {
    e.preventDefault();
    if (newchat.trim().length !== 0) {
      db = firebase.firestore();
      db.collection("Allchats").add({
        uids: [props.mainuser, props.curuser.uid],
        time: firebase.firestore.FieldValue.serverTimestamp(),
        message: newchat
      }).then((result) => {

        setnewchat("")
        btmdiv.current.scrollIntoView({ behavior: "smooth" })

      }).catch(() => {
      })
    }
  }

  const deletechat = (chat) => {
    db = firebase.firestore();
    db.collection("Allchats").doc(chat.id).delete().then(() => {
    })
  }

  const writechat = () => {
    var curdate = "";
    var bo = false;
    if (props.chats === undefined) {
      return <p className="time2" style={{ color: "white", fontSize: "1rem" }}>Start chatting</p>
    }
    return props.chats.map((chat, ind) => {
      if (chat.time !== null) {
        var tdate = date.format(chat.time.toDate(), 'DD/MM/YYYY');

        if (tdate === curdate) {
          bo = true;
        } else {
          curdate = tdate;
          bo = false;
        }
      } else { bo = true; }

      return <div key={chat.time || ind} >
        {Boolean(bo) || <p className="time2">{timeconvert(chat)}</p>}
        <div className="chatbox" style={{ alignItems: chat.uids[0] === props.mainuser ? "flex-end" : "flex-start" }}>
          <div className="hoverthis" style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
            {Boolean(chat.uids[0] !== props.mainuser) || <button className="deletebutton" ><p className="chat" style={{ backgroundColor: chat.uids[0] === props.mainuser ? "#AA30F4" : "#5A585B", display: "inline-block", whiteSpace: "nowrap" }} onClick={() => deletechat(chat)}>Delete message </p></button>}
            <p className="chat" style={{ backgroundColor: chat.uids[0] === props.mainuser ? "#AA30F4" : "#5A585B" }}>{chat.message} </p>
          </div>
          <p className="time3">{Boolean(chat.time === null) || date.format(chat.time.toDate(), 'h:mm')}</p>
        </div>
      </div>


    })
  }


  const timeconvert = (chat) => {
    var time = chat.time.toDate();
    if (date.isSameDay(new Date(), time)) {
      return "Today";
    } else {
      if (date.isSameDay(date.addDays(new Date(), -1), time)) {
        return "Yesterday";
      } else {
        return date.format(time, 'D/M/YY');
      }
    }
  }


  if (isMobile) {
    return <div className="rightchat" style={{ width: "100vw" }}>

      <div className="menu">
        <img className="profilephoto" style={{ marginRight: "4%" }} src={props.curuser.photoURL||profilepic} alt="user profile" />
        <div className="userandtext">
          <p className="username">{props.curuser.displayName||props.curuser.email}</p>
          <p className="online" style={{ color: 'lightgreen' }}>{props.curuser.ison ? "online" : "offline"}</p>
        </div>
      </div>
      <div className="totalchat" style={{height:"73vh"}} >

        {writechat()}

        <div ref={btmdiv} ></div>


      </div>
      <form onSubmit={sendchat} >
        <div className="messagetype" style={{ height: "7vh" }}>

          <div className="typebox">
            <textarea value={newchat} name="typechat" id="typechat" cols="58" rows="10" onChange={(e) => { setnewchat(e.target.value) }}></textarea>
          </div>
          <button type="submit" className="send"><FontAwesomeIcon icon={faChevronCircleRight} color='lightgrey' size='2x' /></button>

        </div>
      </form>
    </div>
  }


  return <div className="rightchat">
    <div className="menu">
      <img className="profilephoto" style={{ marginRight: "4%" }} src={props.curuser.photoURL||profilepic} alt="user profile" />
      <div className="userandtext">
        <p className="username">{props.curuser.displayName||props.curuser.email}</p>
        <p className="online" style={{ color: 'lightgreen' }}>{props.curuser.ison ? "online" : "offline"}</p>
      </div>
    </div>
    <div className="totalchat" >

      {writechat()}

      <div ref={btmdiv} ></div>


    </div>
    <form onSubmit={sendchat} >
      <div className="messagetype">

        <div className="typebox" >
          <textarea value={newchat} name="typechat" id="typechat" cols="58" rows="10" onChange={(e) => { setnewchat(e.target.value) }}></textarea>
        </div>
        <button type="submit" className="send"><FontAwesomeIcon icon={faChevronCircleRight} color='lightgrey' size='2x' /></button>

      </div>
    </form>
  </div>
}