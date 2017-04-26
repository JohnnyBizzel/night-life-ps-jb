function authenticationMiddleware () {  
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      console.log('Middleware - request is Authenticated')
      return next()
    }
  
  }
}