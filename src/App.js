import './App.css';
import axios from 'axios';
import { useState } from 'react';

function App() {
  const [userchat, setUserchat] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [context, setContext] = useState("");

  const generateResponse = async (e) => {
    e.preventDefault();

    if (!userchat) {
      return;
    }

    setIsLoading(true);

    const options = {
      method: 'POST',
      url: 'https://chatgpt-bing-ai-chat-api.p.rapidapi.com/ask',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': '26ce35ec0emsh3bcf5a81ef9bcf6p17431cjsn048a9d5d7ff4',
        'X-RapidAPI-Host': 'chatgpt-bing-ai-chat-api.p.rapidapi.com',
      },
      data: {
        question: `${userchat}`,
        bing_u_cookie: 'MUID=2B90A94847EB6C69398FBA6F46ED6D4F',
        context: context,
      },
    };

    try {
      setChat((prevChat) => [...prevChat, { user: userchat, loading: true }]);
      const response = await axios.request(options);
      setChat((prevChat) => [
        ...prevChat.slice(0, prevChat.length - 1),
        { user: userchat, loading: false },
        { bot: response.data.text_response, loading: false },
      ]);
      console.log(response.data);
      setContext(response.data.context);
    } catch (error) {
      console.error(error);
    }

    setUserchat("");
    setIsLoading(false);
  };

  return (
    <>
      <div className="App">
        <form onSubmit={generateResponse}>
          <label htmlFor="chat">My GPT</label>
          <div className="input-container">
            <input
              type="text"
              name="chat"
              id="chat"
              value={userchat}
              onChange={(e) => setUserchat(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </div>
        </form>
      </div>
      <div className="chats">
        {chat.map((message, index) => (
          <div key={index} className="message-container">
            {message.user && (
              <div className={`message user-message ${message.loading ? "loading" : ""}`}>
                {message.user}
              </div>
            )}
            {message.bot && (
              <div className={`message bot-message ${message.loading ? "loading" : ""}`}>
                <h2>{message.bot}</h2>
              </div>
            )}
          </div>
        ))}
        {isLoading && <div className="loader"></div>}
      </div>
    </>
  );
}

export default App;
