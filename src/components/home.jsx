import { React, useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentAlt, faCog, } from '@fortawesome/free-solid-svg-icons';
import Rightchat from './rightchat';
import Blank from './blankpage';
import axios from 'axios';
import profilepic from '../images/prifile.jpg';
import search from '../images/search.png';
import firebase from 'firebase';
import Setting from './setting';
import date from 'date-and-time';


export default function Home(props) {

    // const chats = [{
    //     user1: 'a',
    //     user2: 'b',
    //     message: 'hi',
    //     time: "October 13, 2014 11:13:00"

    // },
    // {
    //     user1: 'a',
    //     user2: 'c',
    //     message: 'hi',
    //     time: "October 13, 2014 11:13:00"
    // },
    // {
    //     user1: 'a',
    //     user2: 'd',
    //     message: 'hi3',
    //     time: "October 13, 2014 11:13:00"
    // },
    // ];


    const [ismain, setismain] = useState(1);
    const [isrightchat, setisrightchat] = useState(0);

    const [rightchats, setrightchats] = useState([]);
    const [curuser,setcuruser]=useState({});
    const [allchat, setallchat] = useState([]);
    const [usersinfo, setuersinfo] = useState([]);
    const [searchval,setsearchval]=useState("");
    const [searchlist,setsearchlist]=useState([]);
    const docid=useRef("");
    const rightindex = useRef(-1);
    var db = null;
    var unsubscribe1;
    var unsubscribe2;

    const getchats = async () => {
        await axios.post('http://localhost:5000/Allchats', {
            email1: "swasthikjp@gmail.com",
            email2: "jack@gmail.com"
        }).then((val) => {
            console.log(val.data);
            setallchat(val.data);
        }).catch((err) => {
            console.log(err);
        })
    }

    const sortchat = (data) => {
        let newarray = [];
        let notfound = true;
        console.log(data);
        data.forEach(ele => {

            for (var i = 0; i < newarray.length; i++) {
                var a = newarray[i];
                if (ele.uids[0] === props.user.uid) {
                    if (ele.uids[1] == a[0].uids[1] || ele.uids[1] == a[0].uids[0]) {
                        a.push(ele);
                        notfound = false;
                        break;
                    } else { notfound = true; }
                } else {
                    if (ele.uids[0] == a[0].uids[1] || ele.uids[0] == a[0].uids[0]) {
                        a.push(ele);

                        notfound = false;
                        break;
                    } else notfound = true;
                }
                console.log("executed");
            }
            //
            if (notfound) {
                newarray.push([ele]);
            }


        });
       
        // setrightchats(rightindex!=-1&& rightchats!=[]? newarray[1]:rightchats);
        console.log(rightindex)
        console.log(newarray);
        setallchat(newarray);

        if (rightindex.current !== -1) {

            setrightchats(newarray[rightindex.current])
        }

        //   setisrightchat(1);

    }

    console.log(rightindex)
    const stream = () => {
        return db.collection("Allchats").where("uids", "array-contains", props.user.uid).orderBy("time", "asc")
            .onSnapshot((query) => {
                var a = [];
                query.forEach((element) => {
                    console.log('executed');
                    console.log(element.data());
                    a.push(element.data())
                });
                sortchat([...a]);
            }, (error) => {
                console.log(error);
            })


    }

    useEffect(() => {

        db = firebase.firestore();

        unsubscribe1 = stream();



        // db.collection("Users").where("email","==",props.user.email)
        // .get().then((query)=>{

        //     if(query.size===0){
        //         db.collection("Users").add({
        //             uid:props.user.uid,
        //             email:props.user.email,
        //             displayName:props.user.displayName,
        //             photoURL:props.user.photoURL
        //         })   
        //    }
        // });



        return () => {
            unsubscribe1();
        }

    }, [props.user]);

    useEffect(() => {
        db = firebase.firestore();
        unsubscribe2 = db.collection("Users")
            .onSnapshot((query) => {
                var ar = [];
                query.forEach((ele) => {
                 
                    ar.push(ele.data());
                });
   console.log(query.docs[0].id);
   var ind;
   ind=ar.findIndex((val) => {

    return val.uid === props.user.uid;
})


                if (ind === -1) {
                    db.collection("Users").add({
                        uid: props.user.uid,
                        email: props.user.email,
                        displayName: props.user.displayName,
                        photoURL: props.user.photoURL,
                        ison:true
                    });

                }else{
                    docid.current=query.docs[ind].id;
                    if(!query.docs[ind].data().ison){
                
                    db.collection("Users").doc(docid.current).update({
                        ison:true
                    }).then(()=>{

                    }).catch((err)=>{
                        console.log(err);
                    })
                }
                }
             
                setuersinfo(ar);
                console.log(ar)
            })

        return () => {
            db.collection("Users").doc(docid.current).update({
                ison:false
            }).then(()=>{

            }).catch((err)=>{
                console.log(err);
            })
    
            unsubscribe2();
        }
    }, []);


    const toggle = (val) => {
        if (val) {
            setisrightchat(0);
        }
        rightindex.current = -1;
        setismain(val);
    }

    const rightchaton = (chat, index,curuser) => {
        rightindex.current = index;
        setrightchats(chat);
        setcuruser(curuser);
        setisrightchat(1);
    }

    const searchfun=(e)=>{
        console.log(e.target.value);
        setsearchval(e.target.value);
      setsearchlist(usersinfo.filter((val,index)=>{
            return ((RegExp(e.target.value,'i').test(val.displayName))||(RegExp(e.target.value,'i').test(val.email)))&&(val.uid!==props.user.uid);
        })
      )
      console.log(searchlist)
    }

    const gotochat=(user)=>{
        var a;
        var inde;
      a=allchat.findIndex((val,ind)=>{
          inde=ind;
            return user.uid===(val[0].uids[0] == props.user.uid ? val[0].uids[1] : val[0].uids[0])
        })
      if(a===-1){
          rightchaton([],inde+1,user);
        }else{
            console.log(a);
            rightchaton(allchat[a],a,user);
        }
    }

    const timeconvert=(chat)=>{
    if(chat.time!==null){
var time=chat.time.toDate();
if(date.isSameDay(new Date(),time)){
    return date.format(time,'h:mm')
}else{
    if(date.isSameDay(date.addDays(new Date(),-1),time)){
        return "yesterday";
    }else{
        return date.format(time,'D/M/YY');
    }
}
    }else{
        return "";
    }
    }


    return <div className='main'>
        <div className="leftnav">
            <button className="message" ><FontAwesomeIcon style={{cursor:"pointer"}} icon={faCommentAlt} color={ismain ? 'lightgrey' : 'grey'} size='2x' onClick={() => { toggle(1) }} /></button>
            <button className="setting"><FontAwesomeIcon style={{cursor:"pointer"}} icon={faCog} color={ismain ? 'grey' : 'lightgrey'} size='2x' onClick={() => {
                toggle(0);
                // firebase.auth().signOut();

            }} /></button>
            <button className="profile" ><img id="profilepic" src={props.user.photoURL ||  profilepic} alt="" /></button>
        </div>




        {ismain ?
            <div className="allchats">
                <h1>Thats whatsup</h1>
                <div className="profilechat" >
                        <img  id="searchpic" src={search} alt="userprofile"  />
                        <div className="userandtext userandtext2">
                           <input type="search" name="search" id="searchin" placeholder="Search using name or email" 
                             value={searchval}    onChange={searchfun}/>
                        </div>
                    </div>

                {searchval.length!==0?
               searchlist.map((val,index)=>{
             return <div className="profilechat" 
              onClick={()=>gotochat(val)}
                key={val.uid || index} >
                <img  className="profilephoto" src={val.photoURL} alt="userprofile" />
                <div className="userandtext userandtext3">
                    <p className="username" style={{fontSize:"large"}}>{val.displayName}</p>
                    {/* <p className="sidemessage">{chat[chat.length - 1].message}</p> */}
                </div>
            </div>
                })
             :
                allchat.length !== 0 ? allchat.map((chat, index) => {

                    var curuser = usersinfo.find((ele) => {
                        return ele.uid == (chat[0].uids[0] == props.user.uid ? chat[0].uids[1] : chat[0].uids[0]);
                    }) || "User not found";
                  
                    

                    return <div className="profilechat" onClick={() => { rightchaton(chat, index,curuser) }}
                        style={{ border: rightindex.current == index ? "2px solid red" : "none" }, { backgroundColor: rightindex.current == index ? "#5a5a5a" : "#444444" }}
                        key={curuser.uid || index} >
                        <img  className="profilephoto" src={curuser.photoURL} alt="userprofile" />
                        <div className="userandtext">
                            <p className="username">{curuser.displayName}</p>
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

           <Setting user={props.user} docid={docid.current}/>
        }




        {isrightchat && ismain ? <Rightchat chats={rightchats} mainuser={props.user.uid} curuser={curuser} /> : <Blank />}

    </div>;


}