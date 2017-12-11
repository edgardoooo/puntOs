const functions = require('firebase-functions');
const admin = require('firebase-admin');
const https = require("https");
const google_api = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
const google_api_key = 'AIzaSyBLDLO4nbnylcU90AD-XFn0fZdcLxnHGsY';
var nodemailer = require('nodemailer');
var serviceAccount = require("./puntOs-Capstone2017-4ab872953b34.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://puntos-capstone2017.firebaseio.com/"
});

const sender_email = functions.config().gmail.email;
const sender_pass = functions.config().gmail.password;
const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: sender_email,
    pass: sender_pass
  }
})

exports.SendConfirmAndApproveEmails = functions.database.ref('/users/{uid}').onWrite(event =>{
  const event_data = event.data;
  const value = event_data.val();
  const user_id = event.params.uid;
  //Value not new or deleted
  if(event_data.previous.exists() || !event.data.exists()){
    return null;
  }

  if (value.type === 'Business'){

  return admin.database().ref('/admin/u5EldzH8DmhSdWoTVpyrAISjLGm2').once('value', snapshot => {
    const admin_email = snapshot.val().email;
    const confirm_mail_struct = {
      from: 'puntOs Team <noreply@firebase.com>',
      to: value.email,
      subject: 'Thanks for submiting your information!',
      text: `Thank you ${value.businessName} for submitting your business request to join puntOs!
      Please allow at least 24hrs for your information to be verified and your account activated.`
    };

    const approve_mail_struct = {
      from: 'puntOs Team <noreply@firebase.com>',
      to: admin_email,
      subject: `Approval request from ${value.businessName}!`,
      text: `Please verify that the following information is correct:
      ${value} If this information is correct please access this link to approve account creation:
      https://us-central1-puntos-capstone2017.cloudfunctions.net/approveBusinessAccount?id=${user_id}&size=${value.size}`
    };

    const confirmation_promise = transport.sendMail(confirm_mail_struct)
      .then(() => console.log(`email sent to ${value.email}`))
      .catch((error) => console.error(error));

    const approval_promise = transport.sendMail(approve_mail_struct)
      .then(() => console.log(`email sent to ${admin_email}`))
      .catch((error) => console.error(error));

    return Promise.all([confirmation_promise,approval_promise]);
  });
} else if (value.type === 'user'){
    const confirm_mail_struct = {
      from: 'puntOs Team <noreply@firebase.com>',
      to: value.email,
      subject: 'Welcome to the puntOs Team!',
      text: `Thank you ${value.name} for joining our team!
      Log in and start earning points today!`
    };
    return transport.sendMail(confirm_mail_struct)
      .then(() => console.log(`email sent to ${value.email}`))
      .catch((error) => console.error(error));
  }
});

exports.approveBusinessAccount = functions.https.onRequest((req, res) => {
  return admin.database().ref(`users/${req.query.id}`).once('value', snapshot => {
    var radius_size = '0';
    var address = snapshot.val().addressLine.split(' ').join('+') + ',+' + snapshot.val().city.split(' ').join('+') + ',+' + 'Puerto+Rico&';
    var req_url = google_api + address + 'key=' + google_api_key;
    //console.log('address: ' + address)
    //console.log('url: ' + req_url)
    https.get(req_url, res => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', data => {
      body += data;
      });
      res.on('end', () => {
        let longitude = '';
        let lattitude = '';
        body = JSON.parse(body);
        lattitude += body.results[0].geometry.location.lat;
        longitude += body.results[0].geometry.location.lng;
        //console.log(body.results[0])
        //console.log(lattitude)
        //console.log(longitude)
        if (req.query.size === 'Small')
          radius_size= '40';
        else if( req.query.size === 'Medium')
            radius_size = '60';
        else if( req.query.size === 'Large')
            radius_size = '80';
        else if( req.query.size === 'XLarge')
            radius_size = '100';

        const activate_account = { active: true, longitude: longitude, latitude: lattitude, radius: radius_size };
        snapshot.ref.update(activate_account).catch((error) => console.log(error));
    });});

  }).then(snapshot => res.status(200).end());});
