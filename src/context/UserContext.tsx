// import React, { createContext, useEffect, useMemo, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const UserContext = createContext();

// export default UserContext;

// export function UserContextProvider({ children }) {
//     const [user, setUser] = useState(null);
//     const [delegateFromUser, setDelegateFromUser] = useState(null);
//     const [collapsed, setCollapsed] = useState(false);

//     // Chat state (if you’ll add chatbot later)
//     const [chatState, setChatState] = useState({
//         isOpen: false,
//         context: null,
//         ref: null,
//     });

//     const toggle = (value) => {
//         setCollapsed(typeof value === 'boolean' ? value : (prev) => !prev);
//     };

//     const openChat = (context, ref) => {
//         setChatState({
//             isOpen: true,
//             context: context || null,
//             ref: ref || null,
//         });
//     };

//     const closeChat = () => {
//         setChatState({
//             isOpen: false,
//             context: null,
//             ref: null,
//         });
//     };

//     // 🔁 Restore user on app start
//     useEffect(() => {
//         const restoreUser = async () => {
//             try {
//                 const storedUser = await AsyncStorage.getItem('PAYALLY_USER');
//                 const storedDelegate = await AsyncStorage.getItem('PAYALLY_DELEGATE_USER');

//                 if (storedUser) setUser(JSON.parse(storedUser));
//                 if (storedDelegate) setDelegateFromUser(JSON.parse(storedDelegate));
//             } catch (e) {
//                 console.log('Failed to restore user', e);
//             }
//         };

//         restoreUser();
//     }, []);

//     // 💾 Persist user changes
//     useEffect(() => {
//         if (user) {
//             AsyncStorage.setItem('PAYALLY_USER', JSON.stringify(user));
//         } else {
//             AsyncStorage.removeItem('PAYALLY_USER');
//         }
//     }, [user]);

//     useEffect(() => {
//         if (delegateFromUser) {
//             AsyncStorage.setItem('PAYALLY_DELEGATE_USER', JSON.stringify(delegateFromUser));
//         } else {
//             AsyncStorage.removeItem('PAYALLY_DELEGATE_USER');
//         }
//     }, [delegateFromUser]);

//     const value = useMemo(
//         () => ({
//             user,
//             setUser,

//             delegateFromUser,
//             setDelegateFromUser,

//             collapsed,
//             setCollapsed,
//             toggle,

//             chatState,
//             openChat,
//             closeChat,
//         }),
//         [user, delegateFromUser, collapsed, chatState]
//     );

//     return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
// }






//ts
import React, {
    createContext,
    useEffect,
    useMemo,
    useState,
    ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';


/* ---------------- TYPES ---------------- */

type ChatState = {
    isOpen: boolean;
    context: any;
    ref: any;
};

type UserContextType = {
    user: any;
    setUser: (user: any) => void;

    delegateFromUser: any;
    setDelegateFromUser: (user: any) => void;

    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
    toggle: (value?: boolean) => void;

    chatState: ChatState;
    openChat: (context?: any, ref?: any) => void;
    closeChat: () => void;
};

type ProviderProps = {
    children: ReactNode;
};

/* ---------------- CONTEXT ---------------- */

const UserContext = createContext < UserContextType | undefined > (undefined);

export default UserContext;

/* ---------------- PROVIDER ---------------- */

export function UserContextProvider({ children }: ProviderProps) {
    const [user, setUser] = useState < any > (null);
    const [delegateFromUser, setDelegateFromUser] = useState < any > (null);
    const [collapsed, setCollapsed] = useState < boolean > (false);

    const [chatState, setChatState] = useState < ChatState > ({
        isOpen: false,
        context: null,
        ref: null,
    });

    /* ---------------- TOGGLE SIDEBAR ---------------- */

    const toggle = (value?: boolean) => {
        setCollapsed(typeof value === 'boolean' ? value : (prev) => !prev);
    };

    /* ---------------- CHAT HANDLERS ---------------- */

    const openChat = (context?: any, ref?: any) => {
        setChatState({
            isOpen: true,
            context: context || null,
            ref: ref || null,
        });
    };

    const closeChat = () => {
        setChatState({
            isOpen: false,
            context: null,
            ref: null,
        });
    };

    /* ---------------- RESTORE USER ---------------- */

    useEffect(() => {
        const restoreUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('PAYALLY_USER');
                const storedDelegate = await AsyncStorage.getItem(
                    'PAYALLY_DELEGATE_USER'
                );

                if (storedUser) setUser(JSON.parse(storedUser));
                if (storedDelegate) setDelegateFromUser(JSON.parse(storedDelegate));
            } catch (e) {
                console.log('Failed to restore user', e);
            }
        };

        restoreUser();
    }, []);

    /* ---------------- PERSIST USER ---------------- */

    useEffect(() => {
        if (user) {
            AsyncStorage.setItem('PAYALLY_USER', JSON.stringify(user));
        } else {
            AsyncStorage.removeItem('PAYALLY_USER');
        }
    }, [user]);

    useEffect(() => {
        if (delegateFromUser) {
            AsyncStorage.setItem(
                'PAYALLY_DELEGATE_USER',
                JSON.stringify(delegateFromUser)
            );
        } else {
            AsyncStorage.removeItem('PAYALLY_DELEGATE_USER');
        }
    }, [delegateFromUser]);

    /* ---------------- CONTEXT VALUE ---------------- */

    const value = useMemo < UserContextType > (
        () => ({
            user,
            setUser,

            delegateFromUser,
            setDelegateFromUser,

            collapsed,
            setCollapsed,
            toggle,

            chatState,
            openChat,
            closeChat,
        }),
        [user, delegateFromUser, collapsed, chatState]
    );

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUserContext must be used within UserContextProvider');
  }

  return context;
};