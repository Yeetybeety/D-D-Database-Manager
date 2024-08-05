import EquipmentSlot from "./EquipmentSlot";

const EquipmentPanel = (equippedItems, onEquip, onUnequip) => {

    return (
        <div className="equipment-panel">
            <h2 className="text-xl font-semibold mb-2">Equipment</h2>
            <div className="flex space-x-4 mb-4">
                <EquipmentSlot type="weapon" item={equippedItems.weapon} onEquip={onEquip} onUnequip={onUnequip} />
                <EquipmentSlot type="armour" item={equippedItems.armour} onEquip={onEquip} onUnequip={onUnequip} />
                <EquipmentSlot type="consumable" item={equippedItems.consumable} onEquip={onEquip} onUnequip={onUnequip} />
            </div>
        </div>
    );
}

export default EquipmentPanel;


