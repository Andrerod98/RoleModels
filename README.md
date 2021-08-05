# RoleModels

## How to set up the RoleModels toolkit to work in your network

To set up the RoleModels follow the steps below:

1. Get the network IPv4 address of your computer (e.g 192.168.1.72)
   MacOS: Can be seen in thr network preferences
   Windows: Can be seen by clicking properties of the active WiFi
2. Change the webpack.config.js devServer>host to that ip address
3. Change the tinylicious/config.json ip to that ip address
4. Change the certificates/openssl.cnf commonName and both subjectAltName to that ip address and countryName, stateOrProvinceName and organizationName to match your information
5. Install openssl https://www.openssl.org/
6. Generate the certificates by running on the terminal sh generate-certificate.sh
7. Run `npm install` from the RoleModels folder root
8. Run `npm install` from the RoleModels folder root/tinylicious
9. Run `npm run start` to start both the client and server
10. To run as a desktop app run `npm run electron:start` to start both the client and server
11. Navigate to `https://{your-ip}:8080` in a browser tab
