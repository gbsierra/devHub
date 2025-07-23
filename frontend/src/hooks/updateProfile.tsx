// Function to update user profile
export async function updateProfile(data: any) {
  try {
    const response = await fetch('http://localhost:3001/api/profile/profile-update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // ✅ required for session-based auth
        body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Profile update failed');
    }

    return await response.json(); // success response
  } catch (err) {
    console.error(err);
    throw err;
  }
}