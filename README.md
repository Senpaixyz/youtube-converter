# Y2B Converter
#### _Youtube to Mp3/Mp4 Converter_

Y2B Converter is a type of tools that can download Youtube video and save it to your own device. This tool was made from the Nodejs Javascript runtime library. This tools can be download variety of video and audio quality and also it doesn't need any account registration to download that because it is all free to use.

Visit this: [https://y2bconverter.herokuapp.com/](https://y2bconverter.herokuapp.com/)

## Features

- (360p/720p/1080p) Download Option
- Supported Mp3, Mp4, AVI format
- Easy and less hustle
- Fast and Efficient

#### Landing Page
![images_alt](https://github.com/Senpaixyz/youtube-converter/blob/master/images/index.JPG?raw=true)
#### Downloaded 
![images_alt](https://github.com/Senpaixyz/youtube-converter/blob/master/images/downloaded-new.JPG?raw=true)


## Tech

Y2B Converter uses a number of open source libraries to work properly:

- [node.js] - evented I/O for the backend
- [node-ytdl-core] - To fetch the videos from the server to the nodejs web app
- [nodemailer.com] - This is a free mailer sending tools for nodejs
- [bootstrap4] - A CSS framework that enchance the user interface of the application.
- [swal] - A javascript library that use for alert notification
- [Express] - fast node.js network app framework
- [jQuery] - A Javascript library that use to fetch data from the server

## Local Machine Installation

To install all packages inside package.json

```sh
npm install
```
Create a .env file and add EMAIL and PASSWORD from Gmail

SMTP USERNAME

```sh
EMAIL=`Your email address`
```
SMTP PASSWORD
```sh
PASSWORD=`Your smtp password`
```
Then save the .env file

### To run the server

```sh
node server.js or npm start
```


> Note: `.env ` is required for sending feedback to your site..

Verify the deployment by navigating to your server address in
your preferred browser.

```sh
localhost:2525/
```

## License

MIT

**Developer: JHENO S CERBITO**
