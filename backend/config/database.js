ssl: {
  ca: fs.readFileSync('ca-certificate.pem'),
  rejectUnauthorized: true
},
connectionTimeout: 15000
