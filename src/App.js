import React, { useState, useEffect } from "react";

const initialStories = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const getAsyncStories = () =>
  new Promise(resolve =>
    setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
  );

const useSemiPersistentState = (key, initialValue) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialValue);
  useEffect(() => localStorage.setItem(key, value), [key, value]);
  return [value, setValue];
};
const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "React");
  const [stories, setStories] = useState([]);

  useEffect(() => {
    getAsyncStories().then(result => setStories(result.data.stories));
  }, []);
  const handleRemoveStory = item => {
    const newStories = stories.filter(
      story => story.objectID !== item.objectID
    );
    setStories(newStories);
  };

  const handleChange = event => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My hacker stories</h1>
      <Search id={"search"} search={searchTerm} onSearch={handleChange} />
      <hr />
      <List list={searchedStories} onRemoveItem={handleRemoveStory} />
    </div>
  );
};

const Search = ({ id, onSearch, search, type = "text" }) => (
  <>
    <label htmlFor={id}>Search: </label>
    <input
      id={id}
      type={type}
      placeholder="Search"
      onChange={onSearch}
      value={search}
    />
  </>
);
const List = ({ list, onRemoveItem }) =>
  list.map(item => (
    <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
  ));

const Item = ({ item, onRemoveItem }) => (
  <div>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
      <button type={"button"} onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </div>
);

export default App;
