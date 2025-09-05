

export default function formatShortDate(d: string | number | Date, locale: string | undefined = undefined) {
if (!d) return "";
const date = new Date(d);
// Pass a locale (e.g. 'en-US') to force 3-letter English month like 'Jan'.
return date.toLocaleDateString(locale, { month: "short", day: "numeric" });
}