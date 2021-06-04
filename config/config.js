
const  MONGODB_URL=process.env.MONGODB_URL||'mmongodb+srv://test123:test123@cluster0.tfyuf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const  JWT_SECRET=process.env.JWT_SECRET ||'somethingsecret';
const  myemail='';
const mypassword='';
// const  MONGODB_URL='mongodb://localhost/avipl';
module.exports ={MONGODB_URL,JWT_SECRET,myemail,mypassword};
