import React from 'react'

function UserProfileCard({ user }) {
  if (!user) {
    return (
      <div className="bg-zinc-800 rounded-lg p-6 text-white">
        <p className="text-gray-400">No user data available</p>
      </div>
    )
  }

  return (
    <div className="bg-zinc-800 rounded-lg p-6 text-white">
      <div className="text-center mb-6">
        {/* Profile Avatar */}
        <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-3xl font-bold mx-auto mb-4">
          {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
        </div>
        
        <h2 className="text-2xl font-bold">
          {user.firstName} {user.lastName}
        </h2>
        
        <p className="text-gray-400 mt-1">{user.email}</p>
        
        {/* Role Badge */}
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-3 ${
          user.role === 'OWNER' 
            ? 'bg-green-600 text-white' 
            : 'bg-blue-600 text-white'
        }`}>
          {user.role === 'OWNER' ? 'Venue Owner' : 'User'}
        </span>
      </div>

      {/* User Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <i className="ri-user-line text-gray-400"></i>
          <div>
            <p className="text-sm text-gray-400">Full Name</p>
            <p className="font-medium">{user.firstName} {user.lastName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <i className="ri-mail-line text-gray-400"></i>
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
        </div>

        {user.phoneNumber && (
          <div className="flex items-center gap-3">
            <i className="ri-phone-line text-gray-400"></i>
            <div>
              <p className="text-sm text-gray-400">Phone Number</p>
              <p className="font-medium">{user.phoneNumber}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <i className="ri-shield-user-line text-gray-400"></i>
          <div>
            <p className="text-sm text-gray-400">Account Type</p>
            <p className="font-medium">{user.role === 'OWNER' ? 'Venue Owner' : 'Regular User'}</p>
          </div>
        </div>

        {user.id && (
          <div className="flex items-center gap-3">
            <i className="ri-hashtag text-gray-400"></i>
            <div>
              <p className="text-sm text-gray-400">User ID</p>
              <p className="font-medium text-xs">{user.id}</p>
            </div>
          </div>
        )}
      </div>

      {/* Account Stats */}
      <div className="mt-6 pt-6 border-t border-zinc-700">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-400">
              {user.role === 'OWNER' ? '0' : '0'}
            </p>
            <p className="text-sm text-gray-400">
              {user.role === 'OWNER' ? 'Facilities' : 'Bookings'}
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-400">4.5</p>
            <p className="text-sm text-gray-400">Rating</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfileCard