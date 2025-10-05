document.addEventListener("DOMContentLoaded", () => {
  const contractAddress = "0x213A5BAa23737E3B64bDB49A3ab573489e574A9e";
  const contractABI = [
    {
      inputs: [{ internalType: "uint8", name: "_secret", type: "uint8" }],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        { internalType: "bytes", name: "encryptedGuess", type: "bytes" },
      ],
      name: "guess",
      outputs: [
        {
          components: [
            { internalType: "bytes", name: "ciphertext", type: "bytes" },
          ],
          internalType: "struct TFHE.ebool",
          name: "isCorrect",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  const connectButton = document.getElementById("connectButton");
  const walletAddressSpan = document.getElementById("walletAddress");
  const gameSection = document.getElementById("gameSection");
  const guessInput = document.getElementById("guessInput");
  const guessButton = document.getElementById("guessButton");
  const resultTextSpan = document.getElementById("resultText");

  let provider, signer, contract, instance;
  let userSignature;

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Por favor, instala MetaMask.");
    try {
      provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      contract = new ethers.Contract(contractAddress, contractABI, signer);
      instance = await fhevmjs.create(provider);

      walletAddressSpan.textContent = `${userAddress.substring(0, 6)}...`;
      gameSection.classList.remove("hidden");
      connectButton.classList.add("hidden");
      resultTextSpan.textContent = "¡Listo para adivinar!";
    } catch (e) {
      console.error("Error conectando:", e);
      alert("Error al conectar. Por favor, intenta de nuevo.");
    }
  };

  const guessNumber = async () => {
    if (!instance) return alert("Conecta tu wallet primero.");
    const numberToGuess = parseInt(guessInput.value);
    if (isNaN(numberToGuess) || numberToGuess < 0 || numberToGuess > 255) {
      return alert("Por favor, introduce un número válido entre 0 y 255.");
    }

    try {
      if (!userSignature) {
        resultTextSpan.textContent = "Pidiendo firma de permiso en MetaMask...";
        userSignature = await instance.getSignature(contractAddress, signer);
      }

      resultTextSpan.textContent = "Encriptando y adivinando...";
      const encryptedGuess = instance.encrypt8(numberToGuess);
      const encryptedResult = await contract.guess(encryptedGuess);
      const isCorrect = instance.decrypt(
        contractAddress,
        encryptedResult.isCorrect,
        userSignature
      );

      if (isCorrect) {
        resultTextSpan.textContent =
          "¡Felicidades, acertaste! (El número era 42)";
      } else {
        resultTextSpan.textContent = "Incorrecto. ¡Inténtalo de nuevo!";
      }
    } catch (e) {
      console.error("Error al adivinar:", e);
      resultTextSpan.textContent = "Error al procesar el intento.";
    }
  };

  connectButton.addEventListener("click", connectWallet);
  guessButton.addEventListener("click", guessNumber);
});
