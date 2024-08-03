const InventoryGrid = ({ inventory }) => (
    <div className="grid grid-cols-5 gap-2 mb-4">
        {[...Array(20)].map((_, index) => (
            <div key={index} className="w-12 h-12 bg-gray-200 border border-gray-300 rounded flex items-center justify-center">
                {inventory[index] ? inventory[index].name : ''}
            </div>
        ))}
    </div>
);

export default InventoryGrid;