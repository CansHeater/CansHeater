# Chauffage Canette Server

## Running the server

To run the server, you need to have express.js, body-parser and mongoose installed. You can use the following commands to install with npm.
```
npm install
```
You also need a to install mongoDB. For that you can check the documentation on the official website : https://docs.mongodb.com/manual/administration/install-community/

After installation, be sure that mongoDB is running by using this command :
```
service mongodb status
```
If it's not running you can start it with the following command :
```
service mongodb start
```

Finally to start the service you can use this commmand : 
```
node server/index.js
```

## Chauffage Cannette REST API

When the server is running, you can access the API with URLs like
```
http://<server-address>/info/<action>
```

For example
```
http://localhost:8080/info/temperatures
```


## API Endpoints

* (GET)/info
    
    Returns all documents in the mongodb database

    No Parameters needed

    Returns
    ```
    [
    {
      "_id": "<id in the DB>",

      "date": "<date and time of the values>",

      "speed": <fan speed>,
      "tempIn": <temperature inside>,

      "tempOut": <temperature outside>,
      "tempTarget": <tempreture wanted>,

      "__v": <version of document>
    },
    ...
    ]
    ```

* (POST)/info
    
    Add temperatures and calculated speedfan to database 

    No parameters needed 

    Body
    ```
    {

    "tempIn": <temperature inside>,

    "tempOut": <temperature outside>

    }
    ```

    Returns
    ```
    [
    {
      "_id": "<id in the DB>",

       "date": "<date and time of the values>",

       "speed": <fan speed>,
       "tempIn": <temperature inside>,

       "tempOut": <temperature outside>,
       "tempTarget": <tempreture wanted>,
    },
    ...
    ]
    ```
      

* (GET) /info/temperatures
    List temperatures of a specefic day or for the last 24 hours 

    Parameters
    ```
    {
      "date":<date(yyyy-MM-dd)>
    }
    ```
      
    Returns
    ```
    [

    {


      "date": "<date and time of the values>",

      "tempIn": <temperature inside>,

      "tempOut": <temperature outside>,
      "tempTarget": <tempreture wanted>,


    },
    ...
    ]

    ```
      
* (GET) /info/fanspeed 
    The value for the fan speed calculated from the last added temperatures

    No parameters needed

    Returns
    ```
    <fan speed>
    ```
      

* (GET) /info/current 
    values of the current state and last added temperatures

    No parameters needed

    Returns
    ```
    {

      "speed": <fan speed>,
      "tempIn": <temperature inside>,

      "tempOut": <temperature outside>,
      "tempTarget": <tempreture wanted>,
      "state": <true/false the heater is activated or not>

    }
    ```

* (POST)/info/target
    
    Set the wanted temperature by the user

    No parameters needed 

    Body
    ```
    {
      "target": <temperature wanted>
    }
    ```

    Returns
    ```
    <temperature wanted>
    ```
      
* (POST)/info/state
    
    Activate or desactivate the heater by the user

    No parameters needed 

    Body
    ```
    {
      "state": <true/false heater activated or not>
    }
    ```

    Returns
    ```
    <heater activated or not>
    ```

* (POST)/info/city
    
    Set the wanted temperature by the user.
    If city is not found, no changes are made and return the previous city name.

    No parameters needed 

    Body
    ```
    {
      "city": "<city name>"
    }
    ```

    Returns
    ```
    {
      "city": "<city name>"
    }
    ```

* (GET)/info/city
    
    The value of the city where the heater is placed

    No parameters needed 


    Returns
    ```
    {
      "city": "<city name>"
    }
    ```


* (GET)/info/sleepTime
    
    The sleepTime for the chip

    No parameters needed 


    Returns
    ```
    <sleeptime>
    ```
