import "reflect-metadata";

import FakeUsersRepository from "@modules/users/respositories/fakes/FakeUsersRepository";
import FakeHashProvider from "@modules/users/providers/HashProvider/fakes/FakeHashProvider";
import UpdateProfileService from "@modules/users/services/UpdateProfileService";
import AppError from "@shared/errors/AppError";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfile = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('should be able to update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'André Alvim Ribeiro',
            email: 'andremail@test.com',
        });

        expect(updatedUser.name).toBe('André Alvim Ribeiro');
        expect(updatedUser.email).toBe('andremail@test.com');
    });

    it('should be able to update email to another user email', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const user = await fakeUsersRepository.create({
            name: 'Test',
            email: 'teste@example.com',
            password: '123456',
        });

        await expect(updateProfile.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'johndoe@example.com',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'André Alvim Ribeiro',
            email: 'andremail@test.com',
            old_password: '123456',
            password: '123123',
        });

        expect(updatedUser.password).toBe('123123');
    });

    it('should not be able to update the password without old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await expect(updateProfile.execute({
            user_id: user.id,
            name: 'André Alvim Ribeiro',
            email: 'andremail@test.com',
            password: '123123',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with wrong previous password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        await expect(updateProfile.execute({
            user_id: user.id,
            name: 'André Alvim Ribeiro',
            email: 'andremail@test.com',
            old_password: 'wrong-old-password',
            password: '123123',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update a non-existing user profile', async () => {
        await expect(updateProfile.execute({
            user_id: 'no-existent-user',
            email: 'noexistent@test.com',
            name: 'No Exist',
            old_password: '123456',
            password: '123456',
        })).rejects.toBeInstanceOf(AppError);
    });
});
