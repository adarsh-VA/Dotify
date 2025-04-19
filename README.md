<div align="center">
  <h1>Dotify</h1>
</div>

A music app inspired by Spotify, featuring music search and playback, user authorization and authentication, and a interactive, user-friendly interface.

**Deployed on Vercel:** https://dotify-va.vercel.app/  
**Check out my full-stack projects at** [adarshvodnala.vercel.app](https://adarshvodnala.vercel.app)


## Features

- Secure authorization and authentication.
- Search functionality for playlists, songs, and artists.
- Custom playlist creation with song addition.
- Editable playlist details, including title, description, and image.
- Dedicated web pages for playlists, songs, and artists.

## Tech Stack

**Client:** React, Redux Toolkit, React Router, TailwindCSS.

**Server:** Node, Express, MongoDB, Multer, JsonWebTokens.


## Installation & Setup

Install both backend and frontend with npm

```bash
  cd 'folder name'
  npm install
```

After installation, a file named `seeds.js` will populate default data such as songs, playlists, and artists. Run this file with node in the backend directory. Before the run makesure that you have MongoDB installed.

```bash
  node src/seeds.js
```

Now time to run both backend and frontend on different terminals.

Backend run command.
```bash
  cd Backend
  npm run dev
```
Frontend run command.
```bash
  cd Frontend
  npm start
```
