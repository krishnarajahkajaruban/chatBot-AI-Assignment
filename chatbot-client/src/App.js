import "./App.css";
import image from "./img/logo.jpg";
import { useState, useEffect } from "react";
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ScrollToBottom from 'react-scroll-to-bottom';


function App() {
  const [scrolled, setScrolled] = useState(false);

  const [queryResponse, setQueryResponse] = useState([
    { query: "", response: "Welcome to the Sri Lankan Travel Agency. How can I help you today?" }
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
      duration: 1000,
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
            <div className="hero-text-area">
              <h2 className="hero-title">Welcome to  <br /><span>P.P.T <span>Travels & Tours</span></span></h2>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding" id="about">
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
              <img src="../bus.png" className="about-img" data-aos="fade" alt="" />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding achievment-section bg-gray" data-aos="fade-right">
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

      <footer className="footer-section">

      </footer>
    </>
  );
}

export default App;
