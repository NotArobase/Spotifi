import { Routes, Route } from "react-router-dom";
import React from 'react';
import PlaylistProvider from "./contexts/PlaylistProvider";
import Index from "./pages/Index";
import About from "./pages/About";
import Playlist from "./pages/Playlist";
import "./assets/css/styles.css";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CreatePlaylist from "./pages/CreatePlaylist";
import Login from "./pages/Login";

function App() {
  const routes = [
    { path: "/index", element: <Index /> },
    { path: "/login", element: <Login /> },
    { path: "/about", element: <About /> },
    { path: "/playlist/:id", element: <Playlist /> },
    { path: "/create_playlist/:id", element: <CreatePlaylist /> },
    { path: "/create_playlist", element: <CreatePlaylist /> },
    { path: "/", element: <Index /> },
  ];

  return (
    <><Header /><div id="container">
      <PlaylistProvider>
        <NavBar />
        <Routes>
          {/* TODO : Configurer les routes et leurs components à afficher */}
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
        <Footer />
      </PlaylistProvider>
    </div></>
  );
}

export default App;
