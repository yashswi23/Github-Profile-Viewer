import React, { useState } from 'react';
import './Home.css';

const HomePage = () => {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState('');

  const API_URL = "https://api.github.com/users/";

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!username) {
      alert("Please enter a GitHub username.");
      return;
    }

    try {
      const userResponse = await fetch(API_URL + username);
      if (!userResponse.ok) {
        throw new Error("User not found");
      }
      const userData = await userResponse.json();
      setUserData(userData);

      const reposResponse = await fetch(API_URL + username + "/repos");
      if (!reposResponse.ok) {
        throw new Error("Repositories not found");
      }
      const reposData = await reposResponse.json();
      setRepos(reposData.slice(0, 5)); // Limit to 5 repos
      setError('');
    } catch (error) {
      setError(error.message);
      setUserData(null);
      setRepos([]);
    }
  };

  return (
    <div>
      <form id="form" onSubmit={handleSearch}>
        <input
          type="text"
          id="search"
          autoFocus
          placeholder="Search a Github Profile User"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </form>
      <main id="Main">
        {error && <p className="error">{error}</p>}
        {userData && (
          <div className="card">
            <div>
              <img className="avtar" src={userData.avatar_url} alt="profile" />
            </div>
            <div className="user-info">
              <h2>{userData.name || "No Name"}</h2>
              <p>{userData.bio || "No bio available"}</p>
              <ul className="info">
                <li>{userData.followers} <strong>Followers</strong></li>
                <li>{userData.following} <strong>Following</strong></li>
                <li>{userData.public_repos} <strong>Repos</strong></li>
              </ul>
              <div id="repos">
                {repos.map((repo) => (
                  <a
                    key={repo.id}
                    className="repo"
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {repo.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;