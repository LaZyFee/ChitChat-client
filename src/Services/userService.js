export const fetchUsers = async (token) => {
    try {
        const response = await fetch('http://localhost:5000/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
};
