import "./App.css";
import "./chat.css";
import image from "./img/bot-icon.png";
import bot_avatar from "./img/bot-avatar.png";
import human_avatar from "./img/human-avatar.png";
import { useState, useEffect, useRef } from "react";
import axios from 'axios';
// import $ from 'jquery';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ScrollToBottom from 'react-scroll-to-bottom';


function App() {
  const [scrolled, setScrolled] = useState(false);
  const chatInputRef = useRef(null);

  const [queryResponse, setQueryResponse] = useState([
    { query: "", response: "Welcome to the P.P.T Travels & Tours. How can I help you today?" }
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [queries, setQueries] = useState([]);
  // const [selectedQuery, setSelectedQuery] = useState("");
  // const [loadingMessage, setLoadingMessage] = useState(false);


  /////
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const offsetTop = targetElement.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    function animateNumber(element, targetNumber) {
      let currentNumber = 0;
      const increment = Math.ceil(targetNumber / 100);
      const animationDuration = 4000;

      const updateNumber = () => {
        currentNumber += increment;
        if (currentNumber >= targetNumber) {
          currentNumber = targetNumber;
          clearInterval(interval);
        }
        element.textContent = `${(currentNumber / 1).toFixed()}+`;
      };

      const interval = setInterval(updateNumber, animationDuration / 100);
    }

    function handleIntersection(entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const numbers = document.querySelectorAll('.achievment-count');
          numbers.forEach(numberElement => {
            const targetNumber = parseInt(numberElement.getAttribute('data-target'));
            animateNumber(numberElement, targetNumber);
          });
          observer.unobserve(entry.target);
        }
      });
    }

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    });

    const section = document.querySelector('.achievment-area');
    observer.observe(section);
  }, []);

  useEffect(() => {
    const handleChatKeyDown = (event) => {
      if (event.ctrlKey && event.key === '/' && chatInputRef.current) {
        chatInputRef.current.focus();
      }
    };

    document.addEventListener('keydown', handleChatKeyDown);
    return () => {
      document.removeEventListener('keydown', handleChatKeyDown);
    };
  }, []);
  /////

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
    setQueryResponse([...queryResponse, {
      query: (query ? query : userMessage), response:
        <div className="loading-chat">
          <Skeleton circle={true} height={5} width={5} />
          <Skeleton circle={true} height={5} width={5} />
          <Skeleton circle={true} height={5} width={5} />
          <Skeleton circle={true} height={5} width={5} />
          <Skeleton circle={true} height={5} width={5} />
        </div>
    }]);
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
      <header className={`header-area ${scrolled ? 'scrolled' : ''}`}>
        <nav>
          <div className="container">
            <div className="nav-section">
              <a href="#top" onClick={(e) => handleNavClick(e, 'top')} className="logo-link">
                <img src="../logo.png" className="nav-logo" alt="" />
                <span>P.P.T</span> Travels & Tours
              </a>
              <ul className="nav-link-area">
                <li>
                  <a href="#about" onClick={(e) => handleNavClick(e, 'about')}
                    className="nav-link">About</a>
                </li>
                <li>
                  <a href="#chat" onClick={(e) => handleNavClick(e, 'chat')}
                    className="nav-link">Chat</a>
                </li>
                <li>
                  <a href="#services" onClick={(e) => handleNavClick(e, 'services')}
                    className="nav-link">Services</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <section className="section-padding hero-section init-section" id="top">
        <div className="container-fluid">
          <div className="hero-container">
            <div className="container">
              <div className="row">
                <div className="col-12 col-xl-9">
                  <h2 className="hero-title" data-aos="fade-down">Welcome to  <br /><span>P.P.T <span>Travels & Tours</span></span></h2>
                  <h4 className="hero-sub-title mt-3" data-aos="fade-left">Discover the Ultimate Luxury Travel Experience</h4>
                  <p className="hero-desc mt-4" data-aos="fade-up">
                    Embark on a journey like no other with Sri Lanka's premier luxury bus service. Whether you're a local or a foreign traveler, our top-notch fleet, exceptional service, and extensive network of routes ensure that your travel experience is nothing short of extraordinary. Book your adventure with P.P.T Travels & Tours today and travel the way you deserve.
                  </p>

                  <p className="hero-desc mt-3" data-aos="fade-up" data-aos-delay="200">
                    At P.P.T Travels & Tours, we prioritize your comfort and convenience. With years of experience and a fleet of state-of-the-art buses, we set the standard for luxury travel in Sri Lanka. Explore new destinations, enjoy seamless bookings, and experience unparalleled service with the renowned PPT Express. Start your unforgettable journey with us now.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding position-relative" id="about">
        <div className="container">
          <div className="row">
            <div className="col-12 col-xxl-6 col-xl-6">
              <div className="about-us-container w-100 pe-xl-5">
                <h6 className="section-label" data-aos="fade-left">About us</h6>
                <h3 className="section-heading" data-aos="zoom-out">Journey with P.P.T</h3>
                <p className="section-para mt-4" data-aos="fade">
                  PPT Travels and tours, a renowned name in the travel industry of Sri Lanka is a specialized bus service that provides many travel opportunities to both local and foreign travelers. Known as the PPT express by its many customers in Sri Lanka, we at PPT travels has been leading the way for many years and setting standards along the way for Bus services all around the country.
                </p>

                <p className="section-para" data-aos="fade">
                  PPT bus service is truly exquisite in terms of comfort and convenience where we provide exciting travel packages, transport facilities and offer bus services from Colombo to many different regions in Sri Lanka at affordable price. Daily PPT express bus service from Colombo to Jaffna has taken special notice by our customers for its ease that is met with luxury and affordability.
                </p>
              </div>
            </div>
            <div className="col-12 col-xxl-6 col-xl-6">
              <img src="../bus.png" className="about-img" data-aos="zoom-in-left" data-aos-duration="1500" alt="" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding achievment-section bg-gray position-relative" data-aos="fade-right">
        <div className="container">
          <div className="row">
            <div className="col-12 col-xl-3 col-md-6">
              <div className="achievment-area">
                <h1 className="achievment-count" data-target="55">0</h1>
                <h6 className="achievment">Buses in Fleet</h6>
              </div>
            </div>

            <div className="col-12 col-xl-3 col-md-6">
              <div className="achievment-area">
                <h1 className="achievment-count" data-target="25">0</h1>
                <h6 className="achievment">Years of Service</h6>
              </div>
            </div>

            <div className="col-12 col-xl-3 col-md-6">
              <div className="achievment-area">
                <h1 className="achievment-count" data-target="150">0</h1>
                <h6 className="achievment">Destinations Covered</h6>
              </div>
            </div>

            <div className="col-12 col-xl-3 col-md-6">
              <div className="achievment-area">
                <h1 className="achievment-count" data-target="50">0</h1>
                <h6 className="achievment">Daily Departures</h6>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding chat-section position-relative" id="chat">
        <div className="container">
          <div className="row">
            <div className="col-12 col-xl-7">
              <div className="about-us-container w-100 pe-xl-5">
                <h6 className="section-label" data-aos="fade-left">Chat</h6>
                <h3 className="section-heading" data-aos="zoom-out">
                  Instant Assistance with Our ChatBot
                </h3>
                <p className="section-para mt-4" data-aos="fade">
                  Welcome to the future of travel assistance with P.P.T Travels & Tours' advanced ChatBot. Designed to provide you with seamless support, our ChatBot is available 24/7 to help you with all your travel needs. Whether you're checking bookings, confirming vehicle departure times, verifying seat availability, or exploring the luxurious features of our fleet, our ChatBot makes it easy and efficient.
                </p>

                <p className="section-para" data-aos="fade">
                  Need to make last-minute changes to your travel itinerary? Our ChatBot can handle that. Want to know more about our services and routes? Just ask. With real-time updates and instant responses, our ChatBot ensures that you have all the information you need at your fingertips.
                </p>

                <p className="section-para" data-aos="fade">
                  At P.P.T Travels & Tours, we understand the importance of a smooth travel experience. Our ChatBot is here to simplify the process, offering you the convenience of instant assistance from the comfort of your device. Start chatting now to experience the ease and efficiency of our state-of-the-art travel support system. Your journey to comfort and luxury begins with a simple chat.
                </p>
              </div>
            </div>

            <div className="col-12 col-xl-5">
              <div className="card chat--card right" id={`${window.innerWidth <= 991 ? 'chat_window' : ''}`} data-aos="fade-up" data-aos-duration="1500">
                <div className="card-header chatting-card-header">
                  <div className="chat-header-image-area">
                    <img src={image} alt="Bot Icon" className="chatting-person-image" />
                  </div>
                  <div className="chatting-person-name">
                    Chat Assistant <br />
                    <span>P.P.T<span>Travels & Tours</span></span>
                  </div>
                </div>

                {/* <div className="chatting-card-body-skeloton">
                  <div className="chat-info-loading-skeleton">
                    <Skeleton circle={true} height={10} width={10} />
                    <Skeleton circle={true} height={10} width={10} />
                    <Skeleton circle={true} height={10} width={10} />
                    <Skeleton circle={true} height={10} width={10} />
                    <Skeleton circle={true} height={10} width={10} />
                  </div>
                </div> */}

                <ScrollToBottom className="card-body chatting-card-body">
                  {queryResponse.length > 0 &&
                    queryResponse.map((qr, index) => {
                      return (
                        <>
                          {qr.query && (
                            <div className="chat--message-container send"
                              key={index}>
                              <div className="chat--message-area">
                                <div className="chat-message-content">
                                  <p>{qr?.query}</p>
                                </div>
                              </div>
                              <img src={human_avatar} alt="Human Avatar" className='chat-avatar' />
                            </div>
                          )}

                          {qr.response &&
                            <div className="chat--message-container receive"
                              key={index}>
                              <div className="chat--message-area">
                                <div className="chat-message-content">
                                  <p>{qr?.response}</p>
                                </div>
                              </div>
                              <img src={bot_avatar} alt="Bot Avatar"
                                className='chat-avatar' />
                            </div>
                          }
                        </>


                      );
                    })}
                </ScrollToBottom>

                <div className="card-footer chatting-card-footer">
                  <div className="chat-input-group">
                    <input type="search"
                      value={userMessage}
                      className='form-control message-input'
                      placeholder='Enter the message here...'
                      onChange={handleChange}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          fetchResponseForQuery();
                        }
                      }}
                      ref={chatInputRef}
                      autoFocus
                    />

                    <button className='btn msg-send-btn'
                      onClick={() => fetchResponseForQuery()}>
                      <i class="bi bi-send"></i>
                    </button>

                    <div className="chat-short-cut">
                      <span className="chat-short-cut-key">Ctrl + /</span>
                    </div>

                    {queries.length > 0 && userMessage && (
                      <div className="seach-dropdown-area">
                        {queries.map((query, index) => {
                          return (
                            <div
                              className="seach-dropdown-data"
                              key={index}
                              onClick={() => {
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
                </div>


              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ///////////////////////// */}
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
      {/* ///////////////////// */}


      <footer className="footer-section">

      </footer>
    </>
  );
}

export default App;
