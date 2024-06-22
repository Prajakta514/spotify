import './App.css';
import { useState, useEffect } from "react";


const GenreButton = ({ genre, onClick }) => (
  <button className="genre-button" onClick={() => onClick(genre)}>
    {genre}
  </button>
);

const PlayerControls = ({ isPlaying, onPlayPause, onNext, onPrev }) => (
  <div className="player-controls">
    <button onClick={onPrev}>⏮️</button>
    <button onClick={onPlayPause}>{isPlaying ? '⏸️' : '▶️'}</button>
    <button onClick={onNext}>⏭️</button>
  </div>
);

function App() {
  const [key, setKey] = useState("");
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [genres, setGenres] = useState(["Old Songs", "Motivational", "Bollywood", "Spiritual", "Classical"]);
  const [load, setLoad] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const getTracks = async (query) => {
    setLoad(true);
    let data = await fetch(`https://v1.nocodeapi.com/prajakta/spotify/CxOTDOxALPcwoIew/search?q=${query}&type=track`);
    let convert = await data.json();
    console.log(convert.tracks.items);
    setTracks(convert.tracks.items);
    setLoad(false);
  };

  const getPlaylists = async (query) => {
    let data = await fetch(`https://v1.nocodeapi.com/prajakta/spotify/CxOTDOxALPcwoIew/search?q=${query}&type=playlist`);
    let convert = await data.json();
    console.log(convert.playlists.items);
    setPlaylists(convert.playlists.items);
  };

  const getAlbums = async (query) => {
    let data = await fetch(`https://v1.nocodeapi.com/prajakta/spotify/CxOTDOxALPcwoIew/search?q=${query}&type=album`);
    let convert = await data.json();
    console.log(convert.albums.items);
    setAlbums(convert.albums.items);
  };

  const handleSearch = () => {
    const query = key === "" ? "motivational" : key;
    getTracks(query);
    getPlaylists(query);
    getAlbums(query);
  };

  const handleGenreClick = (genre) => {
    getTracks(genre);
    getPlaylists(genre);
    getAlbums(genre);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((currentTrackIndex + 1) % tracks.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((currentTrackIndex - 1 + tracks.length) % tracks.length);
  };

  useEffect(() => {
    // Fetch initial data
    getTracks("motivational");
    getPlaylists("motivational");
    getAlbums("motivational");
  }, []);

  return (
    <>
      <nav className="navbar navbar-dark navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Spotify 2.0
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <input
              value={key}
              onChange={(event) => setKey(event.target.value)}
              className="form-control me-2 w-75"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button onClick={handleSearch} className="btn btn-primary">
              Search
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className={`row ${load ? "" : "d-none"}`}>
          <div className="col-12 py-5 text-center">
            <div
              className="spinner-border"
              style={{ width: "3rem", height: "3rem" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>

        <div className={`row ${key === "" ? "" : "d-none"}`}>
          <div className="col-12 py-5 text-center">
            <h1>Spotify 2.0</h1>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {genres.map((genre) => (
              <GenreButton key={genre} genre={genre} onClick={handleGenreClick} />
            ))}
          </div>
        </div>

        <div className="row">
          {tracks.map((element, index) => {
            return (
              <div key={element.id} className="col-lg-3 col-md-6 py-2">
                <div className="card" style={{ width: "18rem" }}>
                  <img src={element.album.images[0].url} className="card-img-top" alt={element.name} />
                  <div className="card-body">
                    <h5 className="card-title">{element.name}</h5>
                    <p className="card-text">
                      Artist: {element.album.artists[0].name}
                    </p>
                    <p className="card-text">
                      Release date: {element.album.release_date}
                    </p>
                    <audio src={element.preview_url} controls className="w-100"></audio>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <h2>Playlists</h2>
        <div className="row">
          {playlists.map((element) => {
            return (
              <div key={element.id} className="col-lg-3 col-md-6 py-2">
                <div className="card" style={{ width: "18rem" }}>
                  <img src={element.images[0]?.url} className="card-img-top" alt={element.name} />
                  <div className="card-body">
                    <h5 className="card-title">{element.name}</h5>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <h2>Albums</h2>
        <div className="row">
          {albums.map((element) => {
            return (
              <div key={element.id} className="col-lg-3 col-md-6 py-2">
                <div className="card" style={{ width: "18rem" }}>
                  <img src={element.images[0]?.url} className="card-img-top" alt={element.name} />
                  <div className="card-body">
                    <h5 className="card-title">{element.name}</h5>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </div>
    </>
  );
}

export default App;





// import logo from './logo.svg';
// import './App.css';
// import { useState, useEffect } from "react";

// function App() {
//   const [key, setKey] = useState("");
//   const [tracks, setTracks] = useState([]);
//   const [load, setLoad] = useState(false);

//   const getTracks = async (query) => {
//     setLoad(true);
//     let data = await fetch(`https://v1.nocodeapi.com/prajakta/spotify/CxOTDOxALPcwoIew/search?q=${query}&type=track`);
//     let convert = await data.json();
//     console.log(convert.tracks.items);
//     setTracks(convert.tracks.items);
//     setLoad(false);
//   };

//   const handleSearch = () => {
//     const query = key === "" ? "motivational" : key;
//     getTracks(query);
//   };

//   useEffect(() => {
//     // Fetch trending songs when the component mounts
//     getTracks("motivational");
//   }, []);

//   return (
//     <>
//       <nav className="navbar navbar-dark navbar-expand-lg">
//         <div className="container-fluid">
//           <a className="navbar-brand" href="#">
//             Spotify
//           </a>
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarSupportedContent"
//             aria-controls="navbarSupportedContent"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon" />
//           </button>
//           <div className="collapse navbar-collapse" id="navbarSupportedContent">
//             <input
//               value={key}
//               onChange={(event) => setKey(event.target.value)}
//               className="form-control me-2 w-75"
//               type="search"
//               placeholder="Search"
//               aria-label="Search"
//             />
//             <button onClick={handleSearch} className="btn btn-primary">
//               Search
//             </button>
//           </div>
//         </div>
//       </nav>

//       <div className="container">
//         <div className={`row ${load ? "" : "d-none"}`}>
//           <div className="col-12 py-5 text-center">
//             <div
//               className="spinner-border"
//               style={{ width: "3rem", height: "3rem" }}
//               role="status"
//             >
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         </div>

//         <div className={`row ${key === "" ? "" : "d-none"}`}>
//           <div className="col-12 py-5 text-center">
//             <h1>Spotify</h1>
//           </div>
//         </div>

//         <div className="row">
//           {tracks.map((element) => {
//             return (
//               <div key={element.id} className="col-lg-3 col-md-6 py-2">
//                 <div className="card" style={{ width: "18rem" }}>
//                   <img src={element.album.images[0].url} className="card-img-top" alt={element.name} />
//                   <div className="card-body">
//                     <h5 className="card-title">{element.name}</h5>
//                     <p className="card-text">
//                       Artist: {element.album.artists[0].name}
//                     </p>
//                     <p className="card-text">
//                       Release date: {element.album.release_date}
//                     </p>
//                     <audio src={element.preview_url} controls className="w-100"></audio>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;
