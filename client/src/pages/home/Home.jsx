import React, { useEffect } from "react";
import { useState } from "react";
import Featured from "../../components/featured/Featured";
import List from "../../components/list/List";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import axios from "axios";

function Home({ type }) {
  const [lists, setLists] = useState([]);
  const [genre, setGenre] = useState();

  useEffect(() => {
    //fetch random list from list route
    const getRandomLists = async () => {
      try {
        const res = await axios.get(
          `list${type ? "?type=" + type : ""}${genre ? "&genre=" + genre : ""}`,
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZmQ3ZWMzMGYxMTBkZTQxNWVhYTUwYSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY2MDk0NDk4MCwiZXhwIjoxNjYzNTM2OTgwfQ.uG_gZsUi8ghmE7eOnAf8g8yKOoiZKTOXXOCGdfizNT8",
            },
          }
        );

        setLists(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getRandomLists();
  }, [type, genre]);
  return (
    <div className="home">
      <Navbar />
      <Featured type={type} />
      {lists.map((list) => (
        <List list={list} key={list._id} />
      ))}
    </div>
  );
}

export default Home;
