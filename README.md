# Tutorial: My First Confidential dApp with FHEVM

This is a simple decentralized application (dApp) that demonstrates the power of Zama's FHEVM technology. It's a "Guess the Number" game where the secret number is encrypted in the smart contract and is never revealed.

## Live Demo
You can test this dApp live at the following link: [Pega aquí tu enlace de CodeSandbox]

## How It Works
1.  **Smart Contract (`GuessTheNumber.sol`):** A smart contract deployed on the Inco Gentry Testnet holds an encrypted secret number (uint8).
2.  **Frontend (HTML/JS):** A simple web page that allows a user to connect their wallet, encrypt a number in the browser, and send it to the contract.
3.  **Homomorphic Verification:** The contract compares the user's guess with the secret number (both encrypted) and returns an encrypted boolean (`true` if they match, `false` otherwise).
4.  **Result:** The frontend decrypts the response and tells the user if they guessed correctly, all without the secret number or the guess ever being revealed on the blockchain.

## Technology Stack
* **Solidity** for the Smart Contract.
* **Remix IDE** for compilation and deployment.
* **Inco Gentry Testnet** as the FHEVM network.
* **fhevmjs** for client-side encryption/decryption.
* **Ethers.js** for blockchain communication.
* **HTML/CSS/JavaScript** for the frontend, hosted on CodeSandbox.
