const express = require('express')
const app = express()
const port = 3000

const nodeBase64 = require('nodejs-base64-converter');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('SECRETKEY');
const path = require('path');
const bodyParser = require('body-parser');
const router = express.Router();
const cors = require('cors');

// Point static path to dist
const app_Path = path.join(process.cwd(), '../client/dist');
app.use(express.static(app_Path, { etag: true, maxAge: 0 }));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(cors());

const message = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
console.log("Message", message);

loopEncodedMessage = loopEncoding(12, message);
console.log('Loop encoded message: ', loopEncodedMessage);

const encryptedMessage = cryptr.encrypt(loopEncodedMessage);
console.log('Encrypted message: ', encryptedMessage);

const decryptedMessage = cryptr.decrypt(encryptedMessage);
console.log('Decrypted message: ', decryptedMessage);

loopDecodedMessage = loopDecoding(12, decryptedMessage);
console.log('Loop Decoded message: ', loopDecodedMessage);

app.use('/', router);

router.get('/', (req, res) => {
    res.send('Hello World!')
});
  
router.get('/encryptMsg', (req, res) => {
  const inputMsg = req.query.message;
  console.log('EncryptedMessage: ', cryptr.encrypt(inputMsg));
  res.json({ encryptedMsg: cryptr.encrypt(inputMsg) });
});

router.get('/encodeMsg', (req, res) => {
  const encryptedMsg = req.query.message;
  loopEncodedMessage = loopEncoding(2, encryptedMsg);
  console.log('loopEncodedMessage: ', loopEncodedMessage);
  res.json({ encodedMsg: loopEncodedMessage });
});

router.get('/decodeMsg', (req, res) => {
  const encodedMsg = req.query.message;
  loopDecodedMessage = loopDecoding(2, encodedMsg);
  console.log('loopDecodedMessage: ', loopDecodedMessage)
  res.json({ decodedMsg: loopDecodedMessage });
});

router.get('/decryptMsg', (req, res) => {
  const decodedMsg = req.query.message;
  console.log('DecryptedMessage: ', cryptr.decrypt(decodedMsg));
  res.json({ decryptedMsg: cryptr.decrypt(decodedMsg) });
});

function loopEncoding(iteration, message) {
    let msg = message;
    for(i=0;i<iteration;i++) {
        msg =  nodeBase64.encode(msg);
    }
    return msg;
}

function loopDecoding(iteration, encodedMessage) {
    let msg = encodedMessage;
    for(i=0;i<iteration;i++) {
        msg =  nodeBase64.decode(msg);
    }
    return msg;
}

app.listen(port, function(){
    console.log("Server has started on port: ", port);
});