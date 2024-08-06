-- drop existing tables if they exist
DROP TABLE IF EXISTS Consumable;
DROP TABLE IF EXISTS Material;
DROP TABLE IF EXISTS Armour;
DROP TABLE IF EXISTS Weapon;
DROP TABLE IF EXISTS EquipmentStat;
DROP TABLE IF EXISTS Equipment;
DROP TABLE IF EXISTS Inventory;
DROP TABLE IF EXISTS AcceptedQuest;
DROP TABLE IF EXISTS Quest;
DROP TABLE IF EXISTS EventLog;
DROP TABLE IF EXISTS NPCStat;
DROP TABLE IF EXISTS PlayerStat;
DROP TABLE IF EXISTS NPC2;
DROP TABLE IF EXISTS NPC1;
DROP TABLE IF EXISTS Player;
DROP TABLE IF EXISTS Player1;
DROP TABLE IF EXISTS Item;
DROP TABLE IF EXISTS Location;
DROP TABLE IF EXISTS Campaign;

-- create table statements

CREATE TABLE Campaign (
    CampaignID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(255) NOT NULL UNIQUE,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL
);

CREATE TABLE Location (
    LocationID INT PRIMARY KEY AUTO_INCREMENT,
    LocationName VARCHAR(50) NOT NULL UNIQUE,
    Description VARCHAR(255) NOT NULL,
    ParentLocationID INT,
    FOREIGN KEY (ParentLocationID) REFERENCES Location(LocationID) ON DELETE CASCADE
);

CREATE TABLE Item (
    ItemID INT PRIMARY KEY AUTO_INCREMENT,
    ItemName VARCHAR(50) NOT NULL UNIQUE,
    ItemType VARCHAR(20) NOT NULL,
    Rarity VARCHAR(20) NOT NULL,
    Description VARCHAR(255)
);

CREATE TABLE Player1 (
    Class VARCHAR(255) NOT NULL,
    Level INT NOT NULL,
    MaxHealth INT NOT NULL,
    MaxMana INT NOT NULL,
    PRIMARY KEY (Class, Level)
);

CREATE TABLE Player (
    PlayerID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(255) NOT NULL UNIQUE,
    Class VARCHAR(255) NOT NULL,
    Level INT NOT NULL,
    Exp INT NOT NULL,
    Health INT NOT NULL,
    MaxHealth INT NOT NULL,
    Mana INT NOT NULL,
    MaxMana INT NOT NULL,
    Gold INT NOT NULL,
    CampaignID INT NOT NULL,
    LocationID INT NOT NULL,
    Notes TEXT,
    WeaponID INT,
    ArmourID INT,
    ConsumableID INT,
    FOREIGN KEY (CampaignID) REFERENCES Campaign(CampaignID) ON DELETE CASCADE,
    FOREIGN KEY (LocationID) REFERENCES Location(LocationID) ON DELETE CASCADE,
    FOREIGN KEY (WeaponID) REFERENCES Item(ItemID) ON DELETE SET NULL,
    FOREIGN KEY (ArmourID) REFERENCES Item(ItemID) ON DELETE SET NULL,
    FOREIGN KEY (ConsumableID) REFERENCES Item(ItemID) ON DELETE SET NULL,
    FOREIGN KEY (Class, Level) REFERENCES Player1(Class, Level)
);

CREATE TABLE NPC1 (
    Race VARCHAR(20) NOT NULL,
    Level INT NOT NULL,
    MaxHealth INT NOT NULL,
    PRIMARY KEY (Race, Level)
);

CREATE TABLE NPC2 (
    NPC2ID INT PRIMARY KEY,
    NPCName VARCHAR(50) NOT NULL,
    Description VARCHAR(255) NOT NULL,
    Race VARCHAR(20) NOT NULL,
    Level INT NOT NULL,
    Health INT NOT NULL,
    AIBehaviour VARCHAR(255) NOT NULL,
    LocationID INT NOT NULL,
    FOREIGN KEY (Race, Level) REFERENCES NPC1(Race, Level),
    FOREIGN KEY (LocationID) REFERENCES Location(LocationID) ON DELETE CASCADE
);

CREATE TABLE PlayerStat (
    PlayerID INT NOT NULL,
    StatName VARCHAR(20) NOT NULL,
    StatValue INT NOT NULL,
    PRIMARY KEY (PlayerID, StatName),
    FOREIGN KEY (PlayerID) REFERENCES Player(PlayerID) ON DELETE CASCADE
);

