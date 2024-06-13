const mongoose = require('mongoose');
const User = require('./models/user.model');
const Artist = require('./models/artist.model');
const Song = require('./models/song.model');
const Category = require('./models/category.model');
const Playlist = require('./models/playlist.model');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/spotify') // please add your local mongoDb URL!!
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
  {
    name: "Stay",
    image:"stay.jpg",
    artists:null,
    album:'Stay',
    file:"stay.mp3",
    dateAdded:'Dec 24,2021',
    duration:133
},
{
  name: "Unstoppable-Sia",
  image:"unstoppable.jpg",
  artists:null,
  album:'Unstoppable-Sia',
  file:"unstoppable.mp3",
  dateAdded:'Jul 6,2021',
  duration:243
},
{
  name: "Closer",
  image:"closer.jpg",
  artists:null,
  album:'Closer',
  file:"closer.mp3",
  dateAdded:'Dec 24,2021',
  duration:212
},
{
  name: "Old Town Road",
  image:"oldTown.jpg",
  artists:null,
  album:'Old Town Road',
  file:"oldTown.mp3",
  dateAdded:'Sep 14,2020',
  duration:142
},
{
  name: "Bad Habits",
  image:"badHabits.jpg",
  artists:null,
  album:'Bad Habits',
  file:"badHabits.mp3",
  dateAdded:'Jun 05,2022',
  duration:240
},
{
  name: "Attention",
  image:"attention.png",
  artists:null,
  album:'Attention',
  file:"attention.mp3",
  dateAdded:'Jun 09,2018',
  duration:211
},
{
  name: "Blinding Lights",
  image:"blindingLights.jpg",
  artists:null,
  album:'Blinding Lights',
  file:"blindingLights.mp3",
  dateAdded:'Feb 20,2021',
  duration:253
},
{
  name: "Animals",
  image:"animals.jpg",
  artists:null,
  album:'Animals',
  file:"animals.mp3",
  dateAdded:'May 20,2015',
  duration:264
},
{
  name: "Stereo Hearts",
  image:"stereoHearts.jpg",
  artists:null,
  album:'Stereo Hearts',
  file:"stereoHearts.mp3",
  dateAdded:'Jan 12,2012',
  duration:202
},
{
  name: "Heat Waves",
  image:"heatWaves.jpg",
  artists:null,
  album:'Heat Waves',
  file:"heatWaves.mp3",
  dateAdded:'Nov 12,2021',
  duration:213
},
];

