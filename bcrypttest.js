
var bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 'not_bacon';
const someOtherPlaintextPassword = 's0/\/\P4$$w0rD';

var salt = bcrypt.genSaltSync(saltRounds);
var hash = bcrypt.hashSync(myPlaintextPassword, salt);

console.log(hash);