CREATE TABLE NPCStat (
    NPCID INT NOT NULL,
    StatName VARCHAR(20) NOT NULL,
    StatValue INT NOT NULL,
    PRIMARY KEY (NPCID, StatName),
    FOREIGN KEY (NPCID) REFERENCES NPC2(NPC2ID) ON DELETE CASCADE
);

CREATE TABLE EventLog (
    EventLogID INT PRIMARY KEY AUTO_INCREMENT,
    Description VARCHAR(255) NOT NULL,
    PlayerAction VARCHAR(255) NOT NULL,
    CampaignID INT NOT NULL,
    FOREIGN KEY (CampaignID) REFERENCES Campaign(CampaignID) ON DELETE CASCADE
);

CREATE TABLE Quest (
    QuestID INT PRIMARY KEY AUTO_INCREMENT,
    QuestName VARCHAR(50) NOT NULL,
    Description VARCHAR(255) NOT NULL,
    Status VARCHAR(20) NOT NULL,
    Progress NUMERIC(5, 2) NOT NULL
);

CREATE TABLE AcceptedQuest (
    QuestID INT NOT NULL,
    PlayerID INT NOT NULL,
    PRIMARY KEY (QuestID, PlayerID),
    FOREIGN KEY (QuestID) REFERENCES Quest(QuestID) ON DELETE CASCADE,
    FOREIGN KEY (PlayerID) REFERENCES Player(PlayerID) ON DELETE CASCADE
);

CREATE TABLE Inventory (
    ItemID INT NOT NULL,
    PlayerID INT NOT NULL,
    Quantity INT NOT NULL,
    PRIMARY KEY (ItemID, PlayerID),
    FOREIGN KEY (ItemID) REFERENCES Item(ItemID) ON DELETE CASCADE,
    FOREIGN KEY (PlayerID) REFERENCES Player(PlayerID) ON DELETE CASCADE
);

CREATE TABLE Equipment (
    ItemID INT PRIMARY KEY,
    Durability INT NOT NULL,
    FOREIGN KEY (ItemID) REFERENCES Item(ItemID) ON DELETE CASCADE
);

CREATE TABLE EquipmentStat (
    ItemID INT NOT NULL,
    StatName VARCHAR(20) NOT NULL,
    StatValue INT NOT NULL,
    PRIMARY KEY (ItemID, StatName),
    FOREIGN KEY (ItemID) REFERENCES Equipment(ItemID) ON DELETE CASCADE
);

CREATE TABLE Weapon (
    ItemID INT PRIMARY KEY,
    Attack INT NOT NULL,
    FOREIGN KEY (ItemID) REFERENCES Equipment(ItemID) ON DELETE CASCADE
);

CREATE TABLE Armour (
    ItemID INT PRIMARY KEY,
    Defense INT NOT NULL,
    FOREIGN KEY (ItemID) REFERENCES Equipment(ItemID) ON DELETE CASCADE
);

CREATE TABLE Material (
    ItemID INT PRIMARY KEY,
    MaterialType VARCHAR(50) NOT NULL,
    FOREIGN KEY (ItemID) REFERENCES Item(ItemID) ON DELETE CASCADE
);

CREATE TABLE Consumable (
    ItemID INT PRIMARY KEY,
    EffectType VARCHAR(50) NOT NULL,
    EffectValue INT NOT NULL,
    Duration INT NOT NULL,
    FOREIGN KEY (ItemID) REFERENCES Item(ItemID) ON DELETE CASCADE
);

-- INSERT statements for sample data

INSERT INTO Campaign (CampaignID, Title, StartDate, EndDate) 
VALUES 
(1, 'The Great Adventure', '2024-01-01', '2024-12-31'),
(2, 'The Lost Kingdom', '2023-01-01', '2023-12-31'),
(3, 'The Dark Forest', '2022-01-01', '2022-12-31'),
(4, 'The Rising Sun', '2021-01-01', '2021-12-31'),
(5, 'The Hidden Treasure', '2020-01-01', '2020-12-31');

INSERT INTO Location (LocationID, LocationName, Description, ParentLocationID) 
VALUES 
(1, 'Elven Forest', 'A dense and dark forest.', NULL),
(2, 'Goblin Village', 'A small and dirty village.', NULL),
(3, 'Dragon''s Mountain', 'A tall and treacherous mountain.', NULL),
(4, 'Dwarven Castle', 'An old yet magnificent castle.', NULL),
(5, 'Orc Cave', 'A deep and smelly cave.', NULL);

