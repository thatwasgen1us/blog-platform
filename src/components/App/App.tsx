import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom'
import Header from '../Header/Header'
import CreateUser from '../Login/CreateUser'
import PostLists from '../PostLists/PostLists'
import SignIn from '../SignIn/SignIn'
import classes from './App.module.scss'
import Post from '../Post/Post'
import EditProfile from '../EditProfile/EditProfile'
import ArticleForm from '../ArticleForm/ArticleForm'

function App() {
  return (
    <Router>
      <div className={classes.app}>
        <Header />
        <main className={classes.app__main}>
          <Routes>
            <Route path="/" element={<PostLists />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/create-user" element={<CreateUser />} />
            <Route path="/posts" element={<PostLists />} />
            <Route path="/article/:slug" element={<Post />} />
            <Route path="/create-article" element={<ArticleForm />} />
            <Route path="/articles/:slug/edit" element={<ArticleForm />} />
            <Route path="/profile" element={<EditProfile />} />
            <Route path="*" element={<Navigate to="/posts" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
