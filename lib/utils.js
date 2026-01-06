// Utility functions

export function formatDate(dateString, locale = 'tr') {
    if (!dateString) return null;

    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long' };

    return new Intl.DateTimeFormat(locale, options).format(date);
}

export function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}
