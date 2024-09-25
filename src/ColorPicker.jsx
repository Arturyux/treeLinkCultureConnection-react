/* eslint-disable react/prop-types */
function ColorPicker({ onSelectColor }) {
  const colors = [
    'bg-red-100', 'bg-red-200', 'bg-red-300', 'bg-red-400', 'bg-red-500',
    'bg-orange-100', 'bg-orange-200', 'bg-orange-300', 'bg-orange-400', 'bg-orange-500',
    'bg-yellow-100', 'bg-yellow-200', 'bg-yellow-300', 'bg-yellow-400', 'bg-yellow-500',
    'bg-green-100', 'bg-green-200', 'bg-green-300', 'bg-green-400', 'bg-green-500',
    'bg-blue-100', 'bg-blue-200', 'bg-blue-300', 'bg-blue-400', 'bg-blue-500',
    'bg-indigo-100', 'bg-indigo-200', 'bg-indigo-300', 'bg-indigo-400', 'bg-indigo-500',
    'bg-purple-100', 'bg-purple-200', 'bg-purple-300', 'bg-purple-400', 'bg-purple-500',
    'bg-pink-100', 'bg-pink-200', 'bg-pink-300', 'bg-pink-400', 'bg-pink-500',
    // Add more colors as needed
  ];

  return (
    <div className="grid grid-cols-5 gap-2">
      {colors.map((colorClass) => (
        <div
          key={colorClass}
          className={`${colorClass} w-10 h-10 rounded cursor-pointer border border-gray-300`}
          onClick={() => onSelectColor(colorClass)}
          title={colorClass}
        />
      ))}
    </div>
  );
}

export default ColorPicker;