# color-themes

Sources of the [color-themes.com](http://color-themes.com) - next generation of the site about color themes for IDEs

```
Deprecation warning

Project is closed. You can find all the themes compiled 
in db_dump/all-color-themes.jar

Database collection `themes` is dumped with mongodump 
to db_dump/themes.json
```

## How to start

First you need to install dependencies and compile sources:

```
npm install
```

Next, you need to setup environment variables. Some functionality may not work if not all variables were defined.

|Variable|Required|Example|Description|
|--------|--------|-------|-----------|
|SECRET|Yes|****|Random string for hashing.|
|MONGO_URL|Yes|mongodb://...|Database URL. Database for tests: mongodb://api:hg03Ho3r_d@ds037647.mongolab.com:37647/idecolorthemes Warning: it cat be wiped at any time.|
|EMAIL|No|john@doe.com|This email used to send mails for user. Error reports are sent to this email too.|
|SMTP_SERVICE|No|Gmail|Service to send email. You should either specify this variable, or all other SMTP_ variables. Look for nodemailer docs for more information.|
|SMTP_HOST|No|smtp.gmail.com|SMTP host|
|SMTP_PORT|No|465|SMTP port.|
|SMTP_SECURE|No|true|Should SMTP use secure connection: true/false.|
|SMTP_USER|No|user|SMTP auth user.|
|SMTP_PASSWORD|No|*****|SMPT auth password.|
|DEBUG|No|TRUE|Start in debug mode. Will not send emails with errors.|
|BRAND|No|Color Themes|Logo text - useful to show different versions.|
|PAYPAL_EMAIL|No|john@doe.com|Required to check transaction.|
|PAYPAL_PRICE|No|2.00USD|Required to check transaction.|
|PRICE|No|$2|Price that will be shown to user|
|IPN_URL|No|http://.../ipn|Url that will receive ipn request from PayPal|
|PAYPAL_ID|No|AX7...|PayPal button id|
|PORT|No|80|Port to listen to.|

Start server with command

```
npm start
```

## Testing

Download and put to tests/bin:

* selenium-server-standalone-x.x.x.jar
* required selenium drivers for your os

Fix tests/nightwatch.json - check versions for selenium server and drivers. 
Read [nightwatch guide](http://nightwatchjs.org/guide) for details.

Start tests with command

```
npm test
```

## Contributing

You are very welcome to improve this project. Looking forward for your pull requests.

## License

Shared under the MIT License
