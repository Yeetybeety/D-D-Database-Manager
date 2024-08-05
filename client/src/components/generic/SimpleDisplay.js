import { CoinIcon } from '../generic/Icons';

const SimpleDisplay = ({ label, value, icon }) => (
    <div className="flex justify-between">
        <span className="font-medium">{label}:</span>
        <div className="flex">
            <span>{value}</span>
            {icon ? <CoinIcon className="ml-1" /> : null}
        </div>
    </div>
);

export default SimpleDisplay;