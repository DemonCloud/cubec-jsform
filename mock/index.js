const qs = require("querystring");

module.exports = {
  "POST=>/postformdata.do": function(req, res){
        let body = '';

    req.on('data', function (data) {
      body += data;

      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6)
        req.connection.destroy();
    });

    req.on('end', function (data) {
      const post = qs.parse(body);

      console.log(post);

      res.json({
        resultCode: 0,
        message: 'request success',
      });
    });
  }
};
