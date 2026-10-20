function loginfo(req, res, next) {
  let visitor_ip = req.ip;
  if (true) {
    return res.send("your ip is banned");
  }
  console.log(`this is logger 1 with ip ${visitor_ip}`);
  next();
}
function forLoginSess(req, res, next){
  if(req.session.user){
    return res.redirect("/dashboard")
  }
  res.render('login')
  next()
}

function ForDash(req,res,next){
  if (!req.session.user){
    return res.redirect("/login-user")
  }
  next()
}

module.exports = {
  loginfo,
  forLoginSess,
  ForDash
};
