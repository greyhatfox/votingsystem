let web3;
let contract;
let account;

const contractAddress = "0x67b834076d6FaD0A6b324CFCA97a323d0c8094ff";

const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [{"internalType":"string","name":"_name","type":"string"}],
        "name":"addCandidate",
        "outputs":[],
        "stateMutability":"nonpayable",
        "type":"function"
    },
    {
        "inputs":[{"internalType":"uint256","name":"_candidateId","type":"uint256"}],
        "name":"vote",
        "outputs":[],
        "stateMutability":"nonpayable",
        "type":"function"
    },
    {
        "inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],
        "name":"getCandidate",
        "outputs":[
            {"internalType":"string","name":"","type":"string"},
            {"internalType":"uint256","name":"","type":"uint256"}
        ],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "name":"candidates",
        "outputs":[
            {"internalType":"uint256","name":"id","type":"uint256"},
            {"internalType":"string","name":"name","type":"string"},
            {"internalType":"uint256","name":"voteCount","type":"uint256"}
        ],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[{"internalType":"address","name":"","type":"address"}],
        "name":"hasVoted",
        "outputs":[{"internalType":"bool","name":"","type":"bool"}],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "inputs":[],
        "name":"candidatesCount",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "stateMutability":"view",
        "type":"function"
    }
];

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        account = accounts[0];
        document.getElementById("account").innerText = "Connected: " + account;

        contract = new web3.eth.Contract(abi, contractAddress);
        loadCandidates();
    } else {
        alert("MetaMask not found");
    }
}

async function loadCandidates() {
    const count = await contract.methods.candidatesCount().call();
    const list = document.getElementById("candidateList");
    list.innerHTML = "";

    for (let i = 1; i <= count; i++) {
        const candidate = await contract.methods.candidates(i).call();

        const li = document.createElement("li");
        li.innerHTML = `
            <b>${candidate.name}</b> — Votes: ${candidate.voteCount}
            <button onclick="vote(${candidate.id})">Vote</button>
        `;
        list.appendChild(li);
    }
}

async function vote(id) {
    try {
        await contract.methods.vote(id).send({ from: account });
        alert("Vote successful!");
        loadCandidates();
    } catch (err) {
        alert(err.message);
    }
}
