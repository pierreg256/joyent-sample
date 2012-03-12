
var everyauth = require('everyauth')
  , util = require('util')
  , UserProvider = require('./models/users').UserProvider;

var userProvider = new UserProvider('localhost', 27017);

// EveryAuth helpers definition
everyauth.everymodule.findUserById( function (userId, callback) {
  userProvider.findById(userId, function (err, value){
    if (err) {
      callback(err);
    } else {
      callback (null, value);
    }
  });
});


//EveryAuth login field selection : we do prefer using email as an id for our applciation
everyauth.password.loginWith('email');

// EveryAuth Password Registration
everyauth.password.getRegisterPath('/register');
everyauth.password.postRegisterPath('/register');
everyauth.password.registerView('register.ejs');
everyauth.password.registerLocals({title : 'Social Demo : Enregistrement'});
everyauth.password.validateRegistration( function (newUserAttrs) {
  var errors = [];
  var promise = this.Promise();
  console.log('new user attr:'+util.inspect(newUserAttrs));
  var fieldName = everyauth.password.loginFormFieldName();
  var fieldValue = newUserAttrs[fieldName];
  userProvider.findByField(fieldName, fieldValue, function(err, user){
    console.log('err: '+util.inspect(err)+' - user:'+util.inspect(user));
    if (err) {
      promise.fulfill([err]);
    } else {
      if (user) {
        promise.fulfill(['Cet Identifiant a déjà été utilisé']);
      } else {
        promise.fulfill([]);
      }
    }
  });

	return promise;
});

everyauth.password.registerUser(function(newUserAttrs) {
	var login = newUserAttrs[this.loginKey()];
	console.log(util.inspect(newUserAttrs));
	
	var promise = this.Promise();
  userProvider.save(newUserAttrs, function (err, user) {
    if (err) {
      console.log(util.inspect(err));
      promise.fulfill([err]);
    } else {
      promise.fulfill(user[0]);
    }
  });
  return promise;
});
everyauth.password.registerSuccessRedirect('/login');

// EveryAuth Password Login
everyauth.password.loginSuccessRedirect('/')
everyauth.password.getLoginPath('/login');
everyauth.password.postLoginPath('/login');
everyauth.password.loginView('login.ejs');
everyauth.password.loginLocals({ title: 'Social Demo : Identification' });
everyauth.password.authenticate( function (login, password) {
	 var errors = [];
	 if (!login) errors.push('Votre email est requis');
	 if (!password) errors.push('Un mot de passe est requis');
	 if (errors.length) return errors;
	 
	 var promise = this.Promise();
   userProvider.findByField(everyauth.password.loginFormFieldName(), login, function(err, user){
     console.log('authenticate: err: '+util.inspect(err)+' - user:'+util.inspect(user));
     if (err) {
       promise.fulfill([err]);
     } else {
       if (user) {
         console.log("mdp:"+user[everyauth.password.passwordFormFieldName()]+" = "+password);
         if (user[everyauth.password.passwordFormFieldName()] != password) {
           console.log('mot de passe erroné');
           promise.fulfill(['Mot De Passe Erroné']);
         } else {
           console.log('utilisateur authentifié');
           user['id']=user['_id'];
           promise.fulfill(user);
         }
       } else {
         promise.fulfill(['Cet identifiant n\'est pas référencé']);
       }
     }
   });

   return promise;
	});	



exports.helpExpress = function (app) {
  everyauth.helpExpress(app);
};

exports.middleware = function() {
  return everyauth.middleware();
}