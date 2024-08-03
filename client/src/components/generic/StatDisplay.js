import Card from './Card';
import Input from './Input';

const StatDisplay = ({ label, value, icon, onChange }) => (
    <Card className="p-2">
        <div className="flex justify-between items-center">
            <span className="font-medium">{label}:</span>
            <div className="flex items-center">
                <Input
                    type="number"
                    value={value || 0}
                    onChange={(e) => onChange(label, parseInt(e.target.value))}
                    className="w-16 mr-2 w-20"
                />
                {icon}
            </div>
        </div>
    </Card>
);

export default StatDisplay;