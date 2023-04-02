import { KeyValue } from "@angular/common";
import { DateTime, DurationObjectUnits, ToRelativeUnit } from 'luxon'

export const originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
}

// Order by ascending property value
export const valueAscOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return a.value.localeCompare(b.value);
}

// Order by descending property key
export const keyDescOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
}

export var ligthenColor = (color: string, percent: number) => {
    var num = parseInt(color.replace("#", ""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        B = (num >> 8 & 0x00FF) + amt,
        G = (num & 0x0000FF) + amt;

    return `#${(0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1)}`;
};

export function dateComparedToNow(date: Date) {
    const dateTime = DateTime.fromJSDate(date);
    const considerUnits: (keyof DurationObjectUnits)[] = ["years", "months", "days", "hours", "minutes", "seconds"]
    let def = DateTime.local().diff(dateTime, considerUnits).toObject();

    let unit: ToRelativeUnit;

    considerUnits.forEach((uni) => {
        if (!unit) {
            if (def[uni] !== 0) {
                unit = uni as ToRelativeUnit;
            }
        }
    });

    return dateTime.toRelativeCalendar({ unit })

}