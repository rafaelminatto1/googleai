
import { Appointment, AvailabilityBlock } from '../types';

type ScheduleItem = Appointment | AvailabilityBlock;

/**
 * Checks if two schedule items overlap in time.
 * @param a The first item.
 * @param b The second item.
 * @returns True if they overlap, false otherwise.
 */
const itemsOverlap = (a: ScheduleItem, b: ScheduleItem): boolean => {
    // Ensure startTime and endTime are Date objects for comparison
    const aStart = new Date(a.startTime);
    const aEnd = new Date(a.endTime);
    const bStart = new Date(b.startTime);
    const bEnd = new Date(b.endTime);

    return aStart < bEnd && aEnd > bStart;
};

/**
 * Finds the first conflict for a set of new appointments against existing schedule items.
 * @param newAppointments An array of new appointments to check.
 * @param existingAppointments All appointments currently in the system.
 * @param availabilityBlocks All unavailability blocks.
 * @param ignoreId An optional ID of an appointment to ignore (used when editing).
 * @returns The conflicting schedule item if one is found, otherwise undefined.
 */
export const findConflict = (
    newAppointments: Appointment[],
    existingAppointments: Appointment[],
    availabilityBlocks: AvailabilityBlock[],
    ignoreId?: string
): ScheduleItem | undefined => {
    
    const relevantAppointments = existingAppointments.filter(app => app.id !== ignoreId);

    for (const newApp of newAppointments) {
        // Check for conflict with other appointments
        const appointmentConflict = relevantAppointments.find(existingApp => {
            if (newApp.therapistId === existingApp.therapistId) {
                return itemsOverlap(newApp, existingApp);
            }
            return false;
        });
        
        if (appointmentConflict) {
            return appointmentConflict;
        }

        // Check for conflict with availability blocks
        const blockConflict = availabilityBlocks.find(block => {
            if (newApp.therapistId === block.therapistId) {
                return itemsOverlap(newApp, block);
            }
            return false;
        });

        if (blockConflict) {
            return blockConflict;
        }
    }
    
    return undefined;
};
