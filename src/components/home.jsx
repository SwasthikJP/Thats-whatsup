import { React, useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentAlt, faCog, faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons';
import Rightchat from './rightchat';
import Blank from './blankpage';
import profilepic from '../images/prifile.jpg';
import search from '../images/search.png';
import firebase from 'firebase/app';
import 'firebase/firestore';

import Setting from './setting';
import date from 'date-and-time';
import { isMobile } from 'react-device-detect';

export default function Home(props) {



    const [ismain, setismain] = useState(1);
    const [isrightchat, setisrightchat] = useState(0);

    const [rightchats, setrightchats] = useState([]);
    const [curuser, setcuruser] = useState({});
    const [allchat, setallchat] = useState([]);
    const [usersinfo, setuersinfo] = useState([]);
    const [searchval, setsearchval] = useState("");
    const [searchlist, setsearchlist] = useState([]);
    const docid = useRef("");
    const rightindex = useRef(-1);
    const oldchat=useRef([]);


    
    useEffect(() => {

        if(Notification.permission==="default"){
            Notification.requestPermission();
         }
         var db = firebase.firestore();
         
        var unsubscribe1 = db.collection("Allchats").where("uids", "array-contains", props.user.uid).orderBy("time", "asc")
        .onSnapshot((query) => {

            var a = [];
            query.forEach((element) => {
                a.push({...element.data(),id:element.id})
            });
        
            let newarray = [];
            let notfound = true;
            a.forEach(ele => {
    
                for (var i = 0; i < newarray.length; i++) {
                    var a = newarray[i];
                    if (ele.uids[0] === props.user.uid) {
                        if (ele.uids[1] === a[0].uids[1] || ele.uids[1] === a[0].uids[0]) {
                            a.push(ele);
                            notfound = false;
                            break;
                        } else { notfound = true; }
                    } else {
                        if (ele.uids[0] === a[0].uids[1] || ele.uids[0] === a[0].uids[0]) {
                            a.push(ele);
                            notfound = false;
                            break;
                        } else notfound = true;
                    }
                }
                if (notfound) {
                    newarray.push([ele]);
                }
    
    
            });
    
    
            setallchat(prevchat=>{
                oldchat.current=prevchat;
                if(prevchat.length>newarray.length){
                    rightindex.current=-1;
                    setisrightchat(0)
                }
             return newarray});
    
            if (rightindex.current !== -1) {
                setrightchats(newarray[rightindex.current])
            }
          
        }, () => {

        });
        return () => {
            unsubscribe1();
        }

    },[props.user] );

    useEffect(() => {
        var db = firebase.firestore();
        var unsubscribe2 = db.collection("Users")
            .onSnapshot((query) => {
                var ar = [];
                query.forEach((ele) => {

                    ar.push(ele.data());
                });
                var ind;
                ind = ar.findIndex((val) => {

                    return val.uid === props.user.uid;
                })


                if (ind === -1) {
                    db.collection("Users").add({
                        uid: props.user.uid,
                        email: props.user.email,
                        displayName: props.user.displayName,
                        photoURL: props.user.photoURL,
                        ison: true
                    });

                } else {
                    docid.current = query.docs[ind].id;
                    if (!query.docs[ind].data().ison) {

                        db.collection("Users").doc(docid.current).update({
                            ison: true
                        }).then(() => {

                        }).catch(() => {
                        })
                    }
                }
               
          if(rightindex.current!==-1){
       setcuruser(prevuser=>{
        var cur = ar.find((ele) => {
            return ele.uid === prevuser.uid;
        });
        return cur;
       })
          }
                setuersinfo(ar);

            })

        return () => {
            db.collection("Users").doc(docid.current).update({
                ison: false
            }).then(() => {

            }).catch(() => {
            })

            unsubscribe2();
        }
    }, [props.user]);

    useEffect(()=>{

        

    if(oldchat.current.length!==0 && Notification.permission==="granted" && document.hidden){
        if(allchat.length>oldchat.current.length){
    
        if(allchat[allchat.length-1][0].uids[0]!==props.user.uid){
            var user=usersinfo.find((us)=>{
                    return allchat[allchat.length-1][0].uids[0]===us.uid;
               
            })

        new Notification(user.displayName||user.email,{
              body:allchat[allchat.length-1][0].message,
              icon:user.photoURL||profilepic,
          });
        }
        }else{
allchat.forEach((ele,index)=>{
  
if( ele.length>oldchat.current[index].length && ele[ele.length-1].uids[0]!==props.user.uid){

    var user=usersinfo.find((us)=>{
        // if (ele[0].uids[0] === props.user.uid){
        //    return ele[0].uids[1]===us.uid;
        // }else{
            return ele[ele.length-1].uids[0]===us.uid;
        // }
    })

new Notification(user.displayName||user.email,{
      body:ele[ele.length-1].message,
      icon:user.photoURL||profilepic,
  });
}

})
        }
    }

    },[allchat,props.user,usersinfo]);


    const toggle = (val) => {
        if (val) {
            setisrightchat(0);
        }
        rightindex.current = -1;
        setismain(val);
    }

    const rightchaton = (chat, index, curuser) => {
        rightindex.current = index;
        setrightchats(chat);
        setcuruser(curuser);
        setisrightchat(1);
    }

    const searchfun = (e) => {
        setsearchval(e.target.value);
        setsearchlist(usersinfo.filter((val, index) => {
            return ((RegExp(e.target.value, 'i').test(val.displayName)) || (RegExp(e.target.value, 'i').test(val.email))) && (val.uid !== props.user.uid);
        })
        )
    }

    const gotochat = (user) => {
        var a;
        var inde;
        a = allchat.findIndex((val, ind) => {
            inde = ind;
            return user.uid === (val[0].uids[0] === props.user.uid ? val[0].uids[1] : val[0].uids[0])
        })
        if (a === -1) {
            rightchaton([], inde + 1, user);
        } else {
            rightchaton(allchat[a], a, user);
        }
    }

    const timeconvert = (chat) => {
        if (chat.time !== null) {
            var time = chat.time.toDate();
            if (date.isSameDay(new Date(), time)) {
                return date.format(time, 'h:mm')
            } else {
                if (date.isSameDay(date.addDays(new Date(), -1), time)) {
                    return "yesterday";
                } else {
                    return date.format(time, 'D/M/YY');
                }
            }
        } else {
            return "";
        }
    }


    if (isMobile) {
        return <div>
            <nav id="mobnav">

                {Boolean(ismain && !isrightchat) || <button type="button" style={{ margin: "0 5px 0 0" }} onClick={() => { toggle(1) }} className="send"><FontAwesomeIcon icon={faChevronCircleLeft} color='lightgrey' size='2x' /></button>}
                <h1 style={{ display: "inline-block",marginRight: "auto" }}>Thats whatsup</h1>

                {Boolean(!ismain) || <button ><FontAwesomeIcon style={{ cursor: "pointer" }} icon={faCog} color={ismain ? 'grey' : 'lightgrey'} size='2x' onClick={() => {
                    toggle(0);
                }} /></button>}
                {Boolean(!ismain) || <button className="profile" style={{ margin: "0" }} ><img id="profilepic" src={props.user.photoURL || profilepic} alt="profile" /></button>}
            </nav>

            {ismain ?
                isrightchat ? <Rightchat chats={rightchats} mainuser={props.user.uid} curuser={curuser} /> :
                    <div className="allchats" style={{ borderRight: "none" , width: "100%" }}>
                        <div className="profilechat" style={{ height: "7vh" }}>
                            <img id="searchpic" src={search} alt="userprofile" />
                            <div className="userandtext userandtext2">
                                <input type="search" name="search" id="searchin" placeholder="Search using name or email"
                                    value={searchval} onChange={searchfun} />
                            </div>
                        </div>

                        {searchval.length !== 0 ?
                            searchlist.map((val, index) => {
                                return <div className="profilechat"
                                    onClick={() => gotochat(val)}
                                    key={val.uid || index} >
                                    <img className="profilephoto" src={val.photoURL||profilepic} alt="userprofile" />
                                    <div className="userandtext userandtext3">
                                        <p className="username" style={{ fontSize: "large" }}>{val.displayName||val.email}</p>
                                        {/* <p className="sidemessage">{chat[chat.length - 1].message}</p> */}
                                    </div>
                                </div>
                            })
                            :
                            allchat.length !== 0 ? allchat.map((chat, index) => {

                                var curuser = usersinfo.find((ele) => {
                                    return ele.uid === (chat[0].uids[0] === props.user.uid ? chat[0].uids[1] : chat[0].uids[0]);
                                }) || "User not found";



                                return <div className="profilechat" onClick={() => { rightchaton(chat, index, curuser) }}
                                    style={{ border: rightindex.current === index ? "2px solid grey" : "none" , backgroundColor: rightindex.current === index ? "#5a5a5a" : "#444444" }}
                                    key={curuser.uid || index} >
                                    <img className="profilephoto" src={curuser.photoURL||profilepic} alt="userprofile" />
                                    <div className="userandtext">
                                        <p className="username">{curuser.displayName||curuser.email}</p>
                                        <p className="sidemessage">{chat[chat.length - 1].message}</p>
                                    </div>
                                    <p className="time">{timeconvert(chat[chat.length - 1])}</p>
                                </div>
                            }) : <div className="profilechat"  >

                                <div className="userandtext">
                                    <p className="username">Start chating</p>

                                </div>
                            </div>

                        }


                    </div>


                :

                <Setting user={props.user} docid={docid.current} />
            }

        </div>
    }


    return <div className='main'>
        <div className="leftnav">
            <button className="message" ><FontAwesomeIcon style={{ cursor: "pointer" }} icon={faCommentAlt} color={ismain ? 'lightgrey' : 'grey'} size='2x' onClick={() => { toggle(1) }} /></button>
            <button className="setting"><FontAwesomeIcon style={{ cursor: "pointer" }} icon={faCog} color={ismain ? 'grey' : 'lightgrey'} size='2x' onClick={() => {
                toggle(0);


            }} /></button>
            <button className="profile" ><img id="profilepic" src={props.user.photoURL || profilepic} alt="profile" /></button>
        </div>




        {ismain ?
            <div className="allchats">
                <h1>Thats whatsup</h1>
                <div className="profilechat" >
                    <img id="searchpic" src={search} alt="userprofile" />
                    <div className="userandtext userandtext2">
                        <input type="search" name="search" id="searchin" placeholder="Search using name or email"
                            value={searchval} onChange={searchfun} />
                    </div>
                </div>

                {searchval.length !== 0 ?
                    searchlist.map((val, index) => {
                        return <div className="profilechat"
                            onClick={() => gotochat(val)}
                            key={val.uid || index} >
                            <img className="profilephoto" src={val.photoURL||profilepic} alt="userprofile" />
                            <div className="userandtext userandtext3">
                                <p className="username" style={{ fontSize: "large" }}>{val.displayName||val.email}</p>
                                {/* <p className="sidemessage">{chat[chat.length - 1].message}</p> */}
                            </div>
                        </div>
                    })
                    :
                    allchat.length !== 0 ? allchat.map((chat, index) => {

                        var curuser = usersinfo.find((ele) => {
                            return ele.uid === (chat[0].uids[0] === props.user.uid ? chat[0].uids[1] : chat[0].uids[0]);
                        }) || "User not found";
  
                  
                        return <div className="profilechat" onClick={() => { rightchaton(chat, index, curuser) }}
                            style={{ border: rightindex.current === index ? "2px solid gray" : "none" , backgroundColor: rightindex.current === index ? "#5a5a5a" : "#444444" }}
                            key={curuser.uid || index} >
                            <img className="profilephoto" src={curuser.photoURL || profilepic} alt="userprofile" />
                            <div className="userandtext">
                                <p className="username">{curuser.displayName||curuser.email}</p>
                                <p className="sidemessage">{chat[chat.length - 1].message}</p>
                            </div>
                            <p className="time">{timeconvert(chat[chat.length - 1])}</p>
                        </div>
                    }) : <div className="profilechat"  >

                        <div className="userandtext">
                            <p className="username">Start chating</p>

                        </div>
                    </div>

                }


            </div>


            :

            <Setting user={props.user} docid={docid.current} />
        }




        {isrightchat && ismain ? <Rightchat chats={rightchats} mainuser={props.user.uid} curuser={curuser} /> : <Blank />}

    </div>;


}