// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

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
    IERC20 public rewardToken;
    
    // Reward configuration
    uint256 public constant BASE_REWARD = 1e18; // 1 token per log (with 18 decimals)
    uint256 public constant STREAK_BONUS_DIVISOR = 7; // Bonus every 7 days

    event HabitCreated(address indexed user, uint256 indexed habitId, string name);
    event HabitLogged(address indexed user, uint256 indexed habitId, uint256 timestamp);
    event HabitDeleted(address indexed user, uint256 indexed habitId);
    event RewardClaimed(address indexed user, uint256 indexed habitId, uint256 amount);

    constructor(address _rewardToken) Ownable(msg.sender) {
        require(_rewardToken != address(0), "Token address cannot be zero");
        rewardToken = IERC20(_rewardToken);
    }

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

        // Award tokens based on streak
        uint256 rewardAmount = _calculateReward(msg.sender, _habitId);
        _distributeReward(msg.sender, rewardAmount);

        emit HabitLogged(msg.sender, _habitId, _timestamp);
        emit RewardClaimed(msg.sender, _habitId, rewardAmount);
    }
    
    function _distributeReward(address _user, uint256 _amount) internal {
        if (_amount > 0 && address(rewardToken) != address(0)) {
            // Try to transfer tokens from contract balance
            // Contract owner should fund the contract with tokens
            SafeERC20.safeTransfer(rewardToken, _user, _amount);
        }
    }

    function _calculateReward(address _user, uint256 _habitId) internal view returns (uint256) {
        uint256 streak = habitStreaks[_user][_habitId];
        uint256 reward = BASE_REWARD; // Base reward for logging
        
        // Bonus for maintaining streaks (extra token every 7 days)
        if (streak > 0 && streak % STREAK_BONUS_DIVISOR == 0) {
            reward += BASE_REWARD; // Double reward on streak milestones
        }
        
        return reward;
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

    function getRewardBalance(address _user) public view returns (uint256) {
        if (address(rewardToken) == address(0)) {
            return 0;
        }
        return rewardToken.balanceOf(_user);
    }
    
    function calculateNextReward(address _user, uint256 _habitId) public view returns (uint256) {
        uint256 currentStreak = habitStreaks[_user][_habitId];
        uint256 nextStreak = currentStreak + 1;
        uint256 reward = BASE_REWARD;
        
        // Bonus for maintaining streaks (extra token every 7 days)
        if (nextStreak > 0 && nextStreak % STREAK_BONUS_DIVISOR == 0) {
            reward += BASE_REWARD; // Double reward on streak milestones
        }
        
        return reward;
    }
}

