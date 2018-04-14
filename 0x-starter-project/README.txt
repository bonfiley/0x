Contains my own experiments with 0x-starter-project.  

I have used version 22b890c96af7a492358ca52f1b7002817e86afd5 of the above project. 

- Run a local Kovan node using Parity
- Create a few accounts (at least 3).
- Install Metamask chrome plugin. Add the above accounts into Metamask using
  chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/popup.html
- Check balances of these accounts using this portal:
  https://0xproject.com/portal/balances
- Top up these accounts with ZRX and ETH - at least 0.5 for both for each account.
- Add WETH too, at least 0.5. (Note that tutorial scripts have code to convert
ETH to WETH. For now, I have changed the amount there to 0 'cause my accounts already had WETH, so didn't want to keep coverting all the ETH to WETH.)
- Compile the above project.
- Replace package.json with the one provided here.
- Add all other my_*.js files in their respective locations in 0x-starter-project

For Relayer
- Install Flask and Flask Sockets:
  https://github.com/kennethreitz/flask-sockets

- Run the relayer scripts from my_relay based on tutorial. (Open the python files to see which tutorial it applies to).


