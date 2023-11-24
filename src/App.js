import React, { useState } from 'react'

import { TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions'

const SESSION = new StringSession('') //create a new StringSession, also you can use StoreSession
const API_ID = *** // put your API id here
const API_HASH = '***' // put your API hash here

const client = new TelegramClient(SESSION, API_ID, API_HASH, { connectionRetries: 5 }) // Immediately create a client using your application data

const initialState = { phoneNumber: '', password: '', phoneCode: '' } // Initialize component initial state

function App () {
  const [{ phoneNumber, password, phoneCode }, setAuthInfo] = useState(initialState)

  async function sendCodeHandler () {
    await client.connect() // Connecting to the server
    await client.sendCode(
      {
        apiId: API_ID,
        apiHash: API_HASH
      },
      phoneNumber
    )
  }

  async function clientStartHandler () {
    try {
      await client.start({ phoneNumber, password: userAuthParamCallback(password), phoneCode: userAuthParamCallback(phoneCode), onError: () => {} })
      localStorage.setItem('session', JSON.stringify(client.session.save())) // Save session to local storage
      await client.sendMessage('me', { message: "You're successfully logged in!" })
    } catch (error) {
      console.dir(error)
      // Error handling logic
    }
  }


  function inputChangeHandler ({ target: { name, value } }) {
    setAuthInfo((authInfo) => ({ ...authInfo, [name]: value }))
  }

  function userAuthParamCallback (param) {
    return async function () {
      return await new (resolve => {
        resolve(param)
      })()
    }
  }

  return (
    <>
      <input
        type="text"
        name="phoneNumber"
        value={phoneNumber}
        onChange={inputChangeHandler}
      />

      <input
        type="text"
        name="password"
        value={password}
        onChange={inputChangeHandler}
      />

      <input type="button" value="start client" onClick={sendCodeHandler} />

      <input
        type="text"
        name="phoneCode"
        value={phoneCode}
        onChange={inputChangeHandler}
      />

      <input type="button" value="insert code" onClick={clientStartHandler} />
    </>
  )
}

export default App;
