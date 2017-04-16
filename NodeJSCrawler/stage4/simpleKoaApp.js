var koa = require('koa');
var parse = require('co-body');
var session = require('koa-session');

var form = '<form action="/login" method="POST">\
  <input name="username" type="text" value="username">\
  <input name="password" type="password" placeholder="The password is \'password\'">\
  <button type="submit">Submit</button>\
</form>';

var app = new koa();

app.keys = ['secret1', 'secret2', 'secret3'];
app.use(session(app));

app.use(function* home(next) {
  if (this.request.path !== '/') return yield next;
  if (this.session.authenticated) this.body = 'hello';
  else this.status = 401;
});

app.use(function* login(next) {
  if (this.request.path !== '/login') return yield next;
  if (this.request.method === 'GET') return this.body = form;

  var body = yield parse(this);

  let name = body.username,
  	password = body.password;
  if (name === 'lance' && password === '666666') {
  	this.session.authenticated = true;
  	this.redirect('/');
  }
});

app.use(function* logout(next) {
  if (this.request.path !== '/logout') return yield next;
  this.session.authenticated = false;
  this.redirect('/');
});

app.listen(process.argv[2]);