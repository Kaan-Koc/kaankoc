'use client';

import { createContext, useContext } from 'react';

const I18nContext = createContext({ locale: 'tr', messages: {} });

export function I18nProvider({ locale, messages, children }) {
    return (
        <I18nContext.Provider value={{ locale, messages }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useTranslations(namespace) {
    const { messages } = useContext(I18nContext);

    return (key) => {
        const keys = namespace ? `${namespace}.${key}` : key;
        const value = keys.split('.').reduce((obj, k) => obj?.[k], messages);
        return value || key;
    };
}

export function useLocale() {
    const { locale } = useContext(I18nContext);
    return locale;
}
