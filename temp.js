let str = 'http://res.cloudinary.com/ddwgvjj4a/image/upload/v1748934748/sauvl8p6rfs61wigvlmj.jpg';


let public_id = str.substring(str.lastIndexOf('/')+1,str.lastIndexOf('.jpg'));


console.log(public_id);