INSERT INTO Item (ItemID, ItemName, ItemType, Rarity, Description) 
VALUES 
(1, 'Wooden Sword', 'Weapon', 'Common', 'A blunt wooden sword.'),
(2, 'Shield', 'Armor', 'Uncommon', 'A sturdy shield of steel.'),
(3, 'Healing Potion', 'Consumable', 'Rare', 'A healing potion.'),
(4, 'Elven Bow', 'Weapon', 'Epic', 'A longbow crafted from elven wood.'),
(5, 'Dwarven Helmet', 'Armor', 'Legendary', 'A helmet forged from dwarven mithril.'),
(6, 'Iron Sword', 'Weapon', 'Common', 'A basic iron sword.'),
(7, 'Steel Axe', 'Weapon', 'Uncommon', 'A sturdy steel axe.'),
(10, 'Leather Armor', 'Armor', 'Common', 'Basic leather armor.'),
(11, 'Chainmail', 'Armor', 'Uncommon', 'Sturdy chainmail armor.'),
(12, 'Plate Armor', 'Armor', 'Rare', 'Heavy plate armor.'),
(13, 'Iron Ingot', 'Material', 'Common', 'A bar of iron.'),
(14, 'Silver Ore', 'Material', 'Uncommon', 'Raw silver ore.'),
(15, 'Mana Elixir', 'Consumable', 'Uncommon', 'Restores mana.'),
(16, 'Magic Scroll', 'Consumable', 'Rare', 'A scroll with magical properties.'),
(17, 'Smoke Bomb', 'Consumable', 'Uncommon', 'Creates a cloud of smoke.'),
(18, 'Roasted Meat', 'Consumable', 'Common', 'Restores health.'),
(19, 'Wood Log', 'Material', 'Common', 'A sturdy log of wood.'),
(21, 'Mithril Ore', 'Material', 'Epic', 'Raw mithril ore, extremely rare and valuable.'),
(22, 'Leather Hide', 'Material', 'Common', 'Tanned leather hide from an animal.');

INSERT INTO Player1 (Class, Level, MaxHealth, MaxMana) 
VALUES 
('Warrior', 10, 100, 50),
('Mage', 8, 80, 100),
('Assassin', 12, 90, 60),
('Cleric', 15, 120, 80),
('Archer', 7, 70, 40);

INSERT INTO Player (PlayerID, Username, Class, Level, Exp, Health, MaxHealth, Mana, MaxMana, Gold, CampaignID, LocationID) 
VALUES 
(1, 'PlayerOne', 'Warrior', 10, 2500, 100, 100, 50, 50, 500, 1, 1),
(2, 'PlayerTwo', 'Mage', 8, 2000, 80, 80, 100, 100, 300, 1, 2),
(3, 'PlayerThree', 'Assassin', 12, 3000, 90, 90, 60, 60, 400, 2, 3),
(4, 'PlayerFour', 'Cleric', 15, 3500, 120, 120, 80, 80, 600, 2, 4),
(5, 'PlayerFive', 'Archer', 7, 1800, 70, 70, 40, 40, 200, 3, 5);

INSERT INTO NPC1 (Race, Level, MaxHealth) 
VALUES 
('Goblin', 5, 50),
('Orc', 10, 100),
('Elf', 8, 80),
('Dwarf', 12, 120),
('Dragon', 20, 200);

INSERT INTO NPC2 (NPC2ID, NPCName, Description, Race, Level, Health, AIBehaviour, LocationID) 
VALUES 
(1, 'Pitnik', 'A small green goblin.', 'Goblin', 5, 50, 'Hostile', 2),
(2, 'Bolg', 'A large gray orc.', 'Orc', 10, 100, 'Hostile', 5),
(3, 'Sylphie', 'A slender elf.', 'Elf', 8, 80, 'Neutral', 1),
(4, 'Dain', 'A stout dwarf.', 'Dwarf', 12, 120, 'Friendly', 4),
(5, 'Olwen', 'A fearsome dragon.', 'Dragon', 20, 200, 'Hostile', 3);

INSERT INTO PlayerStat (PlayerID, StatName, StatValue) 
VALUES 
(1, 'STR', 15),
(2, 'INT', 20),
(3, 'AGI', 18),
(4, 'VIT', 22),
(5, 'DEX', 12);

INSERT INTO NPCStat (NPCID, StatName, StatValue) 
VALUES 
(1, 'STR', 10),
(2, 'INT', 8),
(3, 'AGI', 12),
(4, 'VIT', 14),
(5, 'DEX', 18);

