const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');
const gcloud = require('google-cloud');
const https = require("https");
const google_api = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
const google_api_key = 'AIzaSyBLDLO4nbnylcU90AD-XFn0fZdcLxnHGsY';
var nodemailer = require('nodemailer');
var serviceAccount = require("./puntOs-Capstone2017-4ab872953b34.json");
var haversine = require('haversine');
var moment = require('moment');
var QRCode = require('qrcode');
var stream = require('stream');
var uuid = require('react-native-uuid');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://puntos-capstone2017.firebaseio.com/",
  storageBucket: "puntos-capstone2017.appspot.com"
});

firebase.initializeApp({
  apiKey: "AIzaSyDxE1Bw8qQ3aOgJRxTiR88wPGTAyYOsn4Y",
  authDomain: "puntos-capstone2017.firebaseapp.com",
  databaseURL: "https://puntos-capstone2017.firebaseio.com",
  projectId: "puntos-capstone2017",
  storageBucket: "puntos-capstone2017.appspot.com",
  messagingSenderId: "388873118722"
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

exports.unlinkAccount = functions.https.onRequest((req, res) => {
  const uid = req.query.uid;
  const linked_id = req.query.linkedId;
  var unlinkAccount_response = { success: false, message: ''};
  admin.database().ref(`/users/${linked_id}`).update({linked: ''}).then(() => {
    admin.database().ref(`/users/${uid}`).update({linked: ''}).then(()=>{
      unlinkAccount_response.success = true;
      unlinkAccount_response.message = 'Your user account was unlinked. You are no longer able to switch to user mode.'
      return res.status(200).send(unlinkAccount_response);
    });
  }).catch(()=>{
    unlinkAccount_response.message = 'Could not unlink user account. Try again.'
    return res.status(200).send(unlinkAccount_response);
  });
});

exports.linkAccount = functions.https.onRequest((req, res) => {
  const businessID = req.query.uid;
  const userEmail = req.query.email;
  const userPassword = req.query.password;
  var linkAccount_response = { success: false, message: ''};
  firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).then(user=>{
    const uid = user.uid;
    if(user.emailVerified){
        admin.database().ref(`/users/${businessID}`).once('value', snapshot => {
          const businessProfile = snapshot.val();
          if(businessProfile.linked){
            linkAccount_response.message = 'A user account is already linked.'
            return res.status(200).send(linkAccount_response);
          } else{
            const businessObj = snapshot.val();
            const user_linked = { email: userEmail, uid: uid };
            const linked_account = { linked : user_linked};
            const business_linked = { email: businessObj.email, uid: businessID };
            const linked_business = { linked: business_linked};
            snapshot.ref.update(linked_account).then(() => {
              admin.database().ref(`/users/${uid}`).update(linked_business).then(()=>{
                linkAccount_response.success = true;
                linkAccount_response.message = 'To switch to your user account go back to settings and select \'Switch to User\'.'
                return res.status(200).send(linkAccount_response);
              });
            }).catch(()=>{
              linkAccount_response.message = 'Unable to link user account. Try again.'
              return res.status(200).send(linkAccount_response);
            });
          }
        }).catch(()=>{
          linkAccount_response.message = 'Unable to get business profile. Try again.'
          return res.status(200).send(linkAccount_response);
        });
    }
    else{
      linkAccount_response.message = 'Email not verified.'
      return res.status(200).send(linkAccount_response);
    }
  }).catch((error)=> {
    console.log(error)
    linkAccount_response.message = 'Invalid email or password.';
    return res.status(200).send(linkAccount_response);
  });
});

exports.switchAccount = functions.https.onRequest((req, res) => {
  const email = req.query.email;
  const password = req.query.password;
  var switchAccount_response = { success: false, message: ''};
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(user => {
      if(user.emailVerified){
        switchAccount_response.success = true;
        return res.status(200).send(switchAccount_response);
    } else {
      switchAccount_response.message = 'Email not verified.';
      return res.status(200).send(switchAccount_response);
    }
    }).catch((error) => {
      //console.log(error)
      if (error.code === 'auth/user-not-found' && email != '') {
        switchAccount_response.message = 'Unable to locate user account.';
        return res.status(200).send(switchAccount_response);
      }else if (error.code === 'auth/wrong-password') {
        switchAccount_response.message = 'Incorrect Password.';
        return res.status(200).send(switchAccount_response);
      }
      else {
        switchAccount_response.message = 'Invalid Email.';
        return res.status(200).send(switchAccount_response);
      }
    });
  });

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
      Please allow 3 business days for your information to be verified and your account activated.`
    };

    const approve_mail_struct = {
      from: 'puntOs Team <noreply@firebase.com>',
      to: admin_email,
      subject: `Approval request from ${value.businessName}!`,
      text: `Please verify that the following information is correct: \n
      Business Name: ${value.businessName} \n
      Business Address: ${value.addressLine} \n
      Business City: ${value.city} \n
      Business Zipcode: ${value.zipCode} \n
      Business Phone Number: ${value.phoneNumber} \n
      If this information is correct please access this link to approve account creation:
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

exports.sendRedeemCode = functions.database.ref('/Redeems/{rid}').onWrite(event => {
  const event_data = event.data;
  const value = event_data.val();
  //console.log(value)
  const user_id = value.uid;

  if(event_data.previous.exists() || !event.data.exists()){
    return null;
  }

  return admin.database().ref(`/users/${user_id}`).once('value', snapshot => {
     var user = snapshot.val();
     //console.log(user)
     const code_mail_struct = {
        from: 'puntos Team <noreply@firebase.com>',
        to: user.email,
        subject: 'Here is your Coupon Code!',
        text: `Thank you ${user.name} for using our app!
        Here is your coupon code: ${value.code}`
     };

     return transport.sendMail(code_mail_struct)
        .then(() => console.log(`email sent to ${user.email}`))
        .catch((error) => console.error(error));
  });

});

exports.deleteUser = functions.https.onRequest((req, res) => {
  return admin.auth().deleteUser(req.query.uid).then(()=>{
    res.status(200).send('user deleted');
  });
});

exports.approveBusinessAccount = functions.https.onRequest((req, res) => {
  return admin.database().ref(`users/${req.query.id}`).once('value', snapshot => {
    var radius_size = '0';
    var address = snapshot.val().addressLine.split(' ').join('+') + ',+' + snapshot.val().city.split(' ').join('+') + ',+' + 'Puerto+Rico&';
    var req_url = google_api + address + 'key=' + google_api_key;
    var activate_account = {};
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
        let latitude = '';
        body = JSON.parse(body);
        latitude += body.results[0].geometry.location.lat;
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
      if(!snapshot.val().longitude || !snapshot.val().latitude){
        activate_account = { active: true, longitude: longitude, latitude: latitude, radius: radius_size };
      } else {
        activate_account = { active: true, radius: radius_size };
      }
        snapshot.ref.update(activate_account).then(()=>{
          var opts = {
          errorCorrectionLevel: 'H',
          type: 'image/jpeg',
          rendererOpts: {
            quality: 0.3
            }
          };
          QRCode.toDataURL(req.query.id, {
            color: {
              dark: '#0084b4',  // Blue dots
              light: '#0000' // Transparent background
            }
          }, function (err, url) {
          if (err){
            console.log(error);
          }
          const imageName = req.query.id+'QRID.png';
          const bucket = admin.storage().bucket('puntos-capstone2017.appspot.com');
          const base64string = url.substring(21);
          var bufferStream = new stream.PassThrough();
          bufferStream.end(new Buffer(base64string, 'base64'));
          var file = bucket.file('/qrids/'+imageName);
          bufferStream.pipe(file.createWriteStream({
            metadata: {
              contentType: 'image/png',
              metadata: {
                custom: 'metadata'
              }
            },
            public: true,
            validation: "md5"
          }))
          .on('error', (err) => {
            console.log(err);
          })
          .on('finish', ()=> {
            file.getSignedUrl({
            action: 'read',
            expires: '03-09-2491'
            }).then(signedUrls => {
                const image_url = signedUrls[0];
                snapshot.ref.update({qrid: image_url}).then(()=>{
                  const code_mail_struct = {
                     from: 'puntos Team <noreply@firebase.com>',
                     to: snapshot.val().email,
                     subject: 'Your account is Activated!',
                     html: `<img src="https://firebasestorage.googleapis.com/v0/b/puntos-capstone2017.appspot.com/o/logo%2FLogoSmall.png?alt=media&token=08d5bd23-ddfe-435c-8a35-b9cce394c13c" align="middle"></img>
                            <br>
                            <p>Congratulations ${snapshot.val().businessName} your business account is active!
                            Below is your QRID, this QR-code will allow users to check in to your business,
                            you can place it in your menu, register or even print it on your receipts.
                            Users will only be able to check-in and get points if they are on your business as we do
                            location verification.
                            Enjoy the app and start engaging with your customers!
                            </p>
                            <br>
                            <img src="${image_url}" align="middle"></img>`
                  };

                  transport.sendMail(code_mail_struct)
                     .then(() => console.log(`email sent to ${snapshot.val().email}`))
                     .catch((error) => console.error(error));
                });
                //console.log('signed URL: ', signedUrls[0]); // this will contain the picture's url
            });
          });
        });
        }).catch((error) => console.log(error));
    });});

  }).then(snapshot => res.status(200).end());
});


  exports.checkIn = functions.https.onRequest((req, res) => {
    var checkin_response = {checkedIn: false, pointsEarned: 0, businessName: '', message: '', distance: 0};
    const businessID = req.query.bid;
    const user_id = req.query.uid;
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    var new_event = { businessName: '', date: new Date().toISOString() , eventType: 'checkIn', username: '' };
    new_event.username = req.query.username;
    var checkinFailed = false;
    var check_ins_today = 0;
    const _today = new Date().toISOString().substring(0,10);
    admin.database().ref(`/Checkins`).orderByChild(`queryparam`).equalTo(businessID+_today).once('value', snapshot => {
      if(snapshot.val()){
      check_ins_today = Object.keys(snapshot.val()).length;
      snapshot.forEach(checkin => {
        checkinObj = checkin.val();
        if(checkinObj.uid === user_id){
          checkin_response.message = 'Unable to checkin, cannot checkin on the same business twice in a day.';
          checkinFailed = true;
          return res.status(200).send(checkin_response);
        }
      });}}).then(()=>{
        if(!checkinFailed){
          if(check_ins_today < 10){
              admin.database().ref(`users/${businessID}`).once('value', business => {
                if(!business){
                    checkin_response.message = 'Could not find business.';
                    checkin_response.checkedIn = false;
                    return res.status(200).send(checkin_response);
                }
                const businessObj = business.val();
                const businessLat = businessObj.latitude;
                const businessLong = businessObj.longitude;
                const businessRad = businessObj.radius;
                const distance_feet = haversine({latitude: businessLat, longitude: businessLong}, {latitude: latitude, longitude: longitude}, {unit: 'meter'})*3.28084;
                new_event.businessName = businessObj.businessName;
                checkin_response.distance = distance_feet;
                //return res.status(200).send(checkin_response);
                if(distance_feet <= businessRad){
                  checkin_response.checkedIn = true;
                  checkin_response.message = 'Successfully checked in.';
                  checkin_response.businessName = businessObj.businessName;
                  checkin_response.pointsEarned = 50;
                  admin.database().ref(`users/${user_id}`).once('value', user => {
                    const today = new Date().toISOString();
                    const userObj = user.val();
                    const age = (moment(new Date(today)).diff(moment(new Date(userObj.birthdate)), 'minutes')/525600).toFixed(0);
                    const checkin_in = {age: age, businessID: businessID, businessName: businessObj.businessName, city: userObj.hometown,
                    date: today, name: userObj.name, uid: user_id, queryparam: businessID+today};
                    admin.database().ref(`/Checkins`).once('value', checkins => {
                      checkins.ref.push(checkin_in).catch(() => {
                        checkin_response.message = 'Unable to checkin at this time.';
                        checkin_response.checkedIn = false;
                        return res.status(200).send(checkin_response);
                      });
                      var current_points = userObj.points;
                      const new_points = current_points+50;
                      user.ref.update({points: new_points}).then(()=>{
                        admin.database().ref(`/userRewards/${user_id}`).once('value', accumulated =>{
                          var current_points = accumulated.val().points;
                          const new_points = current_points + 50;
                          accumulated.ref.update({points: new_points}).then(()=>{
                            admin.database().ref('/Events/').push(new_event);
                            return res.status(200).send(checkin_response);
                          });
                        });
                      }).catch(()=>{
                        checkin_response.message = 'Could not add points.';
                        return res.status(200).send(checkin_response);
                      });
                    }).catch(()=>{
                      checkin_response.message = 'Unable to checkin at this time.';
                      checkin_response.checkedIn = false;
                      return res.status(200).send(checkin_response);
                    });
                  }).catch(()=>{
                    checkin_response.message = 'Unable to access user data.';
                    checkin_response.checkedIn = false;
                    return res.status(200).send(checkin_response);
                  });
                } else{
                  checkin_response.checkedIn = false;
                  checkin_response.message = 'Out of range';
                  checkin_response.businessName = businessObj.businessName;
                  return res.status(200).send(checkin_response);
                }
              }).catch(()=>{
                checkin_response.checkedIn = false;
                checkin_response.message = 'Unable to access business data.';
                return res.status(200).send(checkin_response);
              });
          }
          else {
              checkin_response.message = 'Unable to checkin, cannot checkin more than 10 times a day.';
              return res.status(200).send(checkin_response);
          }
        }
      }).catch(() => {
        checkin_response.checkedIn = false;
        checkin_response.message = 'Unable to access checkin data.';
        return res.status(200).send(checkin_response);
      })
  });

  exports.aggregateReviews = functions.https.onRequest((req, res) => {
        var votes_count = {};
        var update_obj = {};
        var tallied_update = {};
    admin.database().ref(`/Reviews`).orderByChild('tallied').equalTo(false).once('value', snapshot => {
      snapshot.forEach(review => {
        reviewObj = review.val();
        reviewObj['tallied'] = true;
        tallied_update[review.key] = reviewObj;
        businessID = reviewObj.businessID;
        rating = reviewObj.rating;
        if(votes_count.hasOwnProperty(businessID)){
          votes_count[businessID].accumulated += rating;
          votes_count[businessID].possible += 5;
        } else {
          votes_count[businessID] = { accumulated: 0, possible: 0 };
          votes_count[businessID].accumulated += rating;
          votes_count[businessID].possible += 5;
        }
      });
      }).then(() => {
        admin.database().ref('/users').orderByChild('type').equalTo('Business').once('value', users =>{
          users.forEach(child_node => {
              var businessObj = child_node.val();
              var id = child_node.key;
              if(!businessObj.accumulated){
                if(votes_count.hasOwnProperty(id)){
                  var score = ((votes_count[id].accumulated/votes_count[id].possible)*5).toFixed(2);
                  //console.log(score)
                  businessObj['rating'] = score;
                  businessObj['accumulated'] = votes_count[id].accumulated;
                  businessObj['possible'] = votes_count[id].possible;
                  update_obj[id] = businessObj;
                }
              } else {
                if(votes_count.hasOwnProperty(id)){
                  var accumulated_current = businessObj['accumulated'];
                  var possible_current = businessObj['possible'];
                  var new_accumulated = votes_count[id].accumulated+accumulated_current;
                  var new_possible = possible_current+votes_count[id].possible;
                  var score = ((new_accumulated/new_possible)*5).toFixed(2);
                  businessObj['rating'] = score;
                  businessObj['accumulated'] = new_accumulated;
                  businessObj['possible'] = new_possible;
                  update_obj[id] = businessObj;
                }
              }
          });
          console.log(update_obj)
          console.log(tallied_update)
        }).then(() => {
          admin.database().ref('/users').update(update_obj);
          admin.database().ref('/Reviews').update(tallied_update);
        });
        res.status(200).send('Reviews Aggregated');
      });

    });

