import React from 'react'

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700" />
    </div>
  );
}

export default Loader