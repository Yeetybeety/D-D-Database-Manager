const ProgressBar = ({ current, max, label, color }) => (
    <div className="mb-2">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-white">{label}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className={`h-2.5 rounded-full ${color}`}
          style={{ width: `${(current / max) * 100}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
        {current} / {max}
      </div>
    </div>
  );


export default ProgressBar;