let str = 'http://res.cloudinary.com/ddwgvjj4a/video/upload/v1748939787/ruyglcoiw0ycapkbcvwd.jpeg';


let public_id = str.substring(str.lastIndexOf('/') + 1, str.lastIndexOf('.jpg') && str.lastIndexOf('.mp4') && str.lastIndexOf('.png') && str.lastIndexOf('.jpeg'));


console.log(public_id);


let item = "item";
let video=3
if (video) {
    item = "Video";
    // errorMessage = `Already liked the video`
} else if (comment) {
    item = "Comment";
    // errorMessage = `Already liked the comment`
} else if (tweet) {
    item = "Tweet";
    // errorMessage = `Already liked the tweet`
}
let errorMessage = `Already liked the ${item}`;
console.log(errorMessage);
console.log(item);