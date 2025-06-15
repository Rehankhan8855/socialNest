const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        
        
    },
    password:{
        type: String,
        required: true,        
    },
    
    profilePicture:{
        type: String,
        default: "https://th.bing.com/th/id/R.77e11af5e399311d422584fb18f663d6?rik=9bTt7VOlvL%2feLA&riu=http%3a%2f%2fgetwallpapers.com%2fwallpaper%2ffull%2f7%2fa%2f3%2f1522573-full-size-amazing-spiderman-phone-wallpaper-1080x1920-pictures.jpg&ehk=Q6CbobtAuWzgA%2bUJdWzUuenmMyyzd%2fpERUhMgMOEI9Y%3d&risl=&pid=ImgRaw&r=0"
    },


    
});
const User = mongoose.model('User',userSchema);
module.exports = User;


