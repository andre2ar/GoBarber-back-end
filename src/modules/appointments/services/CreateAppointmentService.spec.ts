import CreateAppointmentService from "@modules/appointments/services/CreateAppointmentService";
import FakeAppointmentsRepository from "@modules/appointments/repositories/fakes/FakeAppointmentsRepository";
import AppError from "@shared/errors/AppError";

describe('Create Appointment', () => {
    it('should be able to create a new appointment', async function () {
        const fakeAppointmentRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateAppointmentService(fakeAppointmentRepository);

        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: '123456'
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123456');
    });

    it('should not be able to create two appointments at the same time', async function () {
        const fakeAppointmentRepository = new FakeAppointmentsRepository();
        const createAppointment = new CreateAppointmentService(fakeAppointmentRepository);

        const appointmentDate = new Date();

        await createAppointment.execute({
            date: appointmentDate,
            provider_id: '123456'
        });

        await expect(createAppointment.execute({
            date: appointmentDate,
            provider_id: '123456'
        })).rejects.toBeInstanceOf(AppError);
    });
});