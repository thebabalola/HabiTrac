// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract HabiTrac is Ownable {
    struct Habit {
        uint256 id;
        string name;
        string description;
        address owner;
        uint256 createdAt;
        bool isActive;
    }

    struct HabitLog {
        uint256 habitId;
        uint256 timestamp;
        bool logged;
    }

    mapping(address => Habit[]) public userHabits;
    mapping(uint256 => address) public habitOwners;
    mapping(address => mapping(uint256 => HabitLog[])) public habitLogs;
    mapping(address => mapping(uint256 => uint256)) public habitStreaks;
    mapping(address => mapping(uint256 => uint256)) public totalLoggedDays;

    uint256 public habitCounter;
    address[] public users;

    event HabitCreated(address indexed user, uint256 indexed habitId, string name);
    event HabitLogged(address indexed user, uint256 indexed habitId, uint256 timestamp);
    event HabitDeleted(address indexed user, uint256 indexed habitId);

    constructor() Ownable(msg.sender) {}

    function createHabit(
        string memory _name,
        string memory _description
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Habit name cannot be empty");
        
        uint256 habitId = habitCounter++;
        Habit memory newHabit = Habit({
            id: habitId,
            name: _name,
            description: _description,
            owner: msg.sender,
            createdAt: block.timestamp,
            isActive: true
        });

        userHabits[msg.sender].push(newHabit);
        habitOwners[habitId] = msg.sender;
        
        // Track unique users
        if (userHabits[msg.sender].length == 1) {
            users.push(msg.sender);
        }

        emit HabitCreated(msg.sender, habitId, _name);
        return habitId;
    }

    function logHabit(uint256 _habitId, uint256 _timestamp) public {
        require(_habitId < habitCounter, "Habit does not exist");
        require(habitOwners[_habitId] == msg.sender, "Not the habit owner");
        
        // Find the habit in user's habits array
        Habit[] storage habits = userHabits[msg.sender];
        bool found = false;
        uint256 habitIndex = 0;
        for (uint256 i = 0; i < habits.length; i++) {
            if (habits[i].id == _habitId) {
                found = true;
                habitIndex = i;
                break;
            }
        }
        require(found, "Habit not found");
        require(habits[habitIndex].isActive, "Habit is not active");

        // Check if already logged for this day
        uint256 dayStart = (_timestamp / 86400) * 86400; // Start of day in seconds
        HabitLog[] storage logs = habitLogs[msg.sender][_habitId];
        
        bool alreadyLogged = false;
        for (uint256 i = 0; i < logs.length; i++) {
            uint256 logDayStart = (logs[i].timestamp / 86400) * 86400;
            if (logDayStart == dayStart && logs[i].logged) {
                alreadyLogged = true;
                break;
            }
        }

        require(!alreadyLogged, "Habit already logged for this day");

        HabitLog memory newLog = HabitLog({
            habitId: _habitId,
            timestamp: _timestamp,
            logged: true
        });

        habitLogs[msg.sender][_habitId].push(newLog);
        totalLoggedDays[msg.sender][_habitId]++;

        // Update streak
        _updateStreak(msg.sender, _habitId, _timestamp);

        emit HabitLogged(msg.sender, _habitId, _timestamp);
    }

    function _updateStreak(address _user, uint256 _habitId, uint256 _timestamp) internal {
        HabitLog[] storage logs = habitLogs[_user][_habitId];
        if (logs.length == 0) {
            habitStreaks[_user][_habitId] = 0;
            return;
        }

        uint256 currentStreak = 0;
        uint256 dayStart = (_timestamp / 86400) * 86400;
        uint256 expectedDay = dayStart;

        // Count backwards from the most recent log
        for (uint256 i = logs.length; i > 0; i--) {
            uint256 logDayStart = (logs[i - 1].timestamp / 86400) * 86400;
            if (logDayStart == expectedDay && logs[i - 1].logged) {
                currentStreak++;
                expectedDay -= 86400; // Previous day
            } else if (logDayStart < expectedDay) {
                break; // Gap found, streak broken
            }
        }

        habitStreaks[_user][_habitId] = currentStreak;
    }

    function deleteHabit(uint256 _habitId) public {
        require(_habitId < habitCounter, "Habit does not exist");
        require(habitOwners[_habitId] == msg.sender, "Not the habit owner");
        
        // Find and deactivate the habit
        Habit[] storage habits = userHabits[msg.sender];
        for (uint256 i = 0; i < habits.length; i++) {
            if (habits[i].id == _habitId) {
                habits[i].isActive = false;
                break;
            }
        }
        
        emit HabitDeleted(msg.sender, _habitId);
    }

    function getUserHabits(address _user) public view returns (Habit[] memory) {
        return userHabits[_user];
    }

    function getHabitLogs(address _user, uint256 _habitId) public view returns (HabitLog[] memory) {
        return habitLogs[_user][_habitId];
    }

    function getHabitStreak(address _user, uint256 _habitId) public view returns (uint256) {
        return habitStreaks[_user][_habitId];
    }

    function getTotalLoggedDays(address _user, uint256 _habitId) public view returns (uint256) {
        return totalLoggedDays[_user][_habitId];
    }
}

