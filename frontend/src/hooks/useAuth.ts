import { useState, useEffect } from 'react';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Auth check logic
        setLoading(false);
    }, []);

    return { user, loading };
};
