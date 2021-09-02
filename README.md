# RoleModels

## How to set up the RoleModels toolkit to work in your network

To set up the RoleModels follow the steps below:

1. Get the network IPv4 address of your computer `(e.g 192.168.1.72)`

   MacOS: Can be seen in the network preferences

   Windows: Can be seen by clicking properties of the active WiFi

2. Change the `webpack.config.js` `devServer>host` to that ip address

3. Change the `tinylicious/config.json` IP to that ip address

4. Change the certificates/openssl.cnf `commonName` and both `subjectAltName` to that ip address and `countryName`, `stateOrProvinceName` and `organizationName` to match your information

5. Install `openssl` https://www.openssl.org/

6. Generate the certificates by running on the terminal `sh generate-certificate.sh` inside the certificates folder

7. Run `npm install` from the RoleModels folder root

8. Run `npm install` from the RoleModels folder root/tinylicious

9. Run `npm run start` to start both the client and server

10. Navigate to `https://{your-ip}:8080` in a browser tab

11. To be able to do a secure connection with the website it is needed to install the certificate. For that we can click Download Certificate button on the Information page or install the host.crt from the certificates folder.

   **Windows**: Double click the certificate and ensure that it says `Trusted Root Certificate Authorities` and click on "Next".   
   ![alt text](https://support.securly.com/hc/article_attachments/360042040454/windowssl10.png)
   
   **MacOs**: Double click the certificate. It will open the Keychain Access, double click the newly installed certificate, `Trust > When using this certificate ` change to `Always trust`
   
   **iOS**: Download the certificate and open it. It will download a profile. `Settings > View Profile > Install` and then `General > About > Certificate Trust Settings` > make sure the ip adress is enabled in Enable full trust for root certificates.

   **Android**: https://support.securly.com/hc/en-us/articles/212869927-Android-Certificate-Manual-Install
   
Additional info: (To run as a desktop app)
1. Change the `electron/main.ts` IP to that ip address
2. To run as a desktop app run `npm run electron:start` to start both the client and server