exports.getPoints = functions.https.onRequest((req,res) => {
  const uid = req.query.uid;
  const code = req.query.code;
  const email = req.query.email;
  const response = {gotPoints: false, message: '', points: 0};
  var hasUsed = false;
  var invite_obj = {};
  admin.database().ref(`/invites/`).orderByChild('invitedEmail').equalTo(email).once('value',invites => {
    const invites_obj = invites.val();
    console.log(invites_obj)
    if(invites_obj){
    invites.forEach(invite => {
      if(invite.val().used){
        hasUsed = true;
      } else if(invite.val().code === code){
        //console.log('Entre aqui codigo machea')
        invite_obj = invite.val();
        invite_obj['key'] = invite.key;
      }
    });

    if(hasUsed){
      response.message = 'You have used an invitation promo code before. Cannot redeem multiple invitation codes. Sorry.';
      return res.status(200).send(response);
    } else {
      if(invite_obj.key){
        const inviter = invite_obj.inviterId;
        const invite_id = invite_obj.key;
        const inviter_name = invite_obj.inviterName;
        admin.database().ref(`users/${uid}`).once('value', user => {
          const current = user.val().points;
          const new_points = current + 200;
          user.ref.update({points: new_points});
        });
        admin.database().ref(`userRewards/${uid}`).once('value', user => {
          const current = user.val().points;
          const new_points = current + 200;
          user.ref.update({points: new_points});
        });
        admin.database().ref(`users/${inviter}`).once('value', user => {
          const current = user.val().points;
          const new_points = current + 200;
          user.ref.update({points: new_points});
        });
        admin.database().ref(`userRewards/${inviter}`).once('value', user => {
          const current = user.val().points;
          const new_points = current + 200;
          user.ref.update({points: new_points});
        });
        admin.database().ref(`/invites/${invite_id}`).update({used: true}).then(()=>{
          response.message = 'Your invite promo code from '+ inviter_name + 'was processed! Invite more people and get 200 points!' ;
          response.gotPoints = true;
          response.points = '200';
          return res.status(200).send(response);
        }).catch((error)=>{
          console.log(error)
          response.message = 'An error ocurred! Please try again later.';
          return res.status(200).send(response);
        })

      } else {
        response.message = 'Your code does not match any of the invites we got on system. Please re-check your code and try again.';
        return res.status(200).send(response);
      }
    }
  } else {
    response.message = 'Your email has no promo codes registered.';
    return res.status(200).send(response);
  }
  }).catch((error)=>{
    console.log(error)
    response.message = 'An error ocurred! Please try again later.';
    return res.status(200).send(response);
  });
});

    exports.sendInviteEmail = functions.https.onRequest((req,res) => {
      const uid = req.query.uid;
      const username = req.query.username;
      const email = req.query.email;
      const code = uuid.v1().substring(0,8);
      const response = {inviteSent: false, message: ''};
      admin.auth().getUserByEmail(email).then(user => {
        //console.log(user)
        if(user.email){
          response.message = 'This email is already registered in our systems.';
          return res.status(200).send(response);
        }
      }).catch((error)=>{
          if(error.errorInfo.code === 'auth/user-not-found'){
            const invite_mail_struct = {
               from: username + '-puntos User <noreply@firebase.com>',
               to: email,
               subject: 'Download the puntOs App!',
               html: `<img src="https://firebasestorage.googleapis.com/v0/b/puntos-capstone2017.appspot.com/o/logo%2FLogoSmall.png?alt=media&token=08d5bd23-ddfe-435c-8a35-b9cce394c13c" align="middle"></img>
                      <br>
                      <p>You've been invited to the puntOs app by ${username}! You and your inviter will Get a bonus 200 points if you register!
                      </p>
                      <p>Follow the steps below to get your points now!
                      <ol>
                        <li>Download the puntOs app.</li>
                        <li>Register as a user.(Business accounts do not get points on the app)</li>
                        <li>Verify your email.</li>
                        <li>Log into the application and go to the burger menu and click \'Get Points\'.</li>
                        <li>Submit the code: ${code}</li>
                        <li>You should receive your points instantly!</li>
                      </ol>
                      `
            };
            const _today = new Date().toISOString();
            const invite_obj = {inviterId: uid, inviterName: username, invitedEmail: email, code: code, used: false, inviteDate: _today};
            admin.database().ref(`/invites/`).orderByChild('inviterId').equalTo(uid).once('value', invites=>{
              invites.forEach(invite => {
                if(invite.val().invitedEmail === email){
                  response.message = 'You already invited this email.';
                  return res.status(200).send(response);
                }
              });
              admin.database().ref('/invites/').push(invite_obj).then(()=>{
                transport.sendMail(invite_mail_struct)
                   .then(() => {
                     console.log(`email sent to ${snapshot.val().email}`)
                   }).catch((error) => console.error(error));
                   response.message = 'Make sure your friend registers! You will get 200 points!';
                   response.inviteSent = true;
                   return res.status(200).send(response);
              });
            }).catch(()=>{
              response.message = 'An error ocurred while trying to send the invite.';
              return res.status(200).send(response);
            });
          } else {
          //console.log(error)
          response.message = 'An error ocurred while trying to send the invite.';
          return res.status(200).send(response);
        }
      });
    });
