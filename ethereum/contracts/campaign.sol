pragma solidity ^0.4.24;

contract CampaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }
    
    function returnAllCampaigns() public view returns(address[]) {
        return deployedCampaigns;
    }
    
}

contract Campaign {
    
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        bool denied;
        uint approvalCount;
        uint disapprovalCount;
        mapping(address => bool) approvals;
        mapping(address => bool) disapprovals;
    }
    
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    constructor(uint minimum, address campaignCreator) public {
        manager = campaignCreator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    } 
    
    function makeRequest(string description, uint value, address recipient) public {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            denied: false,
            approvalCount: 0,
            disapprovalCount: 0
        });
        
        requests.push(newRequest);
    }

    function denyRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.disapprovals[msg.sender]);
        require(!request.approvals[msg.sender]);
        
        request.disapprovals[msg.sender] = true;
        request.disapprovalCount++;

    }
    
    function approveRequest(uint index) public {
        Request storage request = requests[index];
        
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        require(!request.disapprovals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        
        require(request.approvalCount > (approversCount/2));
        require(!request.complete && !request.denied);
        
        require(request.value < address(this).balance);
        
        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function finalizeDenial(uint index) public restricted {
        Request storage request = requests[index];

        require(request.disapprovalCount > (approversCount / 2));
        require(!request.complete && !request.denied);

        request.denied = true;
    }

    function getSummary() public view returns(
      uint, uint, uint, uint, address
    ) {
        return (
        minimumContribution,
        address(this).balance,
        requests.length,
        approversCount,
        manager
        );
    }

    function getRequestsCount() public view returns(uint) {
        return requests.length;
    }
    
}