INSERT INTO EventLog (EventLogID, Description, PlayerAction, CampaignID) 
VALUES 
(1, 'PlayerOne defeated Goblin', 'Attack', 1),
(2, 'PlayerTwo found a treasure chest', 'Search', 1),
(3, 'PlayerThree completed a quest', 'Claim', 2),
(4, 'PlayerFour healed PlayerFive', 'Heal', 2),
(5, 'PlayerFive discovered a secret passage', 'Explore', 3);

INSERT INTO Quest (QuestID, QuestName, Description, Status, Progress) 
VALUES 
(1, 'Defeat the Dragon', 'Defeat the dragon in the mountain.', 'In Progress', 50.00),
(2, 'Find the Lost Treasure', 'Locate and retrieve the lost treasure.', 'Completed', 100.00),
(3, 'Save the Village', 'Protect the village from the invading forces.', 'In Progress', 73.45),
(4, 'Rescue the Royal Family', 'Rescue the kidnapped royal family.', 'Not Started', 0.00),
(5, 'Destroy the Evil Artifact', 'Destroy the artifact causing chaos.', 'Completed', 100.00);

INSERT INTO AcceptedQuest (QuestID, PlayerID) 
VALUES 
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

INSERT INTO Inventory (ItemID, PlayerID, Quantity) 
VALUES 
(1, 1, 2),
(2, 1, 2),
(3, 1, 2),
(4, 1, 2),
(5, 1, 2),
(6, 1, 2),
(7, 1, 2),
(10, 1, 2),
(11, 1, 2),
(12, 1, 2),
(13, 1, 2),
(14, 1, 2),
(15, 1, 2),
(16, 1, 2),
(17, 1, 2),
(18, 1, 2),
(19, 1, 2),
(21, 1, 2),
(22, 1, 2),
(2, 2, 1),
(3, 3, 5),
(4, 4, 1),
(5, 5, 3);

INSERT INTO Equipment (ItemID, Durability) 
VALUES 
(1, 80),
(2, 60),
(4, 100),
(5, 50),
(6, 70),
(7, 75),
(10, 55),
(11, 65),
(12, 95);


INSERT INTO EquipmentStat (ItemID, StatName, StatValue) 
VALUES 
(1, 'STR', 10),
(2, 'VIT', 20),
(4, 'AGI', 40),
(5, 'INT', 15),
(6, 'STR', 8),
(7, 'STR', 12),
(10, 'DEF', 5),
(11, 'DEF', 10),
(12, 'DEF', 20);

INSERT INTO Weapon (ItemID, Attack) 
VALUES 
(1, 15),
(4, 25),
(6, 20),
(7, 30);

INSERT INTO Armour (ItemID, Defense) 
VALUES 
(2, 10),
(5, 30),
(10, 8),
(11, 15),
(12, 25);

INSERT INTO Material (ItemID, MaterialType) 
VALUES 
(13, 'Iron'),
(14, 'Silver'),
(19, 'Wood'),
(21, 'Mithril'),
(22, 'Leather');

INSERT INTO Consumable (ItemID, EffectType, EffectValue, Duration) 
VALUES 
(3, 'Healing', 50, 0),
(15, 'Mana Restore', 40, 0),
(16, 'Temporary Buff', 20, 300),
(17, 'Area Effect', 0, 10),
(18, 'Healing', 25, 0);

-- Constraints

-- ensure player health does not exceed max health
ALTER TABLE Player
ADD CONSTRAINT check_player_health
CHECK (Health <= MaxHealth);

-- ensure player mana does not exceed max mana
ALTER TABLE Player
ADD CONSTRAINT check_player_mana
CHECK (Mana <= MaxMana);

-- Ensure that quest progress is between 0 and 100
ALTER TABLE Quest
ADD CONSTRAINT check_quest_progress
CHECK (Progress >= 0 AND Progress <= 100);

-- ensue item quantity in inventory is positive
ALTER TABLE Inventory
ADD CONSTRAINT check_inventory_quantity
CHECK (Quantity > 0);

-- ensure equipment durability is between 0 and 100
ALTER TABLE Equipment
ADD CONSTRAINT check_equipment_durability
CHECK (Durability >= 0 AND Durability <= 100);

-- ensure consumable duration is non-negative
ALTER TABLE Consumable
ADD CONSTRAINT check_consumable_duration
CHECK (Duration >= 0);