var http = require('http');
var server = http.createServer(requestHandler); 
server.listen(process.env.PORT, process.env.IP, startHandler);

function startHandler()
{
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
}

function requestHandler(req, res) 
{
  try
  {
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    if (query['cmd'] == undefined)
      throw Error("A command must be specified");
      
    var answer = {};
    if(query['cmd'] == 'calcCharge')
    {
      if(isNaN(query['checkBal']) || isNaN(query['savingsBal']) || isNaN(query['checks']))
      {
        throw Error('Variable must be a number');
      }
      else
      {
        if(query['checkBal'] <= 0 || query['savingsBal'] <= 0 || query['checks'] <= 0)
        {
          throw Error('Variable must be positive');
        }
        else
        {
          answer = serviceCharge(query);
        }
      }
    }
    res.write('charge:' + answer);
    res.end('');
  }
  catch (e)
  {
   var error = {'error' : e.message};
    res.write(JSON.stringify(error));
    res.end('');
  }
}

function serviceCharge(query)
{
  console.log("Handling a request");
  console.log(query);
   if(query['checkBal'] < 1000 && query['savingsBal'] < 1500)
      {
        var charge = 0.15 * query['checks'];
        return charge;
        
      }
      if(query['checkBal'] >= 1000 || query['savingsBal'] >= 1500)
      {
        charge = 0;
        return charge;
      }
}
