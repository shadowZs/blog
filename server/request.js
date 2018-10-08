const request = require('request');

exports.init = function(requestConfig){
    request(requestConfig, function(err, response, body){
        if(err){
            console.error('server err:', err)
        }

        return body;
    })
}