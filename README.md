# node-osrm

This is an Object-Oriented node-osrm api client!

It is a piece of cake to run this client just make sure that you have already modified the config file with your own values:

    _config.core = {
          port: 3000, Default Port Number
          routes: ['match', 'route', 'nearest'], // Osrm Methods. feel free to add new other methods and contribute :)
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, GET',
              'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Accept',
              'Content-Type': 'application/json'
          },
          defaultResponseCode: 200,
          delimiter: ';',
          cache: true, // You may want to turn off caching.
          mapAddress: 'Your .osrm file address' // This is as its value says the location of your .osrm file. As you know you must run OSRM commands to generate this file.
      };
      
If you prefer to keep caching turned on there is a redis client already written for you. Again feel free to add a new caching platform and contribute :)

    _config.redis = {
        port: 6380, // Default redis port
        password: '', // Use a strong password for your redis
        host: '127.0.0.1', // host
        dbindex: 1 // The index of redis databse. Redis databases are identified by an integer index.
    };
    
    
The url scheme is like this:

    http://SERVER/{method}/?{options}

Example:

    http://SERVER/match/?coordinates=35.73613,51.33831;35.73570,51.33982&timestamps=1530632548;1530632558&radiuses=15;20&overview=simplified&geometries=geojson&steps=0
    
    http://SERVER/route/?coordinates=35.73613,51.33831;35.73570,51.33982;35.73578,51.34164&overview=false&geometries=geojson&steps=0
    
In case of any difficulty running this app just let me know. The document is still being updated.
