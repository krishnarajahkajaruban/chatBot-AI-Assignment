import "./App.css";
import image from "./img/logo.jpg";
import { useState } from "react";
import axios from 'axios';
import ScrollToBottom from 'react-scroll-to-bottom';


function App() {
  const [queryResponse, setQueryResponse] = useState([
    { query: "", response: "Welcome to the Sri Lankan Travel Agency. How can I help you today?" }
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [queries, setQueries] = useState([]);
  // const [selectedQuery, setSelectedQuery] = useState("");
  // const [loadingMessage, setLoadingMessage] = useState(false);

  const fetchResponseForQuery = async (query) => {
    let message;
    if (query) {
      message = {
        dbquery: query
      }
    } else {
      message = {
        query: userMessage
      }
    }
    // setLoadingMessage(true);
    setQueryResponse([...queryResponse, { query: (query ? query : userMessage), response: "......" }]);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASEURL}/api/query/find-matching-response`, message);
      console.log(response.data);
      setQueryResponse([...queryResponse, { query: (query ? query : userMessage), response: response.data.response }]);
    } catch (err) {
      console.log(err);
      setErrorMessage(err.response.data.error);
      setQueryResponse([...queryResponse, { query: (query ? query : userMessage), response: "Error, Something went wrong...." }]);
    } finally {
      setUserMessage("");
      // setSelectedQuery("");
      setQueries([]);
      // setLoadingMessage(false);
    }
  }

  const handleChange = async (e) => {

    setUserMessage(e.target.value);
    setErrorMessage("");

    const queryString = { queryString: e.target.value }
    if (e.target.value && e.target.value !== " ") {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BASEURL}/api/query/find-out-matching-queries`, queryString);
        console.log(response.data);
        setQueries(response.data);
      } catch (err) {
        console.log(err);
        setQueries([]);
      }
    }
  }

  return (
    <>
      <header className="header-area">
        <nav>
          <div className="container">
            <div className="nav-section">
              <a href="#" className="logo-link">
                <img src="../logo.png" className="nav-logo" alt="" />
                <span>P.P.T</span> Travels & Tours
              </a>
              <ul className="nav-link-area">
                <li>
                  <a href="#about" className="nav-link">About</a>
                </li>
                <li>
                  <a href="#chat" className="nav-link">Chat</a>
                </li>
                <li>
                  <a href="#services" className="nav-link">Services</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>


      <section className="section-padding hero-section init-section">
        <div className="container">
          <div className="hero-container">
            <div className="hero-text-area">
              <h2 className="hero-title">Welcome to  <br /><span>P.P.T <span>Travels & Tours</span></span></h2>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" id="about">

      </section>

      <div className="App">
        <div className="wrapper">
          <div className="content">
            <div className="header">
              <div className="img">
                <img src={image} alt="" />
              </div>
              <div className="right">
                <div className="name">ChatBot</div>
                <div className="status">Active</div>
              </div>
            </div>


            {errorMessage && (
              <div className="alert alert-danger mt-3" role="alert">
                {errorMessage}
              </div>
            )}

            <ScrollToBottom className="chat-body">
              {queryResponse.length > 0 &&
                queryResponse.map((qr, index) => {
                  return (
                    <div className="main" key={index}>
                      <div className="main_content">
                        <div className="messages">
                          {qr.query && (
                            <div className="human-message" id="message2">
                              <p>{qr?.query}</p>
                            </div>
                          )}
                          <div className="bot-message" id="message1">
                            <p>{qr?.response}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </ScrollToBottom>

            <div className="bottom">
              <div className="btm">
                <div className="input">
                  <input
                    type="text"
                    id="input"
                    placeholder="Enter your message"
                    value={userMessage}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        fetchResponseForQuery();
                      }
                    }}
                  />

                  {queries.length > 0 && userMessage && (
                    <div className="seach-dropdown-area">
                      {queries.map((query, index) => {
                        return (
                          <div
                            className="seach-dropdown-data"
                            key={index}
                            onClick={() => {
                              // setSelectedQuery(query);
                              setQueries([]);
                              fetchResponseForQuery(query)
                            }}
                          >
                            {query}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="btn">
                  <button
                    onClick={() => fetchResponseForQuery()} // disabled={!userMessage}
                  >
                    <i className="fas fa-paper-plane me-2"></i>Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
