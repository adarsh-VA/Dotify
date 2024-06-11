const mongoose = require('mongoose');
const User = require('./models/user.model');
const Artist = require('./models/artist.model');
const Song = require('./models/song.model');
const Category = require('./models/category.model');
const Playlist = require('./models/playlist.model');

// Connect to MongoDB
mongoose.connect() // please add your local mongoDb URL!!
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Define the data you want to seed
const user = {
    name: 'User',
    email: 'user@gmail.com',
    password: 'user',
    gender: 'Male',
    is_admin: false
};

const admin = {
  name: 'Admin',
  email: 'admin@gmail.com',
  password: 'admin',
  gender: 'Male',
  is_admin: true
};

var songs = [
  {
      name: "Starboy",
      image:"Starboy.png",
      artists:null,
      album:'Starboy',
      file:"1.mp3",
      dateAdded:'Aug 7,2023',
      duration:178
  },
  {
      name: "Believer",
      image:"Believer.jpeg",
      artists:null,
      album:'Evolve',
      file:"2.mp3",
      dateAdded:'Aug 7,2023',
      duration:249
  },
  {
      name: "Shape of You",
      image:"ShapeOfYou.png",
      artists:null,
      album:'+(Deluxe)',
      file:"3.mp3",
      dateAdded:'Aug 7,2023',
      duration: 243
  },
  {
      name: "God's Plan",
      image:"GodsPlan.jpg",
      artists:null,
      album:'Scorpion',
      file:"4.mp3",
      dateAdded:'Aug 9,2023',
      duration:202
  },
];

const artists = [
  {
    name:'Drake'
  },
  {
    name:'The Weekend'
  },
  {
    name:'Daft Punk'
  },
  {
    name:'Imagine Dragons'
  },
  {
    name:'Ed Sheeran'
  }
] 

const categories = [
  {
    name:'Spotify Playlists'
  },
  {
    name:'Sleep'
  },
  {
    name:'Focus'
  }
] 

var playlists = [
  {
    title: "Today's Hot Picks",
    image: "playlist1.jpg",
    songs: null,
    description: "Stay ahead with the freshest and hottest tracks of the day!",
    categories: null
  },
  {
    title: "Urban Beats",
    image: "playlist2.jpg",
    songs: null,
    description: "Hit tracks from top artists. Listen to best beats.",
    categories: null
  },
  {
    title: "2010's Hits",
    image: "playlist3.png",
    songs: null,
    description: "The unforgettable songs that defined the decade.",
    categories: null
  },
  {
    title: "Rock Legends",
    image: "playlist4.jpg",
    songs: null,
    description: "Iconic rock tracks that stand the test of time. Featuring Foo Fighters.",
    categories: null
  },
  {
    title: "Chill Vibes",
    image: "playlist5.jpg",
    songs: null,
    description: "Relax with the smoothest new chill hits.",
    categories: null
  },
  {
    title: "Fiesta Beats",
    image: "playlist6.jpg",
    songs: null,
    description: "Ignite your party with the hottest and most vibrant beats!",
    categories: null
  },
  {
    title: "Mega Mix 75",
    image: "playlist7.png",
    songs: null,
    description: "A colossal mix of 75 recent favorites!",
    categories: null
  },
  {
    title: "Fresh Finds",
    image: "playlist8.jpg",
    songs: null,
    description: "Your weekly dose of new and exciting music!",
    categories: null
  },
  {
    title: "Now Trending",
    image: "playlist9.jpg",
    songs: null,
    description: "The tracks everyone is talking about this month.",
    categories: null
  },
  {
    title: "Sleepy Time",
    image: "playlist10.jpg",
    songs: null,
    description: "Soothing ambient piano to ease you into sleep.",
    categories: null
  },
  {
    title: "Dreamy Tunes",
    image: "playlist11.jpg",
    songs: null,
    description: "Float away with mesmerizing instrumentals.",
    categories: null
  }
];

function getRandomIndices(numIndices, maxLength) {
  const indices = [];
  while (indices.length < numIndices) {
      const index = Math.floor(Math.random() * maxLength);
      if (!indices.includes(index)) {
          indices.push(index);
      }
  }
  return indices;
}

// Seed the database
async function seedDatabase() {
  try {
    await User.create(user);
    await User.create(admin);
    await Artist.insertMany(artists);
    await Category.insertMany(categories);

    const dbArtists = await Artist.find();
    const dbCategories = await Category.find();



    songs.forEach(song => {
      const randomIndices = getRandomIndices(Math.ceil(Math.random() * 2), dbArtists.length);
      song.artists = randomIndices.map(index => dbArtists[index]._id);
    });
    await Song.insertMany(songs);

    const dbSongs = await Song.find();

    playlists.forEach(playlist => {
      const randomSongIndices = getRandomIndices(3, dbSongs.length);
      const randomCategoryIndices = getRandomIndices(Math.ceil(Math.random() * 3), dbCategories.length);
      playlist.songs = randomSongIndices.map(index => dbSongs[index]._id);
      playlist.categories = randomCategoryIndices.map(index => dbCategories[index]._id);
    });
    await Playlist.insertMany(playlists);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}

// Call the function to seed the database
seedDatabase();
