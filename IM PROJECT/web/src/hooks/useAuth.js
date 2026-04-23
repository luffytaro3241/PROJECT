import { useState, useEffect } from 'react';
import { STORAGE_KEYS, INITIAL_USERS, INITIAL_FILES } from '../constants/roles';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [usersList, setUsersList] = useState(INITIAL_USERS);
    const [files, setFiles] = useState(INITIAL_FILES);

    useEffect(() => {
        try {
            const savedAuth = localStorage.getItem(STORAGE_KEYS.AUTH);
            if (savedAuth && savedAuth !== 'null') {
                const parsedUser = JSON.parse(savedAuth);
                if (parsedUser && typeof parsedUser === 'object') {
                    setUser(parsedUser);
                }
            }

            const savedFiles = localStorage.getItem(STORAGE_KEYS.GUARDVAULT);
            if (savedFiles && savedFiles !== 'null') {
                const parsedFiles = JSON.parse(savedFiles);
                if (Array.isArray(parsedFiles)) {
                    setFiles(parsedFiles.filter(f => f && f.id && typeof f === 'object'));
                }
            }
        } catch (error) {
            console.warn("Storage exception caught. Flushing caches.", error);
            localStorage.clear();
            setFiles(INITIAL_FILES);
        }
    }, []);

    useEffect(() => {
        if (files && files.length > 0) localStorage.setItem(STORAGE_KEYS.GUARDVAULT, JSON.stringify(files));
        if (user) localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
        else localStorage.removeItem(STORAGE_KEYS.AUTH);
    }, [files, user]);

    const handleLogin = (userObj, isSignup) => {
        if (!userObj) return;
        setUser(userObj);
        if (isSignup) setUsersList(prev => Array.isArray(prev) ? [...prev, userObj] : [userObj]);
    };

    const handleLogout = () => {
        setUser(null);
    };

    return {
        user,
        usersList,
        files,
        setFiles,
        handleLogin,
        handleLogout
    };
};