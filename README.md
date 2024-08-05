# Project Tasks

## Frontend (Harold/Marcus)

### Character Creation and Management Frame (July 28)
- Character generation (maybe an image)
- Different customization options
- Page to view all items in inventory plus equipped items
- Should be tied to inventory management

### Campaign Generation Frame (July 30)
- Options to name campaign, length of campaign, participants, difficulty level, etc.

### Inventory Management Frame (July 31)
- Page to view all items in inventory
- Should be tied to character management

### Combat Management Frame (August 1)
- Access to inventory, different actions, etc.

### Dice Roller (August 1)

## Backend (Marshall/Marcus)

### Player Management System (July 28)
- Ability to add players (at start of campaign)
- Ability to modify player stats
- Dynamically calculate attack power, etc.
- Add/remove equipment from Player; effects on stats
- Leveling system
  - Level up should increase stats
  - Keep track of XP and level

### Inventory Management System (July 28)
- Create new items
- Add inventory items (for each player)
- Remove inventory items (for each player)
- Use inventory item (applies to each player)

### Quest Management System (July 31)
- Add quests
- Assign quests
- Remove quests
- Log quest progress
- Give out quest rewards

### Map System (August 4)
- Dynamically generates a map
- Pinpoint location for each player
- Pinpoint location for different NPCs and enemies
- Implement movement between locations

### Event Logging System (July 31)
- Add events to the log
- Modify/delete events

### NPC Management System (July 28)
- Create NPCs
- Delete NPCs
- Modify NPC stats

### Combat System (August 1)
- Attack roll mechanics
- Calculate damage based on character stats and equipment
- Defense and evasion mechanics
- Dice roll simulations
- Status effects calculations


## Calculated Stat Formulas

### Core Stats
- **Attack**: `STR * 2 + DEX * 1 + AGI * 1 + weapon attack`
- **Defense**: `VIT * 2 + WIS * 1 + armor defense`
- **Accuracy**: `DEX * 2 + INT * 1`
- **Evasion**: `AGI * 2 + DEX * 1`

### Derived Stats
- **HP**: `VIT * 5`
- **MP**: `INT * 3`

### Damage Calculation
- **Damage**: `Attack - Defense`

### Max Values
- **Max stat**: `100`
- **Max weapon stat**: `200`
- **Max accuracy/evasion**: `100%`
