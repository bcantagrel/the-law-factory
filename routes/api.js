/*
 * Serve JSON to our AngularJS client
 */

var request = require('request'),
	csv = require('csv'),
	baseUrl = 'http://www.lafabriquedelaloi.fr/api',
	headers = { 'Content-type': 'application/json' };



//Laws list sevice
exports.lawlist = function (req, res) {
  request(
    {
      method : 'GET',
      url : baseUrl + "/dossiers_promulgues.csv",
      headers : {'Content-type': 'Content-type: text/csv'}
    },
    
    function (error, response, body) {
      if (response.statusCode == 200) {
      	
      	parsedLaw=null;
      	
      	csv()
		.from.string(
		  body,
		  {
		  	delimiter: ';',
		  	rowDelimiter: "\n",
		  columns: ["id","title","type","startDate","url","status","decCC","decDate","pubDate","num","themes"]
		  } )
		.to.array( function(data){
		  parsedLaw=data;
		  parsedLaw.splice(0,1);
		  res.send(parsedLaw)
		} );
      	
        
      } else res.send("ciao");
    }
  )
};
