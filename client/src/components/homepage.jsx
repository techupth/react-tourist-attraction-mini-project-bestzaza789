import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";

function Homepage() {
  const [searchText, setSearchText] = useState("");
  const [allTrip, setAllTrip] = useState([]);

  const handleSearch = async () => {
    const response = await axios.get(
      `http://localhost:4001/trips?keywords=${searchText}`
    );
    setAllTrip(response.data.data);
  };
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedHandleSearch = debounce(handleSearch, 100);

  useEffect(() => {
    debouncedHandleSearch();
  }, [searchText, debouncedHandleSearch]);

  const copyToClipboard = (text) => {
    console.log("text", text);
    var textField = document.createElement("textarea");
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  };

  return (
    <div className="container">
      <h1>เที่ยวไหนดี</h1>
      <div className="searchbox">
        <label htmlFor="search">ค้นหาที่เที่ยว</label>
        <input
          type="text"
          id="search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="หาที่เที่ยวแล้วไปกัน"
        />
      </div>

      <div>
        <ul>
          {allTrip.map((item) => (
            <div className="travel-blog">
              <div className="highlight-picture">
                <img src={item.photos[0]} />
              </div>
              <div className="main-content">
                <a href={item.url} className="main-title">
                  {item.title}
                </a>
                <div className="main-description">
                  {item.description.length > 100
                    ? `${item.description.substring(0, 100)}...`
                    : item.description}
                </div>
                <a href={item.url}>อ่านต่อ</a>
                <div className="category">
                  หมวด:
                  {item.tags.map((tag, index) => (
                    <React.Fragment key={index}>
                      <button
                        className="tag"
                        onClick={() => setSearchText(tag)}
                      >
                        {tag}
                      </button>
                      {index !== item.tags.length - 1 &&
                        (index !== item.tags.length - 2 ? (
                          <span>,</span>
                        ) : (
                          <span> และ </span>
                        ))}
                    </React.Fragment>
                  ))}
                </div>
                <div className="picture">
                  {item.photos.slice(1).map((tag) => (
                    <img src={tag} />
                  ))}
                </div>
                <button
                  onClick={() => copyToClipboard(item.url)}
                  className="copy-link"
                >
                  <img src="https://www.svgrepo.com/show/13979/link.svg" />
                </button>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Homepage;
