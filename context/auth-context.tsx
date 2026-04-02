import * as SecureStore from "expo-secure-store";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { authAPI, setAuthToken, type AuthUser } from "../app/services/api";

// ─── Types ──────────────────────────────────────────────────────────────────

type AuthContextValue = {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
};

type StoredSession = {
    access_token: string;
    user: AuthUser;
};

// ─── Constants ──────────────────────────────────────────────────────────────

const SESSION_KEY = "vehicly_auth";

// ─── Storage helpers ────────────────────────────────────────────────────────

async function saveSession(session: StoredSession): Promise<void> {
    try {
        await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
    } catch {
        // SecureStore is unavailable on some platforms/simulators — fail silently
    }
}

async function loadSession(): Promise<StoredSession | null> {
    try {
        const raw = await SecureStore.getItemAsync(SESSION_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as StoredSession;
    } catch {
        return null;
    }
}

async function clearSession(): Promise<void> {
    try {
        await SecureStore.deleteItemAsync(SESSION_KEY);
    } catch {
        // ignore
    }
}

// ─── Context ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ───────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // On mount: restore any persisted session
    useEffect(() => {
        void (async () => {
            const session = await loadSession();
            if (session) {
                setAuthToken(session.access_token);
                setUser(session.user);
            }
            setIsLoading(false);
        })();
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const result = await authAPI.login(email, password);
        setAuthToken(result.access_token);
        setUser(result.user);
        await saveSession(result);
    }, []);

    const register = useCallback(async (email: string, password: string, name: string) => {
        const result = await authAPI.register(email, password, name);
        setAuthToken(result.access_token);
        setUser(result.user);
        await saveSession(result);
    }, []);

    const logout = useCallback(async () => {
        setAuthToken(null);
        setUser(null);
        await clearSession();
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isLoading,
            isAuthenticated: user !== null,
            login,
            register,
            logout,
        }),
        [user, isLoading, login, register, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuthStore() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthStore must be used within AuthProvider");
    }
    return context;
}