const artists = [
  {
    name: "Drake",
    about: "Aubrey Drake Graham is a Canadian rapper and singer. An influential figure in contemporary popular music.",
    caption: "Canadian rapper and singer",
    image: "Drake.jpg"
  },
  {
    name: 'The Weeknd',
    about: "Abel Makkonen Tesfaye, known professionally as the Weeknd, is a Canadian singer and songwriter.",
    caption: "Canadian singer and songwriter",
    image: "TheWeeknd.jpg"
  },
  {
    name: 'Daft Punk',
    about: "Daft Punk were a French electronic music duo formed in 1993 in Paris by Thomas Bangalter and Guy-Manuel de Homem-Christo.",
    caption: "Electronic duo",
    image: "DaftPunk.jpg"
  },
  {
    name: 'Imagine Dragons',
    about: "Imagine Dragons are an American pop rock band formed in 2008, based in Las Vegas, Nevada, and currently consists.",
    caption: "Pop band",
    image: "ImagineDragons.jpg"
  },
  {
    name: 'Ed Sheeran',
    about: "Edward Christopher Sheeran MBE is an English singer-songwriter. Born in Halifax, West Yorkshire, and raised in Framlingham, Suffolk.",
    caption: "English singer-songwriter",
    image: "EdSheeran.jpg"
  },
  {
    name: 'Ariana Grande',
    about: "Ariana Grande-Butera is an American singer, songwriter, and actress. Known for her vocal range and pop hits.",
    caption: "American singer and actress",
    image: "ariana.jpg"
  },
  {
    name: 'Taylor Swift',
    about: "Taylor Alison Swift is an American singer-songwriter. Known for her narrative songwriting and numerous chart-topping hits.",
    caption: "American singer-songwriter",
    image: "taylor.jpg"
  },
  {
    name: 'Beyoncé',
    about: "Beyoncé Giselle Knowles-Carter is an American singer, songwriter, and actress. Known for her powerful voice and stage presence.",
    caption: "American singer and actress",
    image: "beyonce.jpg"
  },
  {
    name: 'Bruno Mars',
    about: "Peter Gene Hernandez, known professionally as Bruno Mars, is an American singer, songwriter, record producer, and dancer.",
    caption: "American singer and performer",
    image: "brunoMars.jpg"
  },
  {
    name: 'Billie Eilish',
    about: "Billie Eilish Pirate Baird O'Connell is an American singer-songwriter. Known for her unique style and voice.",
    caption: "American singer-songwriter",
    image: "billie.jpg"
  },
  {
    name: 'Justin Bieber',
    about: "Justin Drew Bieber is a Canadian singer and songwriter. Discovered on YouTube, he has become a global pop phenomenon.",
    caption: "Canadian singer and songwriter",
    image: "justin.jpg"
  },
  {
    name: 'Adele',
    about: "Adele Laurie Blue Adkins is an English singer-songwriter. Known for her powerful voice and emotional ballads.",
    caption: "English singer-songwriter",
    image: "adele.jpg"
  },
  {
    name: 'Kanye West',
    about: "Kanye Omari West is an American rapper, singer, songwriter, record producer, and fashion designer.",
    caption: "American rapper and producer",
    image: "kanye.jpeg"
  },
  {
    name: 'Rihanna',
    about: "Robyn Rihanna Fenty is a Barbadian singer, actress, and businesswoman. Known for her versatile music and fashion ventures.",
    caption: "Barbadian singer and actress",
    image: "rihanna.jpg"
  },
  {
    name: 'Lady Gaga',
    about: "Stefani Joanne Angelina Germanotta, known professionally as Lady Gaga, is an American singer, songwriter, and actress.",
    caption: "American singer and actress",
    image: "ladyGaga.png"
  },
  {
    name: 'Post Malone',
    about: "Austin Richard Post, known professionally as Post Malone, is an American rapper, singer, songwriter, and record producer.",
    caption: "American rapper and singer",
    image: "postMalon.jpg"
  }
];


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
  },
  {
    title: "Workout Jams",
    image: "playlist12.jpg",
    songs: null,
    description: "Get pumped with these high-energy workout tracks.",
    categories: null
  },
  {
    title: "Country Roads",
    image: "playlist13.jpg",
    songs: null,
    description: "A collection of the best country hits to take you home.",
    categories: null
  },
  {
    title: "Jazz Classics",
    image: "playlist14.jpg",
    songs: null,
    description: "Timeless jazz tunes for any occasion.",
    categories: null
  },
  {
    title: "Hip Hop Essentials",
    image: "playlist15.jpg",
    songs: null,
    description: "The essential tracks that define hip hop.",
    categories: null
  },
  {
    title: "Electronic Grooves",
    image: "playlist16.jpg",
    songs: null,
    description: "Feel the beat with these electronic dance tracks.",
    categories: null
  },
  {
    title: "Indie Mix",
    image: "playlist17.jpg",
    songs: null,
    description: "A mix of the best indie tracks from up-and-coming artists.",
    categories: null
  },
  {
    title: "Classical Calm",
    image: "playlist18.jpg",
    songs: null,
    description: "Relax with calming classical music.",
    categories: null
  },
  {
    title: "R&B Vibes",
    image: "playlist19.jpg",
    songs: null,
    description: "Smooth and soulful R&B tracks.",
    categories: null
  },
  {
    title: "Reggae Rhythms",
    image: "playlist20.jpg",
    songs: null,
    description: "Chill out with these reggae rhythms.",
    categories: null
  },
  {
    title: "Pop Party",
    image: "playlist21.jpg",
    songs: null,
    description: "Get the party started with these pop hits.",
    categories: null
  },
  {
    title: "Acoustic Sessions",
    image: "playlist22.jpg",
    songs: null,
    description: "Unplug and unwind with these acoustic tracks.",
    categories: null
  }
];


// Helper functions
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


async function seedDatabase() {
  try {
    // Insert users
    await User.create(user);
    await User.create(admin);

    // Insert artists
    await Artist.insertMany(artists);
    const dbArtists = await Artist.find();
    // Shuffle artists for random picking
    // shuffleArray(dbArtists);

    // Assign artists to songs
    let artistIndex = 0;
    songs.forEach(song => {
      const numArtists = getRandomNumber(1, 2);
      song.artists = [];
      for (let i = 0; i < numArtists; i++) {
        song.artists.push(dbArtists[artistIndex]._id);
        artistIndex = (artistIndex + 1) % dbArtists.length;
      }
    });

    //Insert Categories
    await Category.insertMany(categories);
    const dbCategories = await Category.find();

    // Insert songs
    await Song.insertMany(songs);
    const savedSongs = await Song.find();
    // Shuffle songs for random picking
    // shuffleArray(savedSongs);

    // Assign songs to playlists
    let songIndex = 0;
    playlists.forEach((playlist, index) => {
      const numSongs = getRandomNumber(3, 4);
      playlist.songs = [];
      for (let i = 0; i < numSongs; i++) {
        playlist.songs.push(savedSongs[songIndex]._id);
        songIndex = (songIndex + 1) % savedSongs.length;
      }
      // for (let i = 0; i < numSongs; i++) {
      //   console.log(songIndex);
      //   // playlist.songs.push(savedSongs[songIndex % savedSongs.length]._id); // Ensure the index stays in bounds
      //   songIndex++;
      // }

      // Assign categories
      playlist.categories = [];
      if (index < 8) {
        playlist.categories.push(dbCategories[0]._id); // Spotify Playlists
      } else if (index < 14) {
        playlist.categories.push(dbCategories[1]._id); // Sleep
      } else {
        playlist.categories.push(dbCategories[2]._id); // Focus
      }
    });

    // Insert playlists
    await Playlist.insertMany(playlists);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Call the function to seed the database
seedDatabase();