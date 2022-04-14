// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract MultiSigWallet {
    // Events - tracking deposit, submit, confirm, revoke, execute
    event Deposit(address indexed sender, uint256 amount, uint256 balance);
    event SubmitTransaction(
        address indexed approver,
        uint256 indexed txIndex,
        address indexed to,
        uint256 amount,
        bytes data // in the case of calling another contract, store tx data that is sent to that contract (like a function of that contract)
    );
    event ApproveTransaction(address indexed approver, uint256 indexed txIndex);
    event RevokeApproval(address indexed approver, uint256 indexed txIndex);
    event ExecuteTransaction(address indexed approver, uint256 indexed txIndex);

    // array of approvers
    address[] public approvers;
    // mapping to set who is an approver (everyone else isn't: "false")
    mapping(address => bool) public isApprover;
    // variable to set desired num of confirmations (see constructor)
    uint256 public numApprovalsRequired;

    // struct of a Transaction:
    // 1. address sending transaction to
    // 2. amount in Wei
    // 3. if calling another transaction, data is the transaction
    //    data that is sent to the called contract
    //    for example calling a function of another contract:
    //    abi.encodeWithSignature("functionName(type of parameter/s)", arg/s)
    //  Otherwise set this field to 0x00 --> which is no data (zero bytes)
    // 4. determine whether tx has been executed or not
    // 5. track the transactions approvals (will be compared to required number)
    struct Transaction {
        address to;
        uint256 amount;
        bytes data;
        bool isExecuted;
        uint256 numApprovals;
    }

    // mapping from transaction index (txIndex) to Approver to bool
    // tracks which approvers have approved this transaction
    mapping(uint256 => mapping(address => bool)) public isApproved;

    // array of transactions
    Transaction[] public transactions;

    // Modifiers - append to funcs to give them this functionality
    // requires the sender to be an approver
    modifier onlyApprover() {
        require(isApprover[msg.sender], "not an approver");
        _;
    }

    // transaction must exist (be in array)
    modifier txExists(uint256 _txIndex) {
        require(_txIndex < transactions.length, "tx does not exist");
        _;
    }

    // require transaction to not be executed (transaction.isExecuted == false)
    modifier notExecuted(uint256 _txIndex) {
        require(!transactions[_txIndex].isExecuted, "tx already executed!");
        _;
    }

    // checking if sender approved the tx
    modifier notApproved(uint256 _txIndex) {
        require(!isApproved[_txIndex][msg.sender], "tx already confirmed");
        _;
    }

    // Constructor: only called upon contract initialization
    constructor(address[] memory _approvers, uint256 _numApprovalsRequired) {
        //require at least one approver
        require(_approvers.length > 0, "approvers required");
        // require at least one approval and can't be more than number of approvers
        require(
            _numApprovalsRequired > 0 &&
                _numApprovalsRequired <= _approvers.length,
            " invalid number of required approvals"
        );

        //loop through address array and add as approvers
        for (uint256 i = 0; i < _approvers.length; ++i) {
            address approver = _approvers[i];

            // not special case (new contract initializer target)
            require(approver != address(0), "invalid approver");
            // must be new approver
            require(!isApprover[approver], "already an approver");

            // adding address as an approver
            isApprover[approver] = true;
            approvers.push(approver);
        }

        // set approval requirement
        numApprovalsRequired = _numApprovalsRequired;
    }

    // contract function to receive money
    // emits who sent, how much, contracts balance
    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    // only approvers can submit transactions
    // if not sending to anther smart contract set data = 0x00
    function submitTransaction(
        address _to,
        uint256 _amount,
        bytes memory _data
    ) public onlyApprover {
        // this transactions index will be end of array
        uint256 txIndex = transactions.length;
        // add transaction to array
        transactions.push(
            Transaction({
                to: _to,
                amount: _amount,
                data: _data,
                isExecuted: false,
                numApprovals: 0
            })
        );
        // emit who sent, tx index, to who, amount, data (if any)
        emit SubmitTransaction(msg.sender, txIndex, _to, _amount, _data);
    }

    // to approve, must be approver and
    // tx must exist and not be executed or approved
    function approveTransaction(uint256 _txIndex)
        public
        onlyApprover
        txExists(_txIndex)
        notExecuted(_txIndex)
        notApproved(_txIndex)
    {
        // getting specific transaction from storage
        Transaction storage transaction = transactions[_txIndex];
        // increment approval count
        transaction.numApprovals += 1;
        // set confirmed by sender
        isApproved[_txIndex][msg.sender] = true;

        // emit who approved and tx index
        emit ApproveTransaction(msg.sender, _txIndex);
    }

    // to revoke approval, must be an approver
    // tx must exist and not be executed already
    function revokeApproval(uint256 _txIndex)
        public
        onlyApprover
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];
        // tx must be confirmed by revoker
        require(
            isApproved[_txIndex][msg.sender],
            "tx not confirmed by this approver"
        );

        // decrement approval count and set not approved by the sender
        transaction.numApprovals -= 1;
        isApproved[_txIndex][msg.sender] = false;

        // emit who revoked, tx index
        emit RevokeApproval(msg.sender, _txIndex);
    }

    // to execute, must to approver,
    // and tx must exist and not be executed
    function executeTransaction(uint256 _txIndex)
        public
        onlyApprover
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];
        // must be approved enough times
        require(
            transaction.numApprovals >= numApprovalsRequired,
            "not enough approvals"
        );
        // need to have enough money on contract in order to execute
        require(
            address(this).balance >= transaction.amount,
            "not enough funds in contract"
        );
        //set executed to true
        transaction.isExecuted = true;
        // sending transaction with "address".call
        // .call{takes a value in wei, and optionally gas: in wei}(here is where data sent to another function is put)
        //  for example: (abi.encodeWithSignature("someFunction(uint256)", _arg1))
        // .call returns 2 args (status of call (boolean), returned data of call (tuple --> bytes memory result))
        // the return values of the contract function called would need to be decoded using abi.decode
        // ex: (uint a, uint b) = abi.decode(result, (uint, uint));
        // only success/failure used here.
        (bool success, ) = transaction.to.call{value: transaction.amount}(
            transaction.data
        );
        require(success, "tx failed");

        // emit who executed tx, tx index
        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    // these getters may not be neccesary since all variables are public
    // and by default have getters generated for them....
    // getter for approvers
    function getApprovers() public view returns (address[] memory) {
        return approvers;
    }

    // getter for number of transactions
    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    // getter for a transaction
    function getTransaction(uint256 _txIndex)
        public
        view
        returns (
            address to,
            uint256 amount,
            bytes memory data,
            bool isExecuted,
            uint256 numApprovals
        )
    {
        Transaction storage transaction = transactions[_txIndex];
        return (
            transaction.to,
            transaction.amount,
            transaction.data,
            transaction.isExecuted,
            transaction.numApprovals
        );
    }
}
