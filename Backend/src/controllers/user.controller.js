const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Playlist = require('../models/playlist.model');
const { bucket } = require('../firebaseConfig');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = await user.generateAuthToken();

        const currentUser = await User.findById(user._id).select("-password");

        return res
        .status(200)
        .cookie('accessToken', token, {
          httpOnly: true,        // Makes the cookie inaccessible to client-side JavaScript
          secure: process.env.NODE_ENV === 'production', // Only set secure in production
          sameSite: 'Lax',       // Prevents CSRF attacks
          maxAge: 5 * 24 * 60 * 60 * 1000 // 5 days in milliseconds
        })
        .json({ currentUser, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password, gender, is_admin=false} = req.body;

        const existedUser = await User.findOne({email})
        if (existedUser) {
            return res.status(401).json({ error: 'User already exists' });
        }
        const newUser = new User({ name, email, password, gender, is_admin});
        const user = await newUser.save();

        const token = await user.generateAuthToken();

        return res
        .status(200)
        .cookie('accessToken', token, {
          httpOnly: true,        // Makes the cookie inaccessible to client-side JavaScript
          secure: process.env.NODE_ENV === 'production', // Only set secure in production
          sameSite: 'Lax',       // Prevents CSRF attacks
          maxAge: 5 * 24 * 60 * 60 * 1000 // 5 days in milliseconds
        })
        .json({ currentUser, token });
        } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const registerAdmin = async (req, res) => {
    try {
        const { name, email, password, gender, is_admin=true} = req.body;

        const existedUser = await User.findOne({email})
        if (existedUser) {
            return res.status(401).json({ error: 'User already exists' });
        }
        const newUser = new User({ name, email, password, gender, is_admin});
        const user = await newUser.save();

        return res
        .status(200)
        .json({ user });
        } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const logoutUser = async (req, res) => {
    return res
    .clearCookie('accessToken')
    .json({ message: 'Logout successfull' });
}

const getCurrentUser = async (req, res) => {
    
    let playlists = await User.findOne({_id:req.user._id}).select('playlists')
    .populate({
        path: 'playlists',
        populate: {
          path: 'songs',
          options: { sort: { name: 1 } }
        }
      });

    return res
    .status(200)
    .json({user:req.user, playlists});
}

const getUserPlaylists = async (req, res) => {
    
    let playlists = await User.findOne({_id:req.user._id}).select('playlists')
    .populate({
        path: 'playlists',
        populate: {
          path: 'songs',
          options: { sort: { name: 1 } }
        }
      });

    return res
    .status(200)
    .json({playlists});
}

const setUserPlaylist = async (req, res) => {
    try {
        let { playlistId } = req.body;
        let { id } = req.params;
        var user = await User.findOneAndUpdate(
            { _id: id },
            { $push: { playlists: playlistId } },
            { new: true } // To return the updated user document
        ).populate('playlists');

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const removeUserPlaylist = async (req, res) => {
    try {
        let { playlistId } = req.body;
        let { id } = req.params;
        await User.findOneAndUpdate(
            { _id: id },
            { $pull: { playlists: playlistId } }
        );

        return res.status(200).json('Removed Sucessfully');
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteUserPlaylist = async (req, res) => {
    try {
        let { playlistId, userId } = req.params;

        let user = await User.findOne({_id: userId});

        user.playlists = user.playlists.filter(item => item != playlistId);
        await user.save();

        let playlist = await Playlist.findOne({_id:playlistId});
        if(playlist.image){
            const file = bucket.file(`images/${playlist.image}`);
            file.delete()
        }
        await Playlist.findOneAndDelete({_id:playlistId});

        return res.status(200).json('Removed Sucessfully');
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const testUser = async(req,res) => {
    return res.
    status(200)
    .json({ message: 'user route successfull' });
}

module.exports = {
    loginUser,
    registerUser,
    registerAdmin,
    logoutUser,
    getCurrentUser,
    setUserPlaylist,
    removeUserPlaylist,
    deleteUserPlaylist,
    getUserPlaylists,
    testUser
}
