import './App.css';
import googleIcon from '../src/Icons/search.png';
import facebookIcon from '../src/Icons/facebook.png';
import githubIcon from '../src/Icons/github.png';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config.js';
import { useState } from 'react';

function App() {

  const buttonStyle = {
    backgroundColor: "#323232",
    color: "white",
    padding: "10px 20px",
    borderRadius: "4px",
    fontWeight: "500",
    textTransform: "uppercase",

  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }

  var googleProvider = new firebase.auth.GoogleAuthProvider();
  var fbProvider = new firebase.auth.FacebookAuthProvider();
  var githubProvider = new firebase.auth.GithubAuthProvider();


  const [user, setUser] = useState({});

  const handleSignup = (condition) => {
    const newUser = { ...user };
    newUser.isSignedIn = false;
    newUser.condition = condition;
    setUser(newUser);

  }

  const handleInput = (e) => {
    let isFieldValid = true;
    if (e.target.name === 'email') {
      const regexpEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      isFieldValid = regexpEmail.test(e.target.value);
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 7;
      const passHasNum = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passHasNum;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }

  const handleGoogleLogin = () => {
    firebase.auth().signInWithPopup(googleProvider)
      .then((result) => {
        let user = result.user;
        const newUser = { ...user };
        newUser.isSignedIn = true;
        setUser(newUser);
        console.log(newUser);
        console.log(newUser.displayName);
      }).catch((error) => {
        var errorMessage = error.message;
        var email = error.email;
        console.log(errorMessage, email);

        const newUser = { ...user };
        newUser.isSignedIn = false;
      });
  }
  const handleFacebook = () => {

    firebase.auth().signInWithPopup(fbProvider)
      .then((result) => {
        let user = result.user;
        const newUser = { ...user };
        newUser.isSignedIn = true;
        setUser(newUser);
        console.log(newUser);
        console.log(newUser.displayName);
      })
      .catch((error) => {
        var errorMessage = error.message;
        var email = error.email;
        console.log(errorMessage, email);

      });

  }
  const handleGithub = () => {
    firebase.auth().signInWithPopup(githubProvider)
      .then((result) => {
        let user = result.user;
        const newUser = { ...user };
        newUser.isSignedIn = true;
        setUser(newUser);
        console.log(newUser);
        console.log(newUser.displayName);
      }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        console.log(errorCode, errorMessage, email);

      });
  }

  const handleSubmit = (email, password) => {
    if (user.condition && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          var user = userCredential.user;
          console.log(user);
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    }
  }

  return (
    <div className="App">
      <div className="login">
        <h1>Firebase Authentication Project</h1>
        <br />
        <p>Sign In Using:</p>
        <button onClick={handleGoogleLogin}><img src={googleIcon} alt="" /></button>
        <button onClick={handleFacebook}><img src={facebookIcon} alt="" /></button>
        <button onClick={() => handleGithub(true)} ><img src={githubIcon} alt="" /></button>
        <br />
      </div>
      <p>Or:</p>
      <div >
        <button style={buttonStyle}
          onClick={() => handleSignup(true)} >Sign up</button>
      </div>

      {
        !user.isSignedIn && user.condition ? <div>
          <form action="">
            <br />

            <div className="name">
              <label htmlFor="name">Name: </label>
              <input onBlur={handleInput } type="text" name="name" id="" placeholder="Your Name" />
            </div>

            <div className="email">
              <label htmlFor="email">Email: </label>
              <input onBlur={handleInput } type="text" name="email" id="" placeholder="Your Email" required />
            </div>

            <div className="pass">
              <label htmlFor="password">Password: </label>
              <input onBlur={handleInput } type="password" name="password" id="" placeholder="Your Password" required />
            </div>
            <input onClick={() => handleSubmit(user.email, user.password)} style={buttonStyle} type="submit" value="Submit" />
          </form>
          <p>{user.email}</p>
          <p>{user.password}</p>
        </div> : ''
      }


    </div>
  );
}

export default App;
