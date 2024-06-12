import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";
import "./App.css";

/* 컨텍스트 */
import { UserProvider } from "./contexts/UserContext";
import { AllUserProvider } from "./contexts/AllUserContext";
import { PostProvider } from "./contexts/PostContext";
import { NavProvider } from "./contexts/NavContext";
import { ModalProvider } from "./contexts/ModalContext";
import { FollowProvider } from "./contexts/FollowContext";
import { CommentProvider } from "./contexts/CommentContext";
import { ThemeProvider } from "./contexts/ThemeContext";

/* 컴포넌트 */
import LoginForm from "./components/page/LoginForm";
import SignUp from "./components/page/SignUp";
import Feed from "./components/page/Feed";
import FriendFeed from "./components/page/FriendFeed";
import ExploreFeed from "./components/page/ExploreFeed";
import MyFeed from "./components/page/MyFeed";
import Message from "./components/page/Message";
import HomeNav from "./components/common/HomeNav";
import FriendNav from "./components/common/FriendNav";
import SearchNav from "./components/common/SearchNav";
import NotificationNav from "./components/common/NotificationNav";

/* Hook */
import useUser from "./components/hook/useUser";
import useNav from "./components/hook/useNav";

/* Utils */
import DogCursor from "./utils/DogCursor";

const AppContent = () => {
    const { isLoggedIn, setIsLoggedIn } = useUser();
    const { navState } = useNav();

    return (
        <Router>
            <DogCursor />
            <Routes>
                <Route
                    exact
                    path="/login"
                    element={
                        isLoggedIn ? (
                            <Navigate to="/" />
                        ) : (
                            <LoginForm setIsLoggedIn={setIsLoggedIn} />
                        )
                    }
                />
                <Route
                    path="/signup"
                    element={
                        isLoggedIn ? (
                            <Navigate to="/" />
                        ) : (
                            <SignUp setIsLoggedIn={setIsLoggedIn} />
                        )
                    }
                />
                <Route
                    path="/"
                    element={
                        isLoggedIn ? (
                            <div className="app">
                                <div className="div">
                                    {!navState.explore && (
                                        <>
                                            <Feed />
                                            <FriendNav />
                                        </>
                                    )}
                                    <div className="main-container">
                                        <HomeNav />
                                        {navState.search && <SearchNav />}
                                        {navState.notification && (
                                            <NotificationNav />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/explore"
                    element={
                        isLoggedIn ? (
                            <div className="app">
                                <div className="div">
                                    <ExploreFeed />
                                    <div className="main-container">
                                        <HomeNav />
                                        {navState.search && <SearchNav />}
                                        {navState.notification && (
                                            <NotificationNav />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/messages"
                    element={
                        isLoggedIn ? (
                            <div className="app">
                                <div className="div">
                                    <Message />
                                    <div className="main-container">
                                        <HomeNav />
                                        {navState.search && <SearchNav />}
                                        {navState.notification && (
                                            <NotificationNav />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/profile"
                    element={
                        isLoggedIn ? (
                            <div className="app">
                                <div className="div">
                                    <MyFeed />
                                    <div className="main-container">
                                        <HomeNav />
                                        {navState.search && <SearchNav />}
                                        {navState.notification && (
                                            <NotificationNav />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/friendfeed/:userId"
                    element={
                        isLoggedIn ? (
                            <div className="app">
                                <div className="div">
                                    <FriendFeed />
                                    <div className="main-container">
                                        <HomeNav />
                                        {navState.search && <SearchNav />}
                                        {navState.notification && (
                                            <NotificationNav />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
            </Routes>
        </Router>
    );
};

const App = () => (
    <UserProvider>
        <AllUserProvider>
            <NavProvider>
                <PostProvider>
                    <CommentProvider>
                        <FollowProvider>
                            <ModalProvider>
                                <ThemeProvider>
                                    <AppContent />
                                </ThemeProvider>
                            </ModalProvider>
                        </FollowProvider>
                    </CommentProvider>
                </PostProvider>
            </NavProvider>
        </AllUserProvider>
    </UserProvider>
);

export default App;
