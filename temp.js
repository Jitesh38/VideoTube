let str = 'http://res.cloudinary.com/ddwgvjj4a/video/upload/v1748939787/ruyglcoiw0ycapkbcvwd.jpeg';


let public_id = str.substring(str.lastIndexOf('/')+1,str.lastIndexOf('.jpg') && str.lastIndexOf('.mp4') && str.lastIndexOf('.png') && str.lastIndexOf('.jpeg'));


console.log(public_id);