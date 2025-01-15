import { Routes, Route } from "react-router-dom";
import React from 'react';
import PlaylistProvider from "./contexts/PlaylistProvider";
import Index from "./pages/Index";
import About from "./pages/About";
import Faq from "./pages/Faq";
import Playlist from "./pages/Playlist";
import "./assets/css/styles.css";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CreatePlaylist from "./pages/CreatePlaylist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import VotingPage from "./components/VotingPage";

function App() {
  const routes = [
    { path: "/", element: <Index />, protected: true },
    { path: "/index", element: <Index />, protected: true },
    { path: "/login", element: <Login />, protected: false },
    { path: "/register", element: <Register />, protected: false },
    { path: "/about", element: <About />, protected: true },
    { path: "/playlist/:id", element: <Playlist />, protected: true },
    { path: "/create_playlist/:id", element: <CreatePlaylist />, protected: true },
    { path: "/create_playlist", element: <CreatePlaylist />, protected: true },
    { path: "/faq", element: <Faq />, protected: true },
    { path: "/voting", element: <VotingPage />, protected: true },
  ];

  return (
    <>
    <AuthProvider>
      <Header />
      <div id="container">
          <PlaylistProvider>
            <NavBar />
            <Routes>
              {routes.map((route, index) => {
                return route.protected ? (
                  <Route
                    key={index}
                    path={route.path}
                    element={<ProtectedRoute>{route.element}</ProtectedRoute>}
                  />
                ) : (
                  <Route key={index} path={route.path} element={route.element} />
                );
              })}
            </Routes>
            <Footer />
          </PlaylistProvider>
      </div>
    </AuthProvider>
    </>
  );
}

export default